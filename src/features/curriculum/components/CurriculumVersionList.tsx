import { useLanguage } from '../../../app/context/LanguageContext'
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
  const { language, t } = useLanguage()
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
        return t('ver.statusApproved')
      case 'DRAFT':
        return t('ver.statusDraft')
      case 'DEPRECATED':
        return t('ver.statusDeprecated')
      default:
        return status
    }
  }

  return (
    <div className="border-b border-slate-200/80 bg-slate-50/50 p-4 sm:p-5">
      {/* Top action row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('ver.title')}
            </h2>
            {selectedVersion && (
              <Badge variant={statusVariant(selectedVersion.status)}>
                {statusLabel(selectedVersion.status)}
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500 font-normal">
            {t('ver.subtitle')}
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
            {t('ver.validateBtn')}
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
              {t('ver.approveBtn')}
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
            {t('ver.createBtn')}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            title="Mô phỏng trường hợp xảy ra xung đột phiên bản (Optimistic lock conflict)"
            onClick={onTriggerConflict}
            className="text-xs text-slate-400 hover:text-purple-600"
          >
            {t('ver.testConflict')}
          </Button>
        </div>
      </div>

      {/* Version selector tabs */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 mr-1">
          {language === 'vi' ? 'Phiên bản:' : 'Version:'}
        </span>
        {versions.map((ver) => {
          const isSelected = ver.id === selectedVersionId
          return (
            <button
              key={ver.id}
              type="button"
              onClick={() => onSelectVersion(ver.id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer h-8 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/90 text-blue-800 shadow-2xs ring-1 ring-blue-600/30'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span>{ver.version_label}</span>
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

      {/* Flat Metadata & Immutability Strip (No stacked boxes) */}
      {selectedVersion && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div>
              <span className="text-slate-400">{t('ver.legalRef')}:</span>{' '}
              <strong className="text-slate-800 font-semibold font-mono text-[11px]">
                {selectedVersion.document_reference}
              </strong>
            </div>
            <span className="text-slate-300">•</span>
            <div>
              <span className="text-slate-400">{t('ver.effectiveFrom')}:</span>{' '}
              <strong className="text-slate-800 font-semibold">
                {selectedVersion.effective_from}
              </strong>
            </div>
            {selectedVersion.supersedes_version_id && (
              <>
                <span className="text-slate-300">•</span>
                <div>
                  <span className="text-slate-400">{t('ver.supersedes')}:</span>{' '}
                  <strong className="text-slate-800 font-semibold font-mono text-[11px]">
                    {selectedVersion.supersedes_version_id}
                  </strong>
                </div>
              </>
            )}
            {selectedVersion.change_reason && (
              <>
                <span className="text-slate-300">•</span>
                <span
                  className="italic text-slate-500 text-[11px] max-w-sm truncate"
                  title={selectedVersion.change_reason}
                >
                  &ldquo;{selectedVersion.change_reason}&rdquo;
                </span>
              </>
            )}
          </div>

          {selectedVersion.status === 'APPROVED' && (
            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>
                <strong>{t('ver.immutableRuleTitle')}:</strong>{' '}
                {t('ver.immutableRuleText')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
