import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App scaffold', () => {
  it('renders the approved development-environment readiness surface', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('EnglishFam')
    expect(html).toContain('Frontend development environment ready')
  })
})
