import { Alert } from '../../../shared/components/ui/Alert'
import { Button } from '../../../shared/components/ui/Button'

export interface ConflictBannerProps {
  onReload: () => void
}

export function ConflictBanner({ onReload }: ConflictBannerProps) {
  return (
    <Alert
      type="conflict"
      title="Phát hiện xung đột phiên bản (Version Conflict / Stale Data)"
      action={
        <Button variant="primary" size="sm" onClick={onReload}>
          Tải lại dữ liệu mới nhất (Reload)
        </Button>
      }
    >
      Phiên bản chương trình này đã được một quản trị viên khác cập nhật hoặc
      thay đổi trạng thái kể từ khi bạn mở trang. Để ngăn ngừa việc vô tình ghi
      đè dữ liệu, hãy tải lại để đồng bộ với trạng thái mới nhất của hệ thống.
    </Alert>
  )
}
