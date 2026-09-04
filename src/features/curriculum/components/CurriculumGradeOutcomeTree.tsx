import { useLanguage } from '../../../app/context/LanguageContext'
import { Badge } from '../../../shared/components/ui/Badge'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import type { LevelGroupFilter } from '../hooks/use-curriculum'
import type { Grade, LearningOutcome } from '../types/curriculum.types'

export interface CurriculumGradeOutcomeTreeProps {
  grades: Grade[]
  allGrades: Grade[]
  selectedLevelGroup: LevelGroupFilter
  onSelectLevelGroup: (group: LevelGroupFilter) => void
  selectedGradeId: string
  onSelectGrade: (id: string) => void
  outcomes: LearningOutcome[]
  searchQuery: string
  onSearchChange: (q: string) => void
  onOpenMappingModal: (outcome: LearningOutcome) => void
  onRemoveMapping: (outcomeId: string, mappingId: string) => void
  isVersionApproved: boolean
}

export function CurriculumGradeOutcomeTree({
  grades,
  allGrades,
  selectedLevelGroup,
  onSelectLevelGroup,
  selectedGradeId,
  onSelectGrade,
  outcomes,
  searchQuery,
  onSearchChange,
  onOpenMappingModal,
  onRemoveMapping,
  isVersionApproved,
}: CurriculumGradeOutcomeTreeProps) {
  const { language, t } = useLanguage()

  const roleBadgeVariant = (role: string) => {
    switch (role) {
      case 'PRIMARY_TARGET':
        return 'info'
      case 'SECONDARY_TARGET':
        return 'purple'
      default:
        return 'neutral'
    }
  }

  const roleLabel = (role: string) => {
    switch (role) {
      case 'PRIMARY_TARGET':
        return t('outcome.rolePrimary')
      case 'SECONDARY_TARGET':
        return t('outcome.roleSecondary')
      case 'PREREQUISITE_SUPPORT':
        return t('outcome.rolePrereq')
      case 'REVIEW_OR_REINFORCEMENT':
        return t('outcome.roleReview')
      default:
        return role
    }
  }

  const importanceBadgeVariant = (imp: string) => {
    switch (imp) {
      case 'REQUIRED':
        return 'danger'
      case 'CORE':
        return 'warning'
      default:
        return 'neutral'
    }
  }

  // Check if current curriculum has school levels (MOET 1-12) or Bands/Certificates
  const hasSchoolLevels = allGrades.some(
    (g) =>
      g.level_group === 'PRIMARY' ||
      g.level_group === 'SECONDARY' ||
      g.level_group === 'HIGH',
  )

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 bg-white">
      {/* SSoT Rule Banner */}
      <div className="flex items-start gap-2.5 rounded-lg border border-blue-200/80 bg-blue-50/60 p-3 text-xs text-blue-900 leading-relaxed">
        <svg
          className="h-4 w-4 shrink-0 text-blue-600 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <strong className="font-semibold">{t('ssot.ruleTitle')}</strong>{' '}
          {t('ssot.ruleText')}
        </div>
      </div>

      {/* Level Group Selector (Tiểu học 1-5, THCS 6-9, THPT 10-12, hoặc Bands) */}
      {hasSchoolLevels && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-500 mr-2 uppercase tracking-wide text-[11px]">
            {language === 'vi' ? 'Phân cấp học:' : 'Education Level:'}
          </span>
          <button
            type="button"
            onClick={() => onSelectLevelGroup('ALL')}
            className={`inline-flex items-center h-7.5 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer transition-all duration-150 ${
              selectedLevelGroup === 'ALL'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('grade.filterAll')}
          </button>
          <button
            type="button"
            onClick={() => onSelectLevelGroup('PRIMARY')}
            className={`inline-flex items-center h-7.5 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer transition-all duration-150 ${
              selectedLevelGroup === 'PRIMARY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('grade.filterPrimary')}
          </button>
          <button
            type="button"
            onClick={() => onSelectLevelGroup('SECONDARY')}
            className={`inline-flex items-center h-7.5 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer transition-all duration-150 ${
              selectedLevelGroup === 'SECONDARY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('grade.filterSecondary')}
          </button>
          <button
            type="button"
            onClick={() => onSelectLevelGroup('HIGH')}
            className={`inline-flex items-center h-7.5 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer transition-all duration-150 ${
              selectedLevelGroup === 'HIGH'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('grade.filterHigh')}
          </button>
        </div>
      )}

      {/* Grade tabs and Search row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Grade tabs */}
        <div className="flex flex-wrap gap-1.5 flex-1">
          {grades.map((grade) => {
            const isSelected = grade.id === selectedGradeId
            return (
              <button
                key={grade.id}
                type="button"
                onClick={() => onSelectGrade(grade.id)}
                className={`inline-flex items-center h-8 rounded-lg px-3 py-1 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {language === 'vi' ? grade.name_vi : grade.name_en}
              </button>
            )
          })}
        </div>

        {/* Search input */}
        <div className="w-full sm:w-64">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('grade.searchPlaceholder')}
            leftIcon={
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* Outcome Cards */}
      {outcomes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
          <div className="rounded-full bg-slate-100 p-3 text-slate-400">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mt-3 text-sm font-semibold text-slate-900">
            {t('outcome.emptyTitle')}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            {t('outcome.emptyDesc')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {outcomes.map((outcome) => (
            <div
              key={outcome.id}
              className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 transition-all hover:border-slate-300 hover:bg-white shadow-2xs flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white text-slate-800 border border-slate-200 shadow-2xs">
                    {outcome.outcome_code}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {outcome.source_locator}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!isVersionApproved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenMappingModal(outcome)}
                      leftIcon={
                        <svg
                          className="h-3.5 w-3.5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      }
                    >
                      {t('outcome.mapSkillBtn')}
                    </Button>
                  )}
                </div>
              </div>

              {/* Statements (Bilingual) */}
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="font-semibold text-slate-900 leading-relaxed">
                  🇻🇳 {outcome.statement_vi}
                </div>
                <div className="text-slate-600 leading-relaxed italic">
                  🇬🇧 {outcome.statement_en}
                </div>
              </div>

              {/* Mapped Skills Section */}
              <div className="mt-1 rounded-lg bg-white p-3 border border-slate-200/80 shadow-2xs flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>
                    {t('outcome.mappedSkills')} ({outcome.mappings.length}):
                  </span>
                  <span className="text-slate-400 text-xs font-normal">
                    {t('outcome.manyToMany')}
                  </span>
                </div>

                {outcome.mappings.length === 0 ? (
                  <div className="text-xs italic text-slate-400 py-1">
                    {t('outcome.noMappedSkills')}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {outcome.mappings.map((mapping) => (
                      <div
                        key={mapping.id}
                        className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900">
                              {language === 'vi'
                                ? mapping.skill?.name_vi || mapping.skill_id
                                : mapping.skill?.name_en || mapping.skill_id}
                            </span>
                            <Badge variant="neutral" size="sm">
                              {mapping.skill?.domain || 'SKILL'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Badge
                              variant={roleBadgeVariant(mapping.mapping_role)}
                              size="sm"
                            >
                              {roleLabel(mapping.mapping_role)}
                            </Badge>
                            <Badge
                              variant={importanceBadgeVariant(
                                mapping.importance,
                              )}
                              size="sm"
                            >
                              {mapping.importance}
                            </Badge>
                            <span>
                              {t('outcome.confidence')}{' '}
                              {Math.round(mapping.confidence * 100)}%
                            </span>
                          </div>
                        </div>

                        {!isVersionApproved && (
                          <button
                            type="button"
                            onClick={() =>
                              onRemoveMapping(outcome.id, mapping.id)
                            }
                            title="Hủy ánh xạ"
                            className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
