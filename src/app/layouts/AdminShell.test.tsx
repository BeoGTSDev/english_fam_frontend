import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { AdminShell } from './AdminShell'

describe('AdminShell', () => {
  it('renders all 7 canonical admin navigation surfaces', () => {
    const html = renderToStaticMarkup(
      <AdminShell currentTab="curriculum" onSelectTab={() => {}}>
        <div>Curriculum Content</div>
      </AdminShell>,
    )

    // Verify 7 canonical surfaces
    expect(html).toContain('Tổng quan hệ thống')
    expect(html).toContain('Tài khoản &amp; Người dùng')
    expect(html).toContain('Phân công Phụ huynh - Học sinh')
    expect(html).toContain('Chương trình học (Curriculum)')
    expect(html).toContain('Ngân hàng câu hỏi')
    expect(html).toContain('Duyệt bài đánh giá gắn cờ')
    expect(html).toContain('Vận hành &amp; Giám sát')

    // Verify content rendered
    expect(html).toContain('Curriculum Content')

    // Verify least-privilege capability badge
    expect(html).toContain('admin:curriculum:manage')
  })
})
