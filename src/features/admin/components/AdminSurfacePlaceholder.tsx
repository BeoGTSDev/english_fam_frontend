import { Badge } from '../../../shared/components/ui/Badge'
import { Button } from '../../../shared/components/ui/Button'
import type { AdminTab } from '../../../app/layouts/AdminShell'

interface SurfaceMeta {
  title: string
  flowId: string
  jiraKey: string
  intent: string
  status: string
}

const METADATA: Record<Exclude<AdminTab, 'curriculum'>, SurfaceMeta> = {
  dashboard: {
    title: 'Tổng quan hệ thống (Admin Dashboard)',
    flowId: 'UF-ADM-006',
    jiraKey: 'EFA-193',
    intent:
      'Hiển thị chỉ số vận hành được duyệt và lối tắt theo capability được cấp.',
    status: 'Sẵn sàng theo dõi',
  },
  accounts: {
    title: 'Quản lý Tài khoản (Accounts / Users)',
    flowId: 'UF-ADM-001',
    jiraKey: 'EFA-194',
    intent:
      'Provision tài khoản nội bộ riêng tư cho Student / Guardian; không có public signup.',
    status: 'Chờ triển khai theo Jira EFA-194',
  },
  assignments: {
    title: 'Phân công Phụ huynh - Học sinh (Assignments)',
    flowId: 'UF-ADM-002',
    jiraKey: 'EFA-196',
    intent:
      'Quản lý vòng đời gán/thu hồi quyền giám hộ có ghi nhận audit trail.',
    status: 'Chờ triển khai theo Jira EFA-196',
  },
  questions: {
    title: 'Ngân hàng câu hỏi (Question Bank)',
    flowId: 'UF-ADM-004',
    jiraKey: 'EFA-199',
    intent:
      'Quản trị vòng đời câu hỏi, độ khó, ánh xạ kỹ năng và metadata nguồn.',
    status: 'Chờ triển khai theo Jira EFA-199',
  },
  'assessment-review': {
    title: 'Duyệt bài đánh giá gắn cờ (Assessment Review)',
    flowId: 'UF-ADM-005',
    jiraKey: 'EFA-200',
    intent:
      'Xử lý các bài thi nghi vấn: Xác minh (Verify), Hủy (Invalidate), Cho phép thi lại (Authorize Retest).',
    status: 'Chờ triển khai theo Jira EFA-200',
  },
  operations: {
    title: 'Vận hành & Giám sát (Operations & Monitoring)',
    flowId: 'UF-ADM-006',
    jiraKey: 'EFA-202',
    intent: 'Theo dõi sự vụ vận hành và nhật ký kiểm toán hệ thống.',
    status: 'Chờ triển khai theo Jira EFA-202',
  },
}

export interface AdminSurfacePlaceholderProps {
  tab: Exclude<AdminTab, 'curriculum'>
  onNavigateCurriculum: () => void
}

export function AdminSurfacePlaceholder({
  tab,
  onNavigateCurriculum,
}: AdminSurfacePlaceholderProps) {
  const meta = METADATA[tab]

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Badge variant="info">{meta.flowId}</Badge>
          <Badge variant="purple">{meta.jiraKey}</Badge>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-slate-900">{meta.title}</h2>

        <p className="mt-2 text-sm text-slate-600 max-w-lg leading-relaxed">
          {meta.intent}
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 max-w-md text-left">
          <div className="font-semibold text-slate-800">Thông tin phân hệ:</div>
          <ul className="mt-2 list-disc pl-4 space-y-1">
            <li>
              Trạng thái: <strong>{meta.status}</strong>
            </li>
            <li>
              Nguyên tắc: Untrusted Client, Least Privilege, Audit Log bắt buộc
            </li>
            <li>Hợp đồng UI: [ADMIN_HIGH_FIDELITY_CONTRACT.md]</li>
          </ul>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button variant="primary" size="md" onClick={onNavigateCurriculum}>
            Chuyển sang Quản lý Curriculum (EFA-198)
          </Button>
        </div>
      </div>
    </div>
  )
}
