import type { AuthorizedApiRequest } from '../../../shared/api/api-client'
import { AppError } from '../../../shared/errors/app-error'
import type {
  AssessmentItem,
  AssessmentResult,
  AssessmentReview,
  AssessmentStatus,
  BrowserEventType,
  CurrentAssessment,
  ReviewQueueItem,
} from '../assessment.types'
const invalid = (): never => {
  throw new AppError(
    'unknown',
    'The assessment response could not be verified.',
  )
}
const record = (v: unknown): Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : invalid()
const str = (v: unknown): string => (typeof v === 'string' ? v : invalid())
const bool = (v: unknown): boolean => (typeof v === 'boolean' ? v : invalid())
const num = (v: unknown): number =>
  typeof v === 'number' && Number.isFinite(v) ? v : invalid()
const date = (v: unknown): string =>
  typeof v === 'string' && Number.isFinite(Date.parse(v)) ? v : invalid()
const uuid = (v: unknown): string =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  )
    ? v
    : invalid()
const statuses = [
  'CREATED',
  'ACTIVE',
  'PAUSED',
  'SUBMITTED',
  'SCORED',
  'VERIFIED',
  'FLAGGED_FOR_REVIEW',
  'INVALIDATED',
  'RETEST_REQUIRED',
]
const status = (v: unknown): AssessmentStatus =>
  typeof v === 'string' && statuses.includes(v)
    ? (v as AssessmentStatus)
    : invalid()
const data = (v: unknown) => record(record(v).data)
function result(v: unknown): AssessmentResult {
  const r = record(v)
  if (!Array.isArray(r.domains) || r.domains.length > 7) return invalid()
  return {
    session_id: uuid(r.session_id),
    status: status(r.status),
    integrity_state: str(r.integrity_state),
    ability_verified: bool(r.ability_verified),
    skip_allowed: bool(r.skip_allowed),
    review_required: bool(r.review_required),
    timed_out: bool(r.timed_out),
    calculated_at: date(r.calculated_at),
    domains: r.domains.map((value) => {
      const d = record(value)
      if (!['HIGH', 'MEDIUM', 'LOW'].includes(String(d.confidence_status)))
        return invalid()
      return {
        domain: str(d.domain),
        raw_score: num(d.raw_score),
        answered_count: num(d.answered_count),
        delivered_count: num(d.delivered_count),
        normalized_score:
          d.normalized_score === null ? null : num(d.normalized_score),
        difficulty_level:
          d.difficulty_level === null ? null : num(d.difficulty_level),
        ability_band: d.ability_band === null ? null : str(d.ability_band),
        confidence_status: d.confidence_status as 'HIGH' | 'MEDIUM' | 'LOW',
        coverage_complete: bool(d.coverage_complete),
      }
    }),
  }
}
export function createAssessmentApi(
  request: AuthorizedApiRequest,
  signal?: AbortSignal,
) {
  const get = async (path: string) =>
    request<unknown>(path, { signal, cache: 'no-store' })
  const post = async (path: string, body: unknown, key: string) =>
    request<unknown>(path, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
      body: JSON.stringify(body),
    })
  return {
    async current(): Promise<CurrentAssessment> {
      const r = data(await get('assessment/current'))
      return r.session_id === null
        ? { session_id: null }
        : { session_id: uuid(r.session_id), status: status(r.status) }
    },
    async start(key: string, retest?: string): Promise<CurrentAssessment> {
      const r = data(
        await post(
          'assessment/start',
          {
            assessment_type: 'PLACEMENT',
            ...(retest ? { retest_of_session_id: retest } : {}),
          },
          key,
        ),
      )
      return { session_id: uuid(r.session_id), status: status(r.status) }
    },
    async next(
      id: string,
    ): Promise<
      | AssessmentItem
      | { session_id: string; status: AssessmentStatus; complete: true }
    > {
      const r = data(
        await get(
          `assessment/next-question?sessionId=${encodeURIComponent(id)}`,
        ),
      )
      if (r.complete === true)
        return {
          session_id: uuid(r.session_id),
          status: status(r.status),
          complete: true,
        }
      if (
        r.question_type !== 'MULTIPLE_CHOICE' ||
        !Array.isArray(r.options) ||
        r.options.length < 2 ||
        r.options.length > 20
      )
        return invalid()
      return {
        session_id: uuid(r.session_id),
        exam_question_id: uuid(r.exam_question_id),
        sequence_no: num(r.sequence_no),
        question_type: 'MULTIPLE_CHOICE',
        prompt: { text: str(record(r.prompt).text) },
        options: r.options.map((v) => {
          const o = record(v)
          return {
            option_key: str(o.option_key),
            text: str(o.text),
            display_order: num(o.display_order),
          }
        }),
        expires_at: date(r.expires_at),
        server_time: date(r.server_time),
      }
    },
    async answer(id: string, item: string, option: string, key: string) {
      const r = data(
        await post(
          'assessment/answer',
          {
            session_id: id,
            exam_question_id: item,
            response: { option_key: option },
            answer_revision_no: 1,
          },
          key,
        ),
      )
      if (
        r.accepted !== true ||
        r.answer_revision_no !== 1 ||
        uuid(r.session_id) !== id ||
        uuid(r.exam_question_id) !== item
      )
        return invalid()
      return { session_status: status(r.session_status) }
    },
    async finish(id: string, key: string) {
      return result(
        data(await post('assessment/finish', { session_id: id }, key)),
      )
    },
    async result(id: string) {
      return result(
        data(await get(`assessment/result/${encodeURIComponent(id)}`)),
      )
    },
    async event(
      id: string,
      type: BrowserEventType,
      key: string,
      fullscreen?: boolean,
      clientTime = new Date().toISOString(),
    ) {
      const r = data(
        await post(
          'assessment/event',
          {
            session_id: id,
            event_type: type,
            client_time: clientTime,
            metadata:
              fullscreen === undefined
                ? {}
                : { fullscreen_supported: fullscreen },
          },
          key,
        ),
      )
      if (r.recorded !== true) return invalid()
    },
    async queue(cursor?: string) {
      const envelope = record(
        await get(
          `admin/assessment-reviews?page_size=20${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`,
        ),
      )
      if (!Array.isArray(envelope.data) || envelope.data.length > 20)
        return invalid()
      const meta = record(envelope.meta)
      return {
        items: envelope.data.map((v): ReviewQueueItem => {
          const r = record(v)
          return {
            session_id: uuid(r.session_id),
            student_id: uuid(r.student_id),
            student_name:
              r.student_name === undefined ? 'Learner' : str(r.student_name),
            status: status(r.status),
          }
        }),
        next_cursor: meta.next_cursor === null ? null : uuid(meta.next_cursor),
      }
    },
    async detail(id: string): Promise<AssessmentReview> {
      const r = data(
        await get(`admin/assessment-reviews/${encodeURIComponent(id)}`),
      )
      if (!Array.isArray(r.events) || r.events.length > 1000) return invalid()
      if (
        r.reviews !== undefined &&
        (!Array.isArray(r.reviews) || r.reviews.length > 100)
      )
        return invalid()
      return {
        ...result(r),
        student_id: uuid(r.student_id),
        student_name:
          r.student_name === undefined ? 'Learner' : str(r.student_name),
        integrity_score: num(r.integrity_score),
        events: r.events.map((v) => {
          const e = record(v)
          return {
            event_type: str(e.event_type),
            received_at: date(e.received_at),
            scorable: bool(e.scorable),
          }
        }),
        reviews: ((r.reviews as unknown[] | undefined) ?? []).map((v) => {
          const entry = record(v)
          if (
            !['verify', 'invalidate', 'authorize-retest'].includes(
              String(entry.action),
            )
          )
            return invalid()
          return {
            action: entry.action as
              | 'verify'
              | 'invalidate'
              | 'authorize-retest',
            reason: str(entry.reason),
            reviewer_name: str(entry.reviewer_name),
            created_at: date(entry.created_at),
            previous_status: status(entry.previous_status),
            next_status: status(entry.next_status),
          }
        }),
      }
    },
    async review(
      id: string,
      action: 'verify' | 'invalidate' | 'authorize-retest',
      reason: string,
      key: string,
    ) {
      return result(
        data(
          await post(
            `admin/assessment-reviews/${encodeURIComponent(id)}/${action}`,
            { reason },
            key,
          ),
        ),
      )
    },
  }
}
