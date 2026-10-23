export type AssessmentStatus =
  | 'CREATED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'SUBMITTED'
  | 'SCORED'
  | 'VERIFIED'
  | 'FLAGGED_FOR_REVIEW'
  | 'INVALIDATED'
  | 'RETEST_REQUIRED'
export type CurrentAssessment = {
  session_id: string | null
  status?: AssessmentStatus
}
export type AssessmentItem = {
  session_id: string
  exam_question_id: string
  sequence_no: number
  question_type: 'MULTIPLE_CHOICE'
  prompt: { text: string }
  options: { option_key: string; text: string; display_order: number }[]
  expires_at: string
  server_time: string
}
export type DomainResult = {
  domain: string
  raw_score: number
  answered_count: number
  delivered_count: number
  normalized_score: number | null
  difficulty_level: number | null
  ability_band: string | null
  confidence_status: 'HIGH' | 'MEDIUM' | 'LOW'
  coverage_complete: boolean
}
export type AssessmentResult = {
  session_id: string
  status: AssessmentStatus
  integrity_state: string
  ability_verified: boolean
  skip_allowed: boolean
  review_required: boolean
  timed_out: boolean
  calculated_at: string
  domains: DomainResult[]
}
export type AssessmentReview = AssessmentResult & {
  reviews: {
    action: 'verify' | 'invalidate' | 'authorize-retest'
    reason: string
    reviewer_name: string
    created_at: string
    previous_status: AssessmentStatus
    next_status: AssessmentStatus
  }[]
  student_name: string
  student_id: string
  integrity_score: number
  events: { event_type: string; received_at: string; scorable: boolean }[]
}
export type ReviewQueueItem = {
  student_name: string
  session_id: string
  student_id: string
  status: AssessmentStatus
}
export type BrowserEventType =
  | 'FULLSCREEN_EXIT'
  | 'WINDOW_DEPARTURE'
  | 'CLIPBOARD_PASTE_ATTEMPT'
  | 'CLIPBOARD_COPY_ATTEMPT'
  | 'SESSION_REFRESH'
