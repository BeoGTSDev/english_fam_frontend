import { useState } from 'react'
import { useLanguage } from '../../../app/context/LanguageContext'
import { Alert } from '../../../shared/components/ui/Alert'
import { Button } from '../../../shared/components/ui/Button'
import { ConflictBanner } from '../components/ConflictBanner'
import { CurriculumGradeOutcomeTree } from '../components/CurriculumGradeOutcomeTree'
import { CurriculumVersionCreateModal } from '../components/CurriculumVersionCreateModal'
import { CurriculumVersionList } from '../components/CurriculumVersionList'
import { SkillMappingModal } from '../components/SkillMappingModal'
import { useCurriculum } from '../hooks/use-curriculum'
import type { LearningOutcome } from '../types/curriculum.types'

export function AdminCurriculumPage() {
  const { language, t } = useLanguage()

  const {
    curricula,
    selectedCurriculumId,
    selectedCurriculum,
    versions,
    selectedVersionId,
    selectedVersion,
    grades,
    allGrades,
    selectedLevelGroup,
    setSelectedLevelGroup,
    selectedGradeId,
    outcomes,
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
    selectCurriculum,
    selectVersion,
    selectGrade,
    createVersion,
    validateVersion,
    approveVersion,
    addMapping,
    removeMapping,
    triggerConflictSimulation,
    resolveConflict,
    togglePermissionForTesting,
    reload,
  } = useCurriculum()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [mappingModalOutcome, setMappingModalOutcome] =
    useState<LearningOutcome | null>(null)

  // 1. Permission Denied State
  if (!hasPermission) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-10 text-center shadow-xs flex flex-col items-center">
          <div className="rounded-full bg-rose-50 p-3.5 text-rose-600">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-11a4 4 0 00-8 0v4h8V6z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            {t('notif.deniedTitle')}
          </h2>
          <p className="mt-2 text-xs text-slate-500 max-w-md leading-relaxed">
            {t('notif.deniedDesc')}
          </p>
          <div className="mt-5">
            <Button
              variant="secondary"
              size="sm"
              onClick={togglePermissionForTesting}
            >
              {t('curr.permissionRestored')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 2. Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-5 animate-pulse">
        <div className="h-7 w-64 bg-slate-200 rounded-md" />
        <div className="h-28 bg-white rounded-xl border border-slate-200" />
        <div className="h-80 bg-white rounded-xl border border-slate-200" />
      </div>
    )
  }

  // 3. Error + Retry State
  if (error && versions.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <Alert
          type="danger"
          title={t('notif.error')}
          action={
            <Button variant="primary" size="sm" onClick={reload}>
              {t('notif.retry')}
            </Button>
          }
        >
          {error}
        </Alert>
      </div>
    )
  }

  const isVersionApproved = selectedVersion?.status === 'APPROVED'

  return (
    <div className="mx-auto max-w-6xl flex flex-col gap-3.5">
      {/* Top Header & Program Selector (Direct on Canvas, No Giant Card) */}
      <div className="flex flex-col gap-2">
        {/* Category & Action row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              {t('curr.category')}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-500 font-mono">
              EFA-198 / UF-ADM-003
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={togglePermissionForTesting}
            className="text-xs text-slate-400 hover:text-rose-600"
            title="Thử nghiệm trạng thái từ chối quyền (Permission Denied)"
          >
            {t('curr.simulateDenied')}
          </Button>
        </div>

        {/* Curriculum Switcher Segmented Control */}
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex p-1 bg-slate-200/70 rounded-xl gap-1 max-w-full overflow-x-auto shadow-2xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {curricula.map((c) => {
              const isSelected = c.id === selectedCurriculumId
              const badgeConfig =
                c.id === 'curr-moet-gdpt'
                  ? { label: 'GDPT', bg: 'bg-blue-100 text-blue-700' }
                  : c.id === 'curr-ielts'
                    ? { label: 'IELTS', bg: 'bg-amber-100 text-amber-700' }
                    : c.id === 'curr-toeic'
                      ? { label: 'TOEIC', bg: 'bg-emerald-100 text-emerald-700' }
                      : { label: 'CAMBRIDGE', bg: 'bg-purple-100 text-purple-700' }

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectCurriculum(c.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${badgeConfig.bg}`}
                  >
                    {badgeConfig.label}
                  </span>
                  <span>{language === 'vi' ? c.name_vi : c.name_en}</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    ({c.curriculum_code})
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active Curriculum Metadata Strip */}
          {selectedCurriculum && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 px-1 py-0.5">
              <div>
                <span className="text-slate-400">{t('curr.authority')}</span>{' '}
                <strong className="text-slate-700 font-semibold">
                  {selectedCurriculum.authority_name}
                </strong>
              </div>
              <span className="text-slate-300">•</span>
              <div>
                <span className="text-slate-400">{t('curr.identifier')}</span>{' '}
                <code className="font-mono text-slate-700 font-semibold">
                  {selectedCurriculum.curriculum_code}
                </code>
              </div>
              <span className="text-slate-300">•</span>
              <div className="text-slate-600 truncate max-w-xl">
                {language === 'vi'
                  ? selectedCurriculum.description_vi
                  : selectedCurriculum.description_en}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications & Banners */}
      {hasConflict && <ConflictBanner onReload={resolveConflict} />}

      {successMessage && (
        <Alert
          type="success"
          onDismiss={() => setSuccessMessage(null)}
          title={t('notif.success')}
        >
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert type="danger" onDismiss={() => {}}>
          {error}
        </Alert>
      )}

      {validationResult && (
        <Alert
          type={validationResult.valid ? 'info' : 'warning'}
          title="Kết quả thẩm định cấu trúc phiên bản"
          onDismiss={() => {}}
        >
          {validationResult.warnings.map((w, idx) => (
            <p key={idx} className="mt-1">
              ⚠️ {w.message}
            </p>
          ))}
          {validationResult.errors.map((e, idx) => (
            <p key={idx} className="mt-1 text-rose-600 font-semibold">
              ❌ {e.message}
            </p>
          ))}
        </Alert>
      )}

      {/* UNIFIED SINGLE WORKSPACE PANEL */}
      <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        {/* Section 1: Version Governance Toolbar */}
        <CurriculumVersionList
          versions={versions}
          selectedVersionId={selectedVersionId}
          onSelectVersion={selectVersion}
          onCreateVersionClick={() => setIsCreateModalOpen(true)}
          onValidateClick={validateVersion}
          onApproveClick={approveVersion}
          onTriggerConflict={triggerConflictSimulation}
        />

        {/* Section 2: Grades & Learning Outcomes Tree Workspace */}
        <CurriculumGradeOutcomeTree
          grades={grades}
          allGrades={allGrades}
          selectedLevelGroup={selectedLevelGroup}
          onSelectLevelGroup={setSelectedLevelGroup}
          selectedGradeId={selectedGradeId}
          onSelectGrade={selectGrade}
          outcomes={outcomes}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMappingModal={(outcome) => setMappingModalOutcome(outcome)}
          onRemoveMapping={removeMapping}
          isVersionApproved={isVersionApproved}
        />
      </div>

      {/* Modals */}
      <CurriculumVersionCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        curriculumId={selectedCurriculumId}
        existingVersions={versions}
        onCreate={async (payload) => {
          await createVersion(payload)
        }}
      />

      <SkillMappingModal
        isOpen={Boolean(mappingModalOutcome)}
        onClose={() => setMappingModalOutcome(null)}
        outcome={mappingModalOutcome}
        skills={skills}
        onSaveMapping={addMapping}
      />
    </div>
  )
}
