import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App foundation', () => {
  it('renders the Phase 8 frontend application foundation surface', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('EnglishFam')
    expect(html).toContain('Frontend application foundation ready')
  })
})
