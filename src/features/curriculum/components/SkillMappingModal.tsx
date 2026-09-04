import { useState } from 'react'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { Select } from '../../../shared/components/ui/Select'
import type {
  LearningOutcome,
  MappingImportance,
  MappingRole,
  SkillSummary,
} from '../types/curriculum.types'

export interface SkillMappingModalProps {
  isOpen: boolean
  onClose: () => void
  outcome: LearningOutcome | null
  skills: SkillSummary[]
  onSaveMapping: (
    outcomeId: string,
    skillId: string,
    role: MappingRole,
    importance: MappingImportance,
  ) => void
}

export function SkillMappingModal({
  isOpen,
  onClose,
  outcome,
  skills,
  onSaveMapping,
}: SkillMappingModalProps) {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(
    skills[0]?.id || '',
  )
  const [role, setRole] = useState<MappingRole>('PRIMARY_TARGET')
  const [importance, setImportance] = useState<MappingImportance>('REQUIRED')

  if (!outcome) return null

  // Filter out skills that are already mapped to this outcome
  const availableSkills = skills.filter(
    (s) => !outcome.mappings.some((m) => m.skill_id === s.id),
  )

  const handleSave = () => {
    const targetSkillId = selectedSkillId || availableSkills[0]?.id
    if (!targetSkillId) return
    onSaveMapping(outcome.id, targetSkillId, role, importance)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ánh xạ kỹ năng cho chuẩn ${outcome.outcome_code}`}
      description="Thiết lập quan hệ nhiều-nhiều giữa Chuẩn đầu ra chương trình và Kỹ năng chuẩn EnglishFam"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={availableSkills.length === 0}
            onClick={handleSave}
          >
            Lưu ánh xạ
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Outcome preview */}
        <div className="rounded-lg bg-slate-50 p-3 text-xs border border-slate-200">
          <span className="font-semibold text-slate-800">Chuẩn đầu ra:</span>
          <p className="mt-1 text-slate-700">{outcome.statement_vi}</p>
        </div>

        {/* Skill selector */}
        {availableSkills.length === 0 ? (
          <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
            Tất cả kỹ năng mẫu trong danh mục đã được ánh xạ vào chuẩn đầu ra
            này.
          </div>
        ) : (
          <Select
            label="Chọn Kỹ năng EnglishFam (*)"
            value={selectedSkillId || availableSkills[0]?.id}
            onChange={(e) => setSelectedSkillId(e.target.value)}
          >
            {availableSkills.map((s) => (
              <option key={s.id} value={s.id}>
                [{s.skill_code}] {s.name_vi} ({s.domain} —{' '}
                {s.cefr_reference_band || 'A1-B2'})
              </option>
            ))}
          </Select>
        )}

        {/* Role and Importance selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Vai trò ánh xạ (Mapping Role)"
            value={role}
            onChange={(e) => setRole(e.target.value as MappingRole)}
          >
            <option value="PRIMARY_TARGET">Trọng tâm (PRIMARY_TARGET)</option>
            <option value="SECONDARY_TARGET">Bổ trợ (SECONDARY_TARGET)</option>
            <option value="PREREQUISITE_SUPPORT">
              Điều kiện tiên quyết (PREREQUISITE_SUPPORT)
            </option>
            <option value="REVIEW_OR_REINFORCEMENT">
              Ôn tập & Củng cố (REVIEW)
            </option>
          </Select>

          <Select
            label="Mức độ quan trọng (Importance)"
            value={importance}
            onChange={(e) => setImportance(e.target.value as MappingImportance)}
          >
            <option value="REQUIRED">Bắt buộc (REQUIRED)</option>
            <option value="CORE">Cốt lõi (CORE)</option>
            <option value="SUPPORTING">Hỗ trợ (SUPPORTING)</option>
            <option value="OPTIONAL">Tùy chọn (OPTIONAL)</option>
          </Select>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          * Quy tắc SSoT: Việc ánh xạ không làm thay đổi ID của Skill chuẩn và
          không trực tiếp tạo ra Mastery của người học.
        </p>
      </div>
    </Modal>
  )
}
