import { apiRequest } from '../../../shared/api/api-client'
import {
  MOCK_CURRICULA,
  MOCK_GRADES,
  MOCK_OUTCOMES_BY_GRADE,
  MOCK_SKILLS,
  MOCK_VERSIONS,
} from './curriculum.mock'
import type {
  CreateCurriculumVersionPayload,
  Curriculum,
  CurriculumSkillMapping,
  CurriculumVersion,
  Grade,
  LearningOutcome,
  SkillSummary,
  ValidateCurriculumVersionResponse,
} from '../types/curriculum.types'

let localVersions = [...MOCK_VERSIONS]
const localOutcomesByGrade = { ...MOCK_OUTCOMES_BY_GRADE }

export const curriculumApi = {
  async getCurricula(): Promise<Curriculum[]> {
    try {
      return await apiRequest<Curriculum[]>('/admin/curricula')
    } catch {
      return MOCK_CURRICULA
    }
  },

  async getCurriculum(id = 'curr-moet-gdpt'): Promise<Curriculum> {
    try {
      return await apiRequest<Curriculum>(`/admin/curriculum/${id}`)
    } catch {
      return MOCK_CURRICULA.find((c) => c.id === id) || MOCK_CURRICULA[0]
    }
  },

  async getVersions(
    curriculumId = 'curr-moet-gdpt',
  ): Promise<CurriculumVersion[]> {
    try {
      return await apiRequest<CurriculumVersion[]>(
        `/admin/curriculum/${curriculumId}/versions`,
      )
    } catch {
      return localVersions.filter((v) => v.curriculum_id === curriculumId)
    }
  },

  async getGrades(versionId: string): Promise<Grade[]> {
    try {
      return await apiRequest<Grade[]>(
        `/admin/curriculum/versions/${versionId}/grades`,
      )
    } catch {
      // Find matching grades for version, or default to matching curriculum
      const directMatch = MOCK_GRADES.filter(
        (g) => g.curriculum_version_id === versionId,
      )
      if (directMatch.length > 0) return directMatch

      const currentVer = localVersions.find((v) => v.id === versionId)
      if (currentVer?.curriculum_id === 'curr-ielts') {
        return MOCK_GRADES.filter(
          (g) => g.curriculum_version_id === 'ver-ielts-2025',
        )
      }
      if (currentVer?.curriculum_id === 'curr-toeic') {
        return MOCK_GRADES.filter(
          (g) => g.curriculum_version_id === 'ver-toeic-2025',
        )
      }
      if (currentVer?.curriculum_id === 'curr-cambridge') {
        return MOCK_GRADES.filter(
          (g) => g.curriculum_version_id === 'ver-cambridge-2024',
        )
      }

      // Default MOET 1-12
      return MOCK_GRADES.filter(
        (g) => g.curriculum_version_id === 'ver-2022-v2',
      )
    }
  },

  async getOutcomes(gradeId: string): Promise<LearningOutcome[]> {
    try {
      return await apiRequest<LearningOutcome[]>(
        `/admin/curriculum/grades/${gradeId}/outcomes`,
      )
    } catch {
      return localOutcomesByGrade[gradeId] || []
    }
  },

  async getAllSkills(): Promise<SkillSummary[]> {
    try {
      return await apiRequest<SkillSummary[]>('/admin/skills')
    } catch {
      return MOCK_SKILLS
    }
  },

  async createVersion(
    payload: CreateCurriculumVersionPayload,
  ): Promise<CurriculumVersion> {
    try {
      return await apiRequest<CurriculumVersion>('/admin/curriculum/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      const newVersion: CurriculumVersion = {
        id: `ver-${Date.now()}`,
        curriculum_id: payload.curriculum_id,
        source_version_id: payload.source_version_id,
        version_label: payload.version_label,
        document_reference: payload.document_reference,
        effective_from: payload.effective_from,
        effective_to: payload.effective_to,
        status: 'DRAFT',
        supersedes_version_id: payload.supersedes_version_id,
        change_reason: payload.change_reason,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      localVersions = [newVersion, ...localVersions]
      return newVersion
    }
  },

  async validateVersion(
    versionId: string,
  ): Promise<ValidateCurriculumVersionResponse> {
    try {
      return await apiRequest<ValidateCurriculumVersionResponse>(
        `/admin/curriculum/versions/${versionId}/validate`,
        { method: 'POST' },
      )
    } catch {
      return {
        valid: true,
        errors: [],
        warnings: [
          {
            field: 'mappings',
            message:
              'Khung chương trình đã kết nối đầy đủ các bậc học từ Tiểu học đến THPT.',
          },
        ],
      }
    }
  },

  async approveVersion(versionId: string): Promise<CurriculumVersion> {
    try {
      return await apiRequest<CurriculumVersion>(
        `/admin/curriculum/versions/${versionId}/approve`,
        { method: 'POST' },
      )
    } catch {
      const version = localVersions.find((v) => v.id === versionId)
      if (!version) {
        throw new Error('Version not found')
      }
      version.status = 'APPROVED'
      version.approved_by = 'Authorized Admin'
      version.approved_at = new Date().toISOString()
      version.updated_at = new Date().toISOString()
      return { ...version }
    }
  },

  async addSkillMapping(
    outcomeId: string,
    gradeId: string,
    mapping: Omit<CurriculumSkillMapping, 'id' | 'mapping_version'>,
  ): Promise<CurriculumSkillMapping> {
    try {
      return await apiRequest<CurriculumSkillMapping>(
        `/admin/curriculum/outcomes/${outcomeId}/mappings`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mapping),
        },
      )
    } catch {
      const newMapping: CurriculumSkillMapping = {
        ...mapping,
        id: `map-${Date.now()}`,
        mapping_version: 'v1.0',
      }
      const gradeOutcomes = localOutcomesByGrade[gradeId] || []
      const outcome = gradeOutcomes.find((o) => o.id === outcomeId)
      if (outcome) {
        outcome.mappings = [...outcome.mappings, newMapping]
      }
      return newMapping
    }
  },

  async removeSkillMapping(
    outcomeId: string,
    gradeId: string,
    mappingId: string,
  ): Promise<void> {
    try {
      await apiRequest<void>(
        `/admin/curriculum/outcomes/${outcomeId}/mappings/${mappingId}`,
        { method: 'DELETE' },
      )
    } catch {
      const gradeOutcomes = localOutcomesByGrade[gradeId] || []
      const outcome = gradeOutcomes.find((o) => o.id === outcomeId)
      if (outcome) {
        outcome.mappings = outcome.mappings.filter((m) => m.id !== mappingId)
      }
    }
  },
}
