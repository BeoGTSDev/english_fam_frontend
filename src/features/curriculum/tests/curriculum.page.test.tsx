import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { AdminCurriculumPage } from '../pages/admin-curriculum.page'
import { ConflictBanner } from '../components/ConflictBanner'
import { CurriculumVersionList } from '../components/CurriculumVersionList'
import { MOCK_VERSIONS } from '../api/curriculum.mock'

describe('AdminCurriculumPage components', () => {
  it('renders CurriculumVersionList with version tabs and statutory badges', () => {
    const html = renderToStaticMarkup(
      <CurriculumVersionList
        versions={MOCK_VERSIONS}
        selectedVersionId="ver-2022-v2"
        onSelectVersion={() => {}}
        onCreateVersionClick={() => {}}
        onValidateClick={() => {}}
        onApproveClick={() => {}}
        onTriggerConflict={() => {}}
      />,
    )

    expect(html).toContain('Phiên bản chương trình (Curriculum Versions)')
    expect(html).toContain('v2.0 (TT 13/2022/TT-BGDĐT)')
    expect(html).toContain('Quy tắc bất biến')
  })

  it('renders ConflictBanner with warning and reload guidance', () => {
    const html = renderToStaticMarkup(<ConflictBanner onReload={() => {}} />)

    expect(html).toContain('Phát hiện xung đột phiên bản')
    expect(html).toContain('Tải lại dữ liệu mới nhất (Reload)')
  })

  it('renders AdminCurriculumPage initial surface', () => {
    const html = renderToStaticMarkup(<AdminCurriculumPage />)
    expect(html).toBeDefined()
  })
})
