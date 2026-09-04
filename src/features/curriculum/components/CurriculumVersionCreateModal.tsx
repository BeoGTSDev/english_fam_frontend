import { useState } from 'react'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { Modal } from '../../../shared/components/ui/Modal'
import { Select } from '../../../shared/components/ui/Select'
import type {
  CreateCurriculumVersionPayload,
  CurriculumVersion,
} from '../types/curriculum.types'

export interface CurriculumVersionCreateModalProps {
  isOpen: boolean
  onClose: () => void
  curriculumId: string
  existingVersions: CurriculumVersion[]
  onCreate: (payload: CreateCurriculumVersionPayload) => Promise<void>
}

export function CurriculumVersionCreateModal({
  isOpen,
  onClose,
  curriculumId,
  existingVersions,
  onCreate,
}: CurriculumVersionCreateModalProps) {
  const [versionLabel, setVersionLabel] = useState('')
  const [documentRef, setDocumentRef] = useState('')
  const [effectiveFrom, setEffectiveFrom] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [supersedesId, setSupersedesId] = useState<string>(
    existingVersions[0]?.id || '',
  )
  const [changeReason, setChangeReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!versionLabel.trim() || !documentRef.trim() || !changeReason.trim()) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*).')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onCreate({
        curriculum_id: curriculumId,
        source_version_id: `SRC-${versionLabel.toUpperCase().replace(/\s+/g, '-')}`,
        version_label: versionLabel.trim(),
        document_reference: documentRef.trim(),
        effective_from: effectiveFrom,
        supersedes_version_id: supersedesId || null,
        change_reason: changeReason.trim(),
      })
      onClose()
    } catch {
      setError('Lỗi khi tạo phiên bản. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo phiên bản chương trình mới (New Curriculum Version)"
      description="Tuân thủ quy tắc bảo toàn lịch sử: Phiên bản mới sẽ kế thừa và ghi nhận phiên bản tiền nhiệm."
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Tạo phiên bản
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
            {error}
          </div>
        )}

        <Input
          label="Tên phiên bản (*) — VD: v2.1 (TT 17/2025/TT-BGDĐT)"
          value={versionLabel}
          onChange={(e) => setVersionLabel(e.target.value)}
          placeholder="v2.1..."
          required
        />

        <Input
          label="Văn bản pháp quy / Căn cứ ban hành (*)"
          value={documentRef}
          onChange={(e) => setDocumentRef(e.target.value)}
          placeholder="Thông tư 17/2025/TT-BGDĐT..."
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="date"
            label="Ngày bắt đầu hiệu lực (*)"
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
            required
          />

          <Select
            label="Thay thế phiên bản tiền nhiệm (Supersedes)"
            value={supersedesId}
            onChange={(e) => setSupersedesId(e.target.value)}
          >
            <option value="">-- Không thay thế (Khởi tạo mới) --</option>
            {existingVersions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.version_label} ({v.status})
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Lý do cập nhật / Ghi chú sửa đổi (*)
          </label>
          <textarea
            rows={3}
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            placeholder="Cập nhật theo thông tư mới hoặc điều chỉnh chuẩn đầu ra..."
            className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
            required
          />
        </div>

        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800 border border-blue-100">
          🔒 <strong>Bảo toàn lịch sử:</strong> Phiên bản mới sẽ khởi tạo ở
          trạng thái <code>DRAFT</code> để Admin thẩm định trước khi phê duyệt
          ban hành.
        </div>
      </form>
    </Modal>
  )
}
