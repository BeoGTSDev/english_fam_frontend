export type VersionLifecycleStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'DEPRECATED'

export type MappingRole =
  | 'PRIMARY_TARGET'
  | 'SECONDARY_TARGET'
  | 'PREREQUISITE_SUPPORT'
  | 'REVIEW_OR_REINFORCEMENT'
  | 'ENRICHMENT'

export type MappingImportance = 'REQUIRED' | 'CORE' | 'SUPPORTING' | 'OPTIONAL'

export type SkillDomain =
  | 'LISTENING'
  | 'SPEAKING'
  | 'READING'
  | 'WRITING'
  | 'GRAMMAR'
  | 'VOCABULARY'
  | 'PRONUNCIATION'

export type CurriculumCategory =
  | 'MOET_NATIONAL'
  | 'INTERNATIONAL_CERTIFICATE'
  | 'PROFICIENCY_FRAMEWORK'

export type SchoolLevelGroup =
  | 'PRIMARY' // Lớp 1 - 5
  | 'SECONDARY' // Lớp 6 - 9
  | 'HIGH' // Lớp 10 - 12
  | 'BAND' // IELTS / TOEIC Bands
  | 'LEVEL' // CEFR / Cambridge

export interface Curriculum {
  id: string
  curriculum_code: string
  name_en: string
  name_vi: string
  authority_name: string
  category: CurriculumCategory
  status: 'ACTIVE' | 'ARCHIVED'
  description_vi?: string
  description_en?: string
}

export interface CurriculumVersion {
  id: string
  curriculum_id: string
  source_version_id: string
  version_label: string
  document_reference: string
  effective_from: string
  effective_to?: string | null
  status: VersionLifecycleStatus
  supersedes_version_id?: string | null
  amends_source_id?: string | null
  change_reason?: string | null
  reviewed_by?: string | null
  reviewed_at?: string | null
  approved_by?: string | null
  approved_at?: string | null
  created_at: string
  updated_at: string
}

export interface Grade {
  id: string
  curriculum_version_id: string
  grade_code: string
  display_order: number
  name_en: string
  name_vi: string
  level_group: SchoolLevelGroup
}

export interface SkillSummary {
  id: string
  skill_code: string
  name_en: string
  name_vi: string
  domain: SkillDomain
  cefr_reference_band?: string
}

export interface CurriculumSkillMapping {
  id: string
  learning_outcome_id: string
  skill_id: string
  mapping_role: MappingRole
  importance: MappingImportance
  confidence: number
  mapping_version: string
  status: VersionLifecycleStatus
  verified_by?: string | null
  verified_at?: string | null
  skill?: SkillSummary
}

export interface LearningOutcome {
  id: string
  curriculum_version_id: string
  grade_id: string
  outcome_code: string
  statement_en: string
  statement_vi: string
  source_locator: string
  status: VersionLifecycleStatus
  mappings: CurriculumSkillMapping[]
}

export interface CreateCurriculumVersionPayload {
  curriculum_id: string
  source_version_id: string
  version_label: string
  document_reference: string
  effective_from: string
  effective_to?: string | null
  supersedes_version_id?: string | null
  change_reason: string
}

export interface ValidateCurriculumVersionResponse {
  valid: boolean
  errors: Array<{
    field: string
    message: string
    code: string
  }>
  warnings: Array<{
    field: string
    message: string
  }>
}

export interface VersionConflictError {
  isConflict: true
  currentServerVersion: string
  message: string
}
