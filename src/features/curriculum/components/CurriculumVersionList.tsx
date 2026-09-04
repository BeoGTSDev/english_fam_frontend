import { Badge } from '../../../shared/components/ui/Badge'
import { Button } from '../../../shared/components/ui/Button'
import type { CurriculumVersion } from '../types/curriculum.types'

export interface CurriculumVersionListProps {
  versions: CurriculumVersion[]
  selectedVersionId: string
  onSelectVersion: (id: string) => void
  onCreateVersionClick: () => void
  onValidateClick: () => void
  onApproveClick: () => void
  onTriggerConflict: () => void
}

export function CurriculumVersionList({
  versions,
  selectedVersionId,
  onSelectVersion,
  onCreateVersionClick,
  onValidateClick,
  onApproveClick,
  onTriggerConflict,
}: CurriculumVersionListProps) {
  const selectedVersion = versions.find((v) => v.id === selectedVersionId)

  const statusVariant = (status: CurriculumVersion['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'success'
      case 'DRAFT':
        return 'warning'
      case 'DEPRECATED':
        return 'neutral'
      default:
        return 'info'
    }
  }

  const statusLabel = (status: CurriculumVersion['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'Đã ban hành (APPROVED)'
      case 'DRAFT':
        return 'Bản thảo (DRAFT)'
      case 'DEPRECATED':
        return 'Hết hiệu lực (DEPRECATED)'
      default:
        return status
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      {/* Top action row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-900">
              Phiên bản chương trình (Curriculum Versions)
            </h2>
            {selectedVersion && (
              <Badge variant={statusVariant(selectedVersion.status)}>
                {statusLabel(selectedVersion.status)}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Quản trị phiên bản theo phả hệ văn bản pháp quy Bộ GD&ĐT. Lịch sử
            được bảo toàn bất biến.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onValidateClick}
            leftIcon={
              <svg
                className="h-4 w-4 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          >
            Thẩm định cấu trúc
          </Button>

          {selectedVersion?.status === 'DRAFT' && (
            <Button
              variant="primary"
              size="sm"
              onClick={onApproveClick}
              leftIcon={
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
            >
              Phê duyệt ban hành
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={onCreateVersionClick}
            leftIcon={
              <svg
                className="h-4 w-4 text-slate-700"
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
            Tạo bản mới
          </Button>

          {/* Conflict simulator helper button for testing/demo */}
          <Button
            variant="ghost"
            size="sm"
            title="Mô phỏng trường hợp xảy ra xung đột phiên bản (Optimistic lock conflict)"
            onClick={onTriggerConflict}
            className="text-xs text-slate-400 hover:text-purple-600"
          >
            Test xung đột
          </Button>
        </div>
      </div>

      {/* Version selector tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {versions.map((ver) => {
          const isSelected = ver.id === selectedVersionId
          return (
            <button
              key={ver.id}
              type="button"
              onClick={() => onSelectVersion(ver.id)}
              className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer min-h-[44px] ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="font-semibold">{ver.version_label}</span>
              <span
                className={`h-2 w-2 rounded-full ${
                  ver.status === 'APPROVED'
                    ? 'bg-emerald-500'
                    : ver.status === 'DRAFT'
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* Metadata panel */}
      {selectedVersion && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-100 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div>
              <span className="text-slate-400">Văn bản căn cứ:</span>{' '}
              <strong className="text-slate-800">
                {selectedVersion.document_reference}
              </strong>
            </div>
            <div>
              <span className="text-slate-400">Hiệu lực từ:</span>{' '}
              <strong className="text-slate-800">
                {selectedVersion.effective_from}
              </strong>
            </div>
            {selectedVersion.supersedes_version_id && (
              <div>
                <span className="text-slate-400">Thay thế bản:</span>{' '}
                <strong className="text-slate-800">
                  {selectedVersion.supersedes_version_id}
                </strong>
              </div>
            )}
          </div>

          {selectedVersion.change_reason && (
            <div
              className="italic text-slate-500 sm:max-w-xs truncate"
              title={selectedVersion.change_reason}
            >
              &ldquo;{selectedVersion.change_reason}&rdquo;
            </div>
          )}
        </div>
      )}

      {/* Immutability guidance */}
      {selectedVersion?.status === 'APPROVED' && (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/60 border border-emerald-200/60 rounded-md px-3 py-1.5">
          <svg
            className="h-4 w-4 shrink-0 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>
            <strong>Quy tắc bất biến:</strong> Phiên bản này đã được công bố
            chính thức. Dữ liệu chuẩn đầu ra và ánh xạ là bất biến để bảo vệ
            lịch sử học tập của học sinh.
          </span>
        </div>
      )}
    </div>
  )
}
