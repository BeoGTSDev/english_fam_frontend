import { useState } from 'react'
import { AdminShell, type AdminTab } from '../layouts/AdminShell'
import { AdminCurriculumPage } from '../../features/curriculum/pages/admin-curriculum.page'
import { AdminSurfacePlaceholder } from '../../features/admin/components/AdminSurfacePlaceholder'

export function AppRoot() {
  // Default to 'curriculum' as requested for ticket EFA-198
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
