import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App foundation', () => {
  it('renders the Phase 8 frontend application foundation and Admin surfaces', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('EnglishFam Admin')
    expect(html).toContain('Chương trình học (Curriculum)')
    expect(html).toContain('EFA-198')
  })
})
