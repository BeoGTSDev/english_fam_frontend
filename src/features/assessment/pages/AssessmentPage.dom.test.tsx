// @vitest-environment jsdom
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import { AppError } from '../../../shared/errors/app-error'
import { AssessmentPage } from './AssessmentPage'
const id = '11111111-1111-4111-8111-111111111111',
  itemId = '22222222-2222-4222-8222-222222222222'
const envelope = (data: unknown) => ({
  data,
  meta: { request_id: 'synthetic', api_version: 'v1' },
})
const question = () => ({
  session_id: id,
  exam_question_id: itemId,
  sequence_no: 1,
  question_type: 'MULTIPLE_CHOICE',
  prompt: { text: 'Choose the suitable word.' },
  options: [
    { option_key: 'A', text: 'One', display_order: 1 },
    { option_key: 'B', text: 'Two', display_order: 2 },
  ],
  expires_at: new Date(Date.now() + 60000).toISOString(),
  server_time: new Date().toISOString(),
})
const result = (status = 'VERIFIED') => ({
  session_id: id,
  status,
  integrity_state: status === 'VERIFIED' ? 'CLEAR' : 'FLAGGED_FOR_REVIEW',
  ability_verified: status === 'VERIFIED',
  skip_allowed: status === 'VERIFIED',
  review_required: status === 'FLAGGED_FOR_REVIEW',
  timed_out: false,
  calculated_at: new Date().toISOString(),
  domains: [
    {
      domain: 'VOCABULARY',
      raw_score: 2,
      answered_count: 4,
      delivered_count: 4,
      normalized_score: 0.5,
      difficulty_level: 6,
      ability_band: 'A2.1',
      confidence_status: 'HIGH',
      coverage_complete: true,
    },
  ],
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
it('runs the student flow with server acknowledgments and safe projected content', async () => {
  const request = vi.fn().mockImplementation(async (path: string) => {
    if (path === 'assessment/current') return envelope({ session_id: null })
    if (path === 'assessment/start')
      return envelope({ session_id: id, status: 'ACTIVE' })
    if (path.startsWith('assessment/next-question'))
      return envelope({ ...question(), answer_key: { private: 'hidden' } })
    if (path === 'assessment/answer')
      return envelope({
        session_id: id,
        exam_question_id: itemId,
        accepted: true,
        answer_revision_no: 1,
        session_status: 'SUBMITTED',
      })
    if (path === 'assessment/finish') return envelope(result())
    throw new Error('Unexpected test request')
  })
  const user = userEvent.setup()
  render(<AssessmentPage request={request} role="STUDENT" locale="en" />)
  await waitFor(() =>
    expect(
      (
        screen.getByRole('button', {
          name: 'Start placement',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false),
  )
  await user.click(screen.getByRole('button', { name: 'Start placement' }))
  expect(await screen.findByText('Choose the suitable word.')).toBeDefined()
  expect(
    (screen.getByRole('button', { name: 'Submit answer' }) as HTMLButtonElement)
      .disabled,
  ).toBe(true)
  await user.click(screen.getByRole('radio', { name: 'Two' }))
  await user.click(screen.getByRole('button', { name: 'Submit answer' }))
  expect(await screen.findByText('Verified', { exact: true })).toBeDefined()
  expect(screen.queryByText('hidden')).toBeNull()
  const answer = request.mock.calls.find(
    (call) => call[0] === 'assessment/answer',
  )!
  expect(JSON.parse(answer[1].body)).toEqual({
    session_id: id,
    exam_question_id: itemId,
    response: { option_key: 'B' },
    answer_revision_no: 1,
  })
})
it('freezes an uncertain answer and retries exactly the same command/key', async () => {
  let answers = 0
  const request = vi.fn().mockImplementation(async (path: string) => {
    if (path === 'assessment/current')
      return envelope({ session_id: id, status: 'ACTIVE' })
    if (path.startsWith('assessment/next-question')) return envelope(question())
    if (path === 'assessment/answer') {
      if (++answers === 1)
        throw new AppError('retryable-dependency', 'private transport detail')
      return envelope({
        session_id: id,
        exam_question_id: itemId,
        accepted: true,
        answer_revision_no: 1,
        session_status: 'SUBMITTED',
      })
    }
    if (path === 'assessment/finish') return envelope(result())
    throw new Error('Unexpected test request')
  })
  const user = userEvent.setup()
  render(<AssessmentPage request={request} role="STUDENT" locale="en" />)
  await waitFor(() =>
    expect(
      (
        screen.getByRole('button', {
          name: 'Resume assessment',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false),
  )
  await user.click(screen.getByRole('button', { name: 'Resume assessment' }))
  await screen.findByRole('radio', { name: 'Two' })
  await user.click(screen.getByRole('radio', { name: 'Two' }))
  await user.click(screen.getByRole('button', { name: 'Submit answer' }))
  const retry = await screen.findByRole('button', {
    name: 'Retry the same answer',
  })
  expect(
    (
      screen
        .getByRole('radio', { name: 'One' })
        .closest('fieldset') as HTMLFieldSetElement
    ).disabled,
  ).toBe(true)
  expect(screen.queryByText('private transport detail')).toBeNull()
  await user.click(retry)
  await screen.findByText('Verified', { exact: true })
  const commands = request.mock.calls.filter(
    (call) => call[0] === 'assessment/answer',
  )
  expect(commands).toHaveLength(2)
  expect(commands[0][1].body).toBe(commands[1][1].body)
  expect(new Headers(commands[0][1].headers).get('Idempotency-Key')).toBe(
    new Headers(commands[1][1].headers).get('Idempotency-Key'),
  )
})
it('aborts outstanding feature requests when the signed-in view unmounts', async () => {
  let resolve!: (value: unknown) => void
  const request = vi.fn().mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done
      }),
  )
  const view = render(
    <AssessmentPage request={request} role="STUDENT" locale="en" />,
  )
  const signal = request.mock.calls[0][1].signal as AbortSignal
  view.unmount()
  expect(signal.aborted).toBe(true)
  await act(async () => resolve(envelope({ session_id: null })))
  expect(request).toHaveBeenCalledOnce()
})
it('waits for authoritative timeout disposition instead of inventing completion in the browser', async () => {
  let resolve!: (value: unknown) => void
  const request = vi.fn().mockImplementation(async (path: string) => {
    if (path === 'assessment/current')
      return envelope({ session_id: id, status: 'ACTIVE' })
    if (path.startsWith('assessment/next-question'))
      return envelope({
        ...question(),
        expires_at: new Date().toISOString(),
        server_time: new Date().toISOString(),
      })
    if (path === 'assessment/finish')
      return new Promise((done) => {
        resolve = done
      })
    throw new Error('Unexpected test request')
  })
  const user = userEvent.setup()
  render(<AssessmentPage request={request} role="STUDENT" locale="en" />)
  await waitFor(() =>
    expect(
      (
        screen.getByRole('button', {
          name: 'Resume assessment',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false),
  )
  await user.click(screen.getByRole('button', { name: 'Resume assessment' }))
  await waitFor(() =>
    expect(
      request.mock.calls.some((call) => call[0] === 'assessment/finish'),
    ).toBe(true),
  )
  expect(screen.queryByText('Placement result', { exact: true })).toBeNull()
  await act(async () =>
    resolve(envelope({ ...result('FLAGGED_FOR_REVIEW'), timed_out: true })),
  )
  expect(
    await screen.findByText('Awaiting review', { exact: true }),
  ).toBeDefined()
  expect(screen.queryByText('Verified', { exact: true })).toBeNull()
})
it('renders an Admin review with bounded evidence and an audited decision', async () => {
  const flagged = result('FLAGGED_FOR_REVIEW')
  const request = vi.fn().mockImplementation(async (path: string) => {
    if (path.startsWith('admin/assessment-reviews?'))
      return {
        data: [
          {
            session_id: id,
            student_id: itemId,
            student_name: 'Synthetic Learner',
            status: 'FLAGGED_FOR_REVIEW',
          },
        ],
        meta: { next_cursor: null },
      }
    if (path.endsWith('/verify')) {
      flagged.status = 'VERIFIED'
      flagged.ability_verified = true
      flagged.skip_allowed = true
      flagged.review_required = false
      return envelope(result())
    }
    return envelope({
      ...flagged,
      student_id: itemId,
      student_name: 'Synthetic Learner',
      integrity_score: 80,
      events: [
        {
          event_type: 'WINDOW_DEPARTURE',
          received_at: new Date().toISOString(),
          scorable: true,
        },
      ],
    })
  })
  const user = userEvent.setup()
  render(<AssessmentPage request={request} role="ADMIN" locale="en" />)
  await screen.findByText('Synthetic Learner')
  await user.click(screen.getAllByRole('button', { name: 'Open review' })[1])
  await screen.findByText('Awaiting review', { exact: true })
  await user.type(
    screen.getByRole('textbox', { name: 'Review reason' }),
    'Reviewed the synthetic evidence.',
  )
  await user.click(screen.getByRole('button', { name: 'Verify result' }))
  await screen.findByText('Verified', { exact: true })
  const command = request.mock.calls.find((call) =>
    call[0].endsWith('/verify'),
  )!
  expect(JSON.parse(command[1].body)).toEqual({
    reason: 'Reviewed the synthetic evidence.',
  })
  expect(new Headers(command[1].headers).get('Idempotency-Key')).toBeTruthy()
})
it('shows unavailable configuration safely and offers retry without mock success', async () => {
  const request = vi
    .fn()
    .mockRejectedValue(
      new AppError('retryable-dependency', 'private configuration payload'),
    )
  render(<AssessmentPage request={request} role="STUDENT" locale="vi-VN" />)
  expect(await screen.findByRole('alert')).toBeDefined()
  expect(screen.queryByText('private configuration payload')).toBeNull()
  expect(screen.queryByText('Đã xác minh', { exact: true })).toBeNull()
})
