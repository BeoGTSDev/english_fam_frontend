import { Badge } from '../../../shared/components/ui/Badge'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import type { Grade, LearningOutcome } from '../types/curriculum.types'

export interface CurriculumGradeOutcomeTreeProps {
  grades: Grade[]
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
  selectedGradeId,
  onSelectGrade,
  outcomes,
  searchQuery,
  onSearchChange,
  onOpenMappingModal,
  onRemoveMapping,
  isVersionApproved,
}: CurriculumGradeOutcomeTreeProps) {
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
        return 'Trọng tâm'
      case 'SECONDARY_TARGET':
        return 'Bổ trợ'
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

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col gap-5">
      {/* SSoT Rule Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3.5 text-xs text-blue-900 leading-relaxed">
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
          <strong>Quy tắc Benchmark không ép học lại (FR-CURR-004):</strong>{' '}
          Chuẩn đầu ra và ánh xạ theo khối lớp đóng vai trò định vị mục tiêu
          trường học. Hệ thống cá nhân hóa sẽ không ép học sinh học lại toàn bộ
          một khối lớp nếu năng lực thực tế đã đạt hoặc cần lấp lỗ hổng ở mức độ
          khác.
        </div>
      </div>

      {/* Grade selector and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Grade tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 sm:border-0 pb-2 sm:pb-0">
          {grades.map((grade) => {
            const isSelected = grade.id === selectedGradeId
            return (
              <button
                key={grade.id}
                type="button"
                onClick={() => onSelectGrade(grade.id)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {grade.name_vi} ({grade.grade_code})
              </button>
            )
          })}
        </div>

        {/* Search input */}
        <div className="w-full sm:w-72">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm mã outcome, kỹ năng..."
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

      {/* Outcome Cards / Table */}
      {outcomes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-12 text-center">
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
            Không tìm thấy chuẩn đầu ra
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            {searchQuery
              ? `Không có kết quả khớp với từ khóa "${searchQuery}". Hãy thử tìm theo từ khóa khác.`
              : 'Khối lớp này chưa có danh mục chuẩn đầu ra trong phiên bản được chọn.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {outcomes.map((outcome) => (
            <div
              key={outcome.id}
              className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 shadow-xs flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
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
                      Ánh xạ kỹ năng
                    </Button>
                  )}
                </div>
              </div>

              {/* Statements (Bilingual) */}
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="font-medium text-slate-900 leading-relaxed">
                  🇻🇳 {outcome.statement_vi}
                </div>
                <div className="text-slate-600 leading-relaxed italic">
                  🇬🇧 {outcome.statement_en}
                </div>
              </div>

              {/* Mapped Skills Section */}
              <div className="mt-1 rounded-lg bg-slate-50/80 p-3 border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>
                    Kỹ năng EnglishFam được ánh xạ ({outcome.mappings.length}):
                  </span>
                  <span className="text-slate-400 text-[11px] font-normal">
                    Quan hệ Many-to-Many
                  </span>
                </div>

                {outcome.mappings.length === 0 ? (
                  <div className="text-xs italic text-slate-400 py-1">
                    Chưa có kỹ năng nào được ánh xạ tới chuẩn đầu ra này.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {outcome.mappings.map((mapping) => (
                      <div
                        key={mapping.id}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-2xs"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-800">
                              {mapping.skill?.name_vi || mapping.skill_id}
                            </span>
                            <Badge variant="neutral" size="sm">
                              {mapping.skill?.domain || 'SKILL'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
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
                              Độ tin cậy: {Math.round(mapping.confidence * 100)}
                              %
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
