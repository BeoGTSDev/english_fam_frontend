import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the private EnglishFam sign-in surface', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('EnglishFam')
    expect(html).toContain('Welcome back')
    expect(html).toContain('name="username"')
    expect(html).not.toContain('Sign Up')
  })
})
