import { useEffect, useRef, useState } from 'react'
import type { AuthorizedApiRequest } from '../../../shared/api/api-client'
import type { AssessmentResult, AssessmentStatus } from '../assessment.types'
import {
  useAssessmentController,
  useAssessmentReviewController,
} from '../hooks/useAssessmentController'
const copy = {
  en: {
    title: 'English placement',
    intro:
      'Find a suitable starting point. Answer one question at a time. Your time limit continues if the connection is interrupted.',
    start: 'Start placement',
    resume: 'Resume assessment',
    retry: 'Recover current state',
    answer: 'Submit answer',
    retryAnswer: 'Retry the same answer',
    choose: 'Choose one answer',
    question: 'Question',
    remaining: 'Time remaining',
    working: 'Working…',
    error:
      'The assessment is unavailable. Retry or ask your administrator for help.',
    conflict:
      'The assessment changed on the server. Recover its current state to continue.',
    permission: 'This action is not available for your account.',
    pending:
      'The response is uncertain. Retry the same answer or recover the current server state.',
    result: 'Placement result',
    verified: 'Verified',
    review: 'Awaiting review',
    invalid: 'Not verified',
    retest: 'Retest authorized',
    submitted: 'Processing result',
    confidence: 'Confidence',
    coverage: 'Not enough evidence',
    unverified:
      'These estimates are unverified and cannot unlock ability-based skipping.',
    ready:
      'Your result has been verified. Your learning plan will use approved evidence when available.',
    timeout:
      'The assessment time limit was reached. Accepted answers have been preserved.',
    refresh: 'Refresh result',
    domain: 'Domain',
    level: 'Difficulty level',
    score: 'Correct / answered',
    reviewTitle: 'Assessment review',
    empty: 'No assessments are waiting for review.',
    open: 'Open review',
    reason: 'Review reason',
    verify: 'Verify result',
    invalidate: 'Invalidate result',
    authorize: 'Authorize retest',
    more: 'Load more',
    refreshQueue: 'Refresh queue',
    saveRetry: 'Retry review decision',
    reviewWarning:
      'Review the evidence before making a decision. Previous scores and attempts are preserved.',
    eventCount: 'Recorded integrity signals',
    reference: 'Assessment reference',
    excluded: 'Excluded or coalesced',
    integrityScore: 'Integrity score',
    history: 'Review history',
    events: {
      FULLSCREEN_EXIT: 'Exited fullscreen',
      WINDOW_DEPARTURE: 'Left the assessment window',
      CLIPBOARD_PASTE_ATTEMPT: 'Paste attempt',
      CLIPBOARD_COPY_ATTEMPT: 'Copy attempt',
      SESSION_REFRESH: 'Assessment page reloaded',
    },
    noDomain: 'No scored domain evidence is available.',
    vocabulary: 'Vocabulary',
    grammar: 'Grammar',
    reading: 'Reading',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    standard: 'Result status',
    closed: 'This assessment is closed.',
    fullscreen: 'Enter fullscreen',
    student: 'Learner',
    retention:
      'Only assessment events are recorded; there is no continuous camera or microphone recording.',
  },
  vi: {
    title: 'Đánh giá đầu vào tiếng Anh',
    intro:
      'Tìm điểm bắt đầu phù hợp. Trả lời từng câu một. Thời gian thi vẫn tiếp tục khi mất kết nối.',
    start: 'Bắt đầu đánh giá',
    resume: 'Tiếp tục bài đánh giá',
    retry: 'Khôi phục trạng thái hiện tại',
    answer: 'Gửi câu trả lời',
    retryAnswer: 'Gửi lại cùng câu trả lời',
    choose: 'Chọn một đáp án',
    question: 'Câu hỏi',
    remaining: 'Thời gian còn lại',
    working: 'Đang xử lý…',
    error:
      'Bài đánh giá chưa sẵn sàng. Hãy thử lại hoặc liên hệ quản trị viên.',
    conflict:
      'Trạng thái bài đánh giá đã thay đổi. Khôi phục trạng thái hiện tại để tiếp tục.',
    permission: 'Tài khoản của bạn không được thực hiện thao tác này.',
    pending:
      'Chưa xác nhận được phản hồi. Hãy gửi lại cùng đáp án hoặc khôi phục trạng thái trên máy chủ.',
    result: 'Kết quả đánh giá đầu vào',
    verified: 'Đã xác minh',
    review: 'Đang chờ xem xét',
    invalid: 'Chưa được xác minh',
    retest: 'Đã được phép thi lại',
    submitted: 'Đang xử lý kết quả',
    confidence: 'Độ tin cậy',
    coverage: 'Chưa đủ bằng chứng',
    unverified:
      'Ước lượng này chưa được xác minh và không cho phép bỏ qua nội dung theo năng lực.',
    ready:
      'Kết quả đã được xác minh. Kế hoạch học sẽ sử dụng bằng chứng được duyệt khi sẵn sàng.',
    timeout:
      'Đã hết thời gian đánh giá. Các câu trả lời đã nhận được giữ nguyên.',
    refresh: 'Cập nhật kết quả',
    domain: 'Kỹ năng',
    level: 'Mức độ',
    score: 'Số câu đúng / đã trả lời',
    reviewTitle: 'Xem xét bài đánh giá',
    empty: 'Không có bài đánh giá nào đang chờ xem xét.',
    open: 'Mở bài đánh giá',
    reason: 'Lý do quyết định',
    verify: 'Xác minh kết quả',
    invalidate: 'Không công nhận kết quả',
    authorize: 'Cho phép thi lại',
    more: 'Tải thêm',
    refreshQueue: 'Cập nhật danh sách',
    saveRetry: 'Gửi lại quyết định',
    reviewWarning:
      'Xem xét bằng chứng trước khi quyết định. Điểm và các lượt thi trước được giữ nguyên.',
    eventCount: 'Tín hiệu được ghi nhận',
    reference: 'Mã tham chiếu bài đánh giá',
    excluded: 'Đã loại trừ hoặc gộp',
    integrityScore: 'Điểm tính toàn vẹn',
    history: 'Lịch sử xem xét',
    events: {
      FULLSCREEN_EXIT: 'Thoát toàn màn hình',
      WINDOW_DEPARTURE: 'Rời cửa sổ đánh giá',
      CLIPBOARD_PASTE_ATTEMPT: 'Thao tác dán',
      CLIPBOARD_COPY_ATTEMPT: 'Thao tác sao chép',
      SESSION_REFRESH: 'Tải lại trang đánh giá',
    },
    noDomain: 'Chưa có bằng chứng kỹ năng được chấm.',
    vocabulary: 'Từ vựng',
    grammar: 'Ngữ pháp',
    reading: 'Đọc hiểu',
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp',
    standard: 'Trạng thái kết quả',
    closed: 'Bài đánh giá này đã đóng.',
    fullscreen: 'Mở toàn màn hình',
    student: 'Người học',
    retention:
      'Chỉ ghi nhận sự kiện trong bài đánh giá; không ghi hình hoặc thu âm liên tục.',
  },
}
type Copy = typeof copy.en
const button =
  'rounded-xl bg-[#175CD3] px-5 py-3 font-semibold text-white disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#175CD3]'
const secondary =
  'rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#175CD3]'
function label(status: AssessmentStatus, c: Copy) {
  return status === 'VERIFIED'
    ? c.verified
    : status === 'FLAGGED_FOR_REVIEW'
      ? c.review
      : status === 'RETEST_REQUIRED'
        ? c.retest
        : status === 'SUBMITTED' || status === 'SCORED'
          ? c.submitted
          : c.invalid
}
function ErrorNotice({ error, c }: { error: string; c: Copy }) {
  return error ? (
    <p
      role="alert"
      className="my-4 rounded-xl border border-amber-300 bg-amber-50 p-4"
    >
      {error === 'forbidden' || error === 'unauthenticated'
        ? c.permission
        : error === 'conflict'
          ? c.conflict
          : c.error}
    </p>
  ) : null
}
function ResultSummary({ result, c }: { result: AssessmentResult; c: Copy }) {
  return (
    <section aria-label={c.result} className="space-y-4">
      <h2 className="text-2xl font-semibold">{c.result}</h2>
      <p role="status" className="font-semibold">
        {label(result.status, c)}
      </p>
      <p>{result.ability_verified ? c.ready : c.unverified}</p>
      {result.timed_out && <p>{c.timeout}</p>}
      <details>
        <summary className="cursor-pointer text-sm text-slate-600">
          {c.reference}
        </summary>
        <p className="mt-2 break-all font-mono text-sm">{result.session_id}</p>
      </details>
      {!result.domains.length ? (
        <p>{c.noDomain}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {result.domains.map((d) => (
            <li
              key={d.domain}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <h3 className="font-semibold">
                {d.domain === 'VOCABULARY'
                  ? c.vocabulary
                  : d.domain === 'GRAMMAR'
                    ? c.grammar
                    : d.domain === 'READING'
                      ? c.reading
                      : d.domain}
              </h3>
              <dl className="mt-3 space-y-2">
                <div>
                  <dt className="text-sm text-slate-600">{c.level}</dt>
                  <dd>
                    {d.difficulty_level ?? '—'}{' '}
                    {d.ability_band ? `· ${d.ability_band}` : ''}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-600">{c.score}</dt>
                  <dd>
                    {d.raw_score} / {d.answered_count}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-600">{c.confidence}</dt>
                  <dd>
                    {d.confidence_status === 'HIGH'
                      ? c.high
                      : d.confidence_status === 'MEDIUM'
                        ? c.medium
                        : c.low}
                  </dd>
                </div>
              </dl>
              {!d.coverage_complete && (
                <p className="mt-3 text-sm text-amber-800">{c.coverage}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
function StudentAssessment({
  request,
  c,
}: {
  request: AuthorizedApiRequest
  c: Copy
}) {
  const state = useAssessmentController(request),
    [option, setOption] = useState(''),
    heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    setOption('')
    heading.current?.focus()
  }, [state.item?.exam_question_id])
  const minutes =
    state.remaining === null
      ? '—'
      : `${Math.floor(state.remaining / 60)}:${String(state.remaining % 60).padStart(2, '0')}`
  return (
    <section
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"
      aria-busy={state.busy}
    >
      {!state.result && <h2 className="text-2xl font-semibold">{c.title}</h2>}
      <ErrorNotice error={state.error} c={c} />
      {state.busy && (
        <p role="status" className="my-3">
          {c.working}
        </p>
      )}
      {state.result ? (
        <>
          <ResultSummary result={state.result} c={c} />
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className={secondary}
              disabled={state.busy}
              onClick={() => void state.resume()}
            >
              {c.refresh}
            </button>
            {state.result.status === 'RETEST_REQUIRED' && (
              <button
                className={button}
                disabled={state.busy}
                onClick={() => void state.start()}
              >
                {c.retest}
              </button>
            )}
          </div>
        </>
      ) : state.item ? (
        <>
          <div className="my-5 flex flex-wrap items-center justify-between gap-3">
            <h3 tabIndex={-1} ref={heading} className="text-lg font-semibold">
              {c.question} {state.item.sequence_no}
            </h3>
            <p className="font-mono">
              <span className="font-sans">{c.remaining}: </span>
              {minutes}
            </p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (option || state.pending)
                void state.submit(state.pending?.option ?? option)
            }}
          >
            <fieldset
              disabled={state.busy || !!state.pending || state.remaining === 0}
              className="space-y-3"
              onCopy={(event) => {
                event.preventDefault()
                state.recordEvent('CLIPBOARD_COPY_ATTEMPT')
              }}
              onPaste={(event) => {
                event.preventDefault()
                state.recordEvent('CLIPBOARD_PASTE_ATTEMPT')
              }}
            >
              <legend className="mb-5 whitespace-pre-wrap text-lg">
                {state.item.prompt.text}
              </legend>
              <p className="text-sm text-slate-600">{c.choose}</p>
              {state.item.options.map((o) => (
                <label
                  key={o.option_key}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-300 p-4 has-checked:border-[#175CD3] has-checked:bg-blue-50"
                >
                  <input
                    type="radio"
                    name="assessment-option"
                    value={o.option_key}
                    checked={(state.pending?.option ?? option) === o.option_key}
                    onChange={() => setOption(o.option_key)}
                    className="mt-1 size-4 accent-[#175CD3]"
                  />
                  <span className="whitespace-pre-wrap">{o.text}</span>
                </label>
              ))}
            </fieldset>
            {state.pending && !state.busy && (
              <p role="status" className="my-4">
                {c.pending}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                className={button}
                disabled={
                  state.busy ||
                  (!option && !state.pending) ||
                  state.remaining === 0
                }
              >
                {state.pending ? c.retryAnswer : c.answer}
              </button>
              <button
                type="button"
                className={secondary}
                disabled={state.busy}
                onClick={() => void state.resume()}
              >
                {c.retry}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="mt-5 space-y-5">
          <p>{c.intro}</p>
          <p className="text-sm text-slate-600">{c.retention}</p>
          {state.error && (
            <button
              className={secondary}
              disabled={state.busy}
              onClick={() => void state.resume()}
            >
              {c.retry}
            </button>
          )}
          <button
            className={button}
            disabled={state.busy || !state.discovered}
            onClick={() =>
              void (state.current.session_id &&
              state.current.status !== 'RETEST_REQUIRED'
                ? state.resume()
                : state.start())
            }
          >
            {state.current.session_id &&
            state.current.status !== 'RETEST_REQUIRED'
              ? c.resume
              : state.current.status === 'RETEST_REQUIRED'
                ? c.retest
                : c.start}
          </button>
          {document.fullscreenEnabled && (
            <button
              className={`${secondary} ml-3`}
              onClick={() =>
                void document.documentElement
                  .requestFullscreen()
                  .catch(() => {})
              }
            >
              {c.fullscreen}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
function AdminAssessment({
  request,
  c,
}: {
  request: AuthorizedApiRequest
  c: Copy
}) {
  const state = useAssessmentReviewController(request),
    [reason, setReason] = useState(''),
    [reference, setReference] = useState('')
  useEffect(() => setReason(''), [state.detail?.session_id])
  return (
    <section
      className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"
      aria-busy={state.busy}
    >
      <h2 className="text-2xl font-semibold">{c.reviewTitle}</h2>
      <p>{c.reviewWarning}</p>
      <ErrorNotice error={state.error} c={c} />
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          void state.open(reference.trim())
        }}
      >
        <label className="min-w-0 grow space-y-2">
          <span className="block text-sm font-medium">{c.reference}</span>
          <input
            className="w-full rounded-xl border border-slate-300 p-3"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            required
            pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}"
            disabled={state.busy}
          />
        </label>
        <button className={secondary} disabled={state.busy}>
          {c.open}
        </button>
      </form>
      {state.busy && <p role="status">{c.working}</p>}
      <button
        className={secondary}
        disabled={state.busy}
        onClick={() => void state.refresh()}
      >
        {c.refreshQueue}
      </button>
      {!state.items.length && !state.busy && !state.error && <p>{c.empty}</p>}
      <ul className="space-y-3">
        {state.items.map((item) => (
          <li
            key={item.session_id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
          >
            <span>{item.student_name}</span>
            <button
              className={secondary}
              disabled={state.busy || !!state.pending}
              onClick={() => void state.open(item.session_id)}
            >
              {c.open}
            </button>
          </li>
        ))}
      </ul>
      {state.cursor && (
        <button
          className={secondary}
          disabled={state.busy}
          onClick={() => void state.more()}
        >
          {c.more}
        </button>
      )}
      {state.detail && (
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <p className="font-semibold">
            {c.student}: {state.detail.student_name}
          </p>
          <ResultSummary result={state.detail} c={c} />
          <p>
            {c.eventCount}: {state.detail.events.length}
          </p>
          <p>
            {c.integrityScore}: {state.detail.integrity_score} / 100
          </p>
          <details>
            <summary className="cursor-pointer font-medium">
              {c.history}
            </summary>
            <ol className="mt-3 space-y-3">
              {state.detail.reviews.map((review, index) => (
                <li
                  key={`${review.created_at}-${index}`}
                  className="rounded-lg bg-slate-50 p-3 text-sm"
                >
                  <p className="font-medium">
                    {review.action === 'verify'
                      ? c.verify
                      : review.action === 'invalidate'
                        ? c.invalidate
                        : c.authorize}{' '}
                    · {review.reviewer_name}
                  </p>
                  <time dateTime={review.created_at}>
                    {new Date(review.created_at).toLocaleString(
                      c === copy.vi ? 'vi-VN' : 'en-GB',
                    )}
                  </time>
                  <p className="mt-2 whitespace-pre-wrap">{review.reason}</p>
                </li>
              ))}
            </ol>
          </details>
          <details>
            <summary className="cursor-pointer font-medium">
              {c.eventCount}
            </summary>
            <ul className="mt-3 space-y-2">
              {state.detail.events.map((event, index) => (
                <li
                  key={`${event.event_type}-${event.received_at}-${index}`}
                  className="rounded-lg bg-slate-50 p-3 text-sm"
                >
                  <span>
                    {c.events[event.event_type as keyof Copy['events']] ??
                      c.eventCount}
                  </span>
                  <time className="ml-2" dateTime={event.received_at}>
                    {new Date(event.received_at).toLocaleString(
                      c === copy.vi ? 'vi-VN' : 'en-GB',
                    )}
                  </time>
                  {!event.scorable && (
                    <span className="ml-2">· {c.excluded}</span>
                  )}
                </li>
              ))}
            </ul>
          </details>
          <button
            className={secondary}
            disabled={state.busy}
            onClick={() => void state.open(state.detail!.session_id)}
          >
            {c.retry}
          </button>
          <label className="block space-y-2">
            <span className="font-medium">{c.reason}</span>
            <textarea
              value={state.pending?.reason ?? reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={1000}
              disabled={state.busy || !!state.pending}
              rows={3}
              className="block w-full rounded-xl border border-slate-300 p-3 focus-visible:outline-2 focus-visible:outline-[#175CD3]"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            {state.pending ? (
              <button
                className={button}
                disabled={state.busy}
                onClick={() =>
                  void state.review(
                    state.pending!.action,
                    state.pending!.reason,
                  )
                }
              >
                {c.saveRetry}
              </button>
            ) : (
              <>
                <button
                  className={button}
                  disabled={
                    state.busy ||
                    !reason.trim() ||
                    state.detail.status !== 'FLAGGED_FOR_REVIEW' ||
                    state.detail.domains.some((d) => !d.coverage_complete)
                  }
                  onClick={() => void state.review('verify', reason.trim())}
                >
                  {c.verify}
                </button>
                <button
                  className={secondary}
                  disabled={
                    state.busy ||
                    !reason.trim() ||
                    state.detail.status !== 'FLAGGED_FOR_REVIEW'
                  }
                  onClick={() => void state.review('invalidate', reason.trim())}
                >
                  {c.invalidate}
                </button>
                <button
                  className={secondary}
                  disabled={
                    state.busy ||
                    !reason.trim() ||
                    !['FLAGGED_FOR_REVIEW', 'INVALIDATED'].includes(
                      state.detail.status,
                    )
                  }
                  onClick={() =>
                    void state.review('authorize-retest', reason.trim())
                  }
                >
                  {c.authorize}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
export function AssessmentPage({
  request,
  role,
  locale,
}: {
  request: AuthorizedApiRequest
  role: 'STUDENT' | 'ADMIN'
  locale: string
}) {
  const c = locale.startsWith('vi') ? copy.vi : copy.en
  return role === 'STUDENT' ? (
    <StudentAssessment request={request} c={c} />
  ) : (
    <AdminAssessment request={request} c={c} />
  )
}
