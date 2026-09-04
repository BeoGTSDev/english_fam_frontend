import { useState } from 'react'
import { LanguageProvider } from '../context/LanguageContext'
import { AdminShell, type AdminTab } from '../layouts/AdminShell'
import { AdminCurriculumPage } from '../../features/curriculum/pages/admin-curriculum.page'
import { AdminSurfacePlaceholder } from '../../features/admin/components/AdminSurfacePlaceholder'

function AdminApp() {
  const [activeTab, setActiveTab] = useState<AdminTab>('curriculum')

  return (
    <AdminShell currentTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'curriculum' ? (
        <AdminCurriculumPage />
      ) : (
        <AdminSurfacePlaceholder
          tab={activeTab}
          onNavigateCurriculum={() => setActiveTab('curriculum')}
        />
      )}
    </AdminShell>
  )
}

export function AppRoot() {
  return (
    <LanguageProvider>
      <AdminApp />
    </LanguageProvider>
  )
}
