import { useLanguage } from '../../../app/context/LanguageContext'
import { Alert } from '../../../shared/components/ui/Alert'
import { Button } from '../../../shared/components/ui/Button'

export interface ConflictBannerProps {
  onReload: () => void
}

export function ConflictBanner({ onReload }: ConflictBannerProps) {
  const { t } = useLanguage()

  return (
    <Alert
      type="conflict"
      title={t('conflict.title')}
      action={
        <Button variant="primary" size="sm" onClick={onReload}>
          {t('conflict.reloadBtn')}
        </Button>
      }
    >
      {t('conflict.text')}
    </Alert>
  )
}
