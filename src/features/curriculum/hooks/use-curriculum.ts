import { useCallback, useEffect, useMemo, useState } from 'react'
import { curriculumApi } from '../api/curriculum.api'
import type {
  CreateCurriculumVersionPayload,
  Curriculum,
  CurriculumVersion,
  Grade,
  LearningOutcome,
  MappingImportance,
  MappingRole,
  SkillSummary,
  ValidateCurriculumVersionResponse,
} from '../types/curriculum.types'

export function useCurriculum() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [versions, setVersions] = useState<CurriculumVersion[]>([])
  const [selectedVersionId, setSelectedVersionId] = useState<string>('')
  const [grades, setGrades] = useState<Grade[]>([])
  const [selectedGradeId, setSelectedGradeId] = useState<string>('')
  const [outcomes, setOutcomes] = useState<LearningOutcome[]>([])
  const [skills, setSkills] = useState<SkillSummary[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [validationResult, setValidationResult] =
    useState<ValidateCurriculumVersionResponse | null>(null)
  const [hasConflict, setHasConflict] = useState<boolean>(false)
  const [hasPermission, setHasPermission] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // 1. Initial Load: Curriculum, Versions, and Skills
  const loadInitialData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [currData, verData, skillData] = await Promise.all([
        curriculumApi.getCurriculum(),
        curriculumApi.getVersions(),
        curriculumApi.getAllSkills(),
      ])
      setCurriculum(currData)
      setVersions(verData)
      setSkills(skillData)

      // Default select the latest approved or current draft version
      const activeVersion =
        verData.find((v) => v.status === 'APPROVED') || verData[0]
      if (activeVersion) {
        setSelectedVersionId(activeVersion.id)
      }
    } catch {
      setError('Không thể tải danh mục chương trình học. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  // 2. When selectedVersionId changes: fetch Grades
  useEffect(() => {
    if (!selectedVersionId) return

    let isMounted = true
    curriculumApi.getGrades(selectedVersionId).then((gradeList) => {
      if (!isMounted) return
      setGrades(gradeList)
      if (gradeList.length > 0) {
        setSelectedGradeId(gradeList[0].id)
      } else {
        setSelectedGradeId('')
        setOutcomes([])
      }
    })

    return () => {
      isMounted = false
    }
  }, [selectedVersionId])

  // 3. When selectedGradeId changes: fetch Outcomes
  useEffect(() => {
    if (!selectedGradeId) {
      setOutcomes([])
      return
    }

    let isMounted = true
    curriculumApi.getOutcomes(selectedGradeId).then((outcomeList) => {
      if (!isMounted) return
      setOutcomes(outcomeList)
    })

    return () => {
      isMounted = false
    }
  }, [selectedGradeId])

  const selectedVersion = useMemo(() => {
    return versions.find((v) => v.id === selectedVersionId) || null
  }, [versions, selectedVersionId])

  const selectedGrade = useMemo(() => {
    return grades.find((g) => g.id === selectedGradeId) || null
  }, [grades, selectedGradeId])

  // Filtered outcomes by search
  const filteredOutcomes = useMemo(() => {
    if (!searchQuery.trim()) return outcomes
    const q = searchQuery.toLowerCase()
    return outcomes.filter(
      (o) =>
        o.outcome_code.toLowerCase().includes(q) ||
        o.statement_vi.toLowerCase().includes(q) ||
        o.statement_en.toLowerCase().includes(q) ||
        o.mappings.some(
          (m) =>
            m.skill?.name_vi.toLowerCase().includes(q) ||
            m.skill?.skill_code.toLowerCase().includes(q),
        ),
    )
  }, [outcomes, searchQuery])

  // Actions
  const handleSelectVersion = useCallback((versionId: string) => {
    setSelectedVersionId(versionId)
    setValidationResult(null)
    setHasConflict(false)
    setSuccessMessage(null)
  }, [])

  const handleSelectGrade = useCallback((gradeId: string) => {
    setSelectedGradeId(gradeId)
  }, [])

  const handleCreateVersion = useCallback(
    async (payload: CreateCurriculumVersionPayload) => {
      setError(null)
      try {
        const created = await curriculumApi.createVersion(payload)
        setVersions((prev) => [created, ...prev])
        setSelectedVersionId(created.id)
        setSuccessMessage(
          `Đã tạo thành công phiên bản mới ${created.version_label}`,
        )
        return created
      } catch {
        setError('Lỗi khi tạo phiên bản chương trình mới.')
        throw new Error('Create failed')
      }
    },
    [],
  )

  const handleValidateVersion = useCallback(async () => {
    if (!selectedVersionId) return
    setError(null)
    try {
      const res = await curriculumApi.validateVersion(selectedVersionId)
      setValidationResult(res)
      if (res.valid) {
        setSuccessMessage('Thẩm định cấu trúc và ánh xạ phiên bản thành công.')
      }
    } catch {
      setError('Lỗi trong quá trình thẩm định phiên bản.')
    }
  }, [selectedVersionId])

  const handleApproveVersion = useCallback(async () => {
    if (!selectedVersionId) return
    setError(null)
    try {
      const updated = await curriculumApi.approveVersion(selectedVersionId)
      setVersions((prev) =>
        prev.map((v) => (v.id === updated.id ? updated : v)),
      )
      setSuccessMessage(
        `Đã phê duyệt ban hành chính thức phiên bản ${updated.version_label}.`,
      )
    } catch {
      setError('Lỗi khi phê duyệt ban hành phiên bản.')
    }
  }, [selectedVersionId])

  const handleAddMapping = useCallback(
    async (
      outcomeId: string,
      skillId: string,
      mappingRole: MappingRole,
      importance: MappingImportance,
    ) => {
      const skill = skills.find((s) => s.id === skillId)
      if (!skill) return

      try {
        const newMapping = await curriculumApi.addSkillMapping(
          outcomeId,
          selectedGradeId,
          {
            learning_outcome_id: outcomeId,
            skill_id: skillId,
            mapping_role: mappingRole,
            importance,
            confidence: 0.95,
            status: 'APPROVED',
            skill,
          },
        )
        setOutcomes((prev) =>
          prev.map((o) => {
            if (o.id === outcomeId) {
              return {
                ...o,
                mappings: [...o.mappings, newMapping],
              }
            }
            return o
          }),
        )
        setSuccessMessage(`Đã gán kỹ năng "${skill.name_vi}" vào chuẩn đầu ra.`)
      } catch {
        setError('Lỗi khi ánh xạ kỹ năng.')
      }
    },
    [selectedGradeId, skills],
  )

  const handleRemoveMapping = useCallback(
    async (outcomeId: string, mappingId: string) => {
      try {
        await curriculumApi.removeSkillMapping(
          outcomeId,
          selectedGradeId,
          mappingId,
        )
        setOutcomes((prev) =>
          prev.map((o) => {
            if (o.id === outcomeId) {
              return {
                ...o,
                mappings: o.mappings.filter((m) => m.id !== mappingId),
              }
            }
            return o
          }),
        )
        setSuccessMessage('Đã hủy ánh xạ kỹ năng.')
      } catch {
        setError('Lỗi khi hủy ánh xạ kỹ năng.')
      }
    },
    [selectedGradeId],
  )

  const triggerConflictSimulation = useCallback(() => {
    setHasConflict(true)
  }, [])

  const resolveConflict = useCallback(() => {
    setHasConflict(false)
    loadInitialData()
  }, [loadInitialData])

  const togglePermissionForTesting = useCallback(() => {
    setHasPermission((prev) => !prev)
  }, [])

  return {
    curriculum,
    versions,
    selectedVersionId,
    selectedVersion,
    grades,
    selectedGradeId,
    selectedGrade,
    outcomes: filteredOutcomes,
    allOutcomesCount: outcomes.length,
    skills,
    isLoading,
    error,
    successMessage,
    validationResult,
    hasConflict,
    hasPermission,
    searchQuery,
    setSearchQuery,
    setSuccessMessage,
    setError,
    selectVersion: handleSelectVersion,
    selectGrade: handleSelectGrade,
    createVersion: handleCreateVersion,
    validateVersion: handleValidateVersion,
    approveVersion: handleApproveVersion,
    addMapping: handleAddMapping,
    removeMapping: handleRemoveMapping,
    triggerConflictSimulation,
    resolveConflict,
    togglePermissionForTesting,
    reload: loadInitialData,
  }
}
