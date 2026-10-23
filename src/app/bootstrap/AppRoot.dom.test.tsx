// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRoot } from './AppRoot'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})
describe('browser Auth through feature API and HTTP envelopes', () => {
  it('signs in using email, verifies session and signs out with the issued bearer', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api/v1')
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          data: {
            access_token: 'opaque-session',
            token_type: 'Bearer',
            expires_at: new Date(Date.now() + 60000).toISOString(),
          },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          data: {
            profile_id: 'student1',
            role: 'STUDENT',
            display_name: 'Synthetic Learner',
            locale: 'en',
            account_status: 'ACTIVE',
          },
        }),
      )
      .mockResolvedValueOnce(Response.json({ data: { session_id: null } }))
      .mockResolvedValueOnce(Response.json({ data: { signed_out: true } }))
    vi.stubGlobal('fetch', fetcher)
    const user = userEvent.setup()
    render(<AppRoot />)
    await user.type(screen.getByLabelText('Email'), 'learner@example.test')
    await user.type(screen.getByLabelText('Password'), 'synthetic-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(
      await screen.findByText('Signed in as Synthetic Learner.'),
    ).toBeDefined()
    expect(fetcher.mock.calls[0][0]).toBe(
      'http://localhost:3000/api/v1/auth/login',
    )
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({
      email: 'learner@example.test',
      password: 'synthetic-password',
    })
    expect(
      new Headers(fetcher.mock.calls[1][1].headers).get('Authorization'),
    ).toBe('Bearer opaque-session')
    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(await screen.findByLabelText('Email')).toBeDefined()
    const logout = fetcher.mock.calls.find(
      (call) => call[0] === 'http://localhost:3000/api/v1/auth/logout',
    )
    expect(logout?.[0]).toBe('http://localhost:3000/api/v1/auth/logout')
    expect(new Headers(logout![1].headers).get('Authorization')).toBe(
      'Bearer opaque-session',
    )
  })
  it('shows safe credential denial without raw backend details', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api/v1')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json(
          {
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'private backend detail',
            },
          },
          { status: 401 },
        ),
      ),
    )
    const user = userEvent.setup()
    render(<AppRoot />)
    await user.type(screen.getByLabelText('Email'), 'learner@example.test')
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('Invalid login credentials.')).toBeDefined()
    expect(screen.queryByText('private backend detail')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Sign out' })).toBeNull()
  })
})
