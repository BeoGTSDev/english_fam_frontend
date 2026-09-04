import { useState } from 'react'
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
  const {
    curriculum,
    versions,
    selectedVersionId,
    selectedVersion,
    grades,
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
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs flex flex-col items-center">
          <div className="rounded-full bg-rose-50 p-4 text-rose-600">
            <svg
              className="h-8 w-8"
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
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Không có quyền truy cập (Permission Denied)
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md">
            Tài khoản quản trị của bạn không có capability{' '}
            <code>admin:curriculum:manage</code>. Theo nguyên tắc đặc quyền tối
            thiểu (Least Privilege), bạn không thể xem hoặc chỉnh sửa khung
            chương trình học.
          </p>
          <div className="mt-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={togglePermissionForTesting}
            >
              Bật lại quyền (Dành cho kiểm thử UI)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 2. Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl p-6 space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded-md" />
        <div className="h-32 bg-slate-100 rounded-xl border border-slate-200" />
        <div className="h-96 bg-slate-100 rounded-xl border border-slate-200" />
      </div>
    )
  }

  // 3. Error + Retry State
  if (error && versions.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Alert
          type="danger"
          title="Lỗi kết nối / Tải dữ liệu"
          action={
            <Button variant="primary" size="sm" onClick={reload}>
              Thử lại (Retry)
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
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Quản trị Khung chuẩn (Admin Curriculum)
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-mono">
              EFA-198 / UF-ADM-003
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {curriculum?.name_vi ||
              'Chương trình Giáo dục phổ thông môn Tiếng Anh'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cơ quan ban hành: <strong>{curriculum?.authority_name}</strong> | Mã
            định danh:{' '}
            <code className="text-slate-700 font-mono">
              {curriculum?.curriculum_code}
            </code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Helper toggle for testing permission denied state */}
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePermissionForTesting}
            className="text-xs text-slate-400 hover:text-rose-600"
            title="Thử nghiệm trạng thái từ chối quyền (Permission Denied)"
          >
            Mô phỏng từ chối quyền
          </Button>
        </div>
      </div>

      {/* Notifications & Banners */}
      {hasConflict && <ConflictBanner onReload={resolveConflict} />}

      {successMessage && (
        <Alert
          type="success"
          onDismiss={() => setSuccessMessage(null)}
          title="Thao tác thành công"
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

      {/* Section 1: Version Management */}
      <CurriculumVersionList
        versions={versions}
        selectedVersionId={selectedVersionId}
        onSelectVersion={selectVersion}
        onCreateVersionClick={() => setIsCreateModalOpen(true)}
        onValidateClick={validateVersion}
        onApproveClick={approveVersion}
        onTriggerConflict={triggerConflictSimulation}
      />

      {/* Section 2: Grades & Learning Outcomes Workspace */}
      <CurriculumGradeOutcomeTree
        grades={grades}
        selectedGradeId={selectedGradeId}
        onSelectGrade={selectGrade}
        outcomes={outcomes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenMappingModal={(outcome) => setMappingModalOutcome(outcome)}
        onRemoveMapping={removeMapping}
        isVersionApproved={isVersionApproved}
      />

      {/* Modals */}
      <CurriculumVersionCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        curriculumId={curriculum?.id || 'curr-moet-gdpt'}
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
