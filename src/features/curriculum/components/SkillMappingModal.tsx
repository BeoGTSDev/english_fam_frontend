import { useState } from 'react'
import { useLanguage } from '../../../app/context/LanguageContext'
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
  const { language, t } = useLanguage()
  const [selectedSkillId, setSelectedSkillId] = useState<string>(
    skills[0]?.id || '',
  )
  const [role, setRole] = useState<MappingRole>('PRIMARY_TARGET')
  const [importance, setImportance] = useState<MappingImportance>('REQUIRED')

  if (!outcome) return null

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
      title={`${t('modal.mapTitle')} ${outcome.outcome_code}`}
      description={t('modal.mapSubtitle')}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            {t('modal.cancel')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={availableSkills.length === 0}
            onClick={handleSave}
          >
            {t('modal.save')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Outcome preview */}
        <div className="rounded-lg bg-slate-50 p-3 text-xs border border-slate-200">
          <span className="font-semibold text-slate-800">
            {t('modal.outcomeLabel')}
          </span>
          <p className="mt-1 text-slate-700 font-medium">
            {language === 'vi' ? outcome.statement_vi : outcome.statement_en}
          </p>
        </div>

        {/* Skill selector */}
        {availableSkills.length === 0 ? (
          <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
            {t('modal.allSkillsMapped')}
          </div>
        ) : (
          <Select
            label={t('modal.selectSkill')}
            value={selectedSkillId || availableSkills[0]?.id}
            onChange={(e) => setSelectedSkillId(e.target.value)}
          >
            {availableSkills.map((s) => (
              <option key={s.id} value={s.id}>
                [{s.skill_code}] {language === 'vi' ? s.name_vi : s.name_en} (
                {s.domain} — {s.cefr_reference_band || 'A1-C1'})
              </option>
            ))}
          </Select>
        )}

        {/* Role and Importance selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label={t('modal.mappingRole')}
            value={role}
            onChange={(e) => setRole(e.target.value as MappingRole)}
          >
            <option value="PRIMARY_TARGET">
              {t('outcome.rolePrimary')} (PRIMARY_TARGET)
            </option>
            <option value="SECONDARY_TARGET">
              {t('outcome.roleSecondary')} (SECONDARY_TARGET)
            </option>
            <option value="PREREQUISITE_SUPPORT">
              {t('outcome.rolePrereq')} (PREREQUISITE_SUPPORT)
            </option>
            <option value="REVIEW_OR_REINFORCEMENT">
              {t('outcome.roleReview')} (REVIEW)
            </option>
          </Select>

          <Select
            label={t('modal.importance')}
            value={importance}
            onChange={(e) => setImportance(e.target.value as MappingImportance)}
          >
            <option value="REQUIRED">Bắt buộc (REQUIRED)</option>
            <option value="CORE">Cốt lõi (CORE)</option>
            <option value="SUPPORTING">Hỗ trợ (SUPPORTING)</option>
            <option value="OPTIONAL">Tùy chọn (OPTIONAL)</option>
          </Select>
        </div>

        <p className="text-xs text-slate-500 italic">{t('modal.ssotNote')}</p>
      </div>
    </Modal>
  )
}
