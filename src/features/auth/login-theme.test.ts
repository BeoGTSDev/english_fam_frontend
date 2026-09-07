import { describe, expect, it } from 'vitest'

import {
  getNextLoginTheme,
  isLoginTheme,
  loginThemeLabels,
  loginThemes,
} from './login-theme'
import { resolveStoredTheme } from './hooks/useLoginTheme'

describe('login theme model', () => {
  it('cycles through every approved theme in the prototype order', () => {
    expect(loginThemes).toEqual(['ocean', 'sunset', 'night', 'sunrise'])
    expect(getNextLoginTheme('ocean')).toBe('sunset')
    expect(getNextLoginTheme('sunset')).toBe('night')
    expect(getNextLoginTheme('night')).toBe('sunrise')
    expect(getNextLoginTheme('sunrise')).toBe('ocean')
  })

  it('provides accessible human-readable labels for all approved themes', () => {
    expect(loginThemeLabels).toEqual({
      ocean: 'Ocean',
      sunset: 'Sunset',
      night: 'Night',
      sunrise: 'Sunrise',
    })
  })

  it('rejects unsupported stored themes and validates approved ones', () => {
    expect(isLoginTheme('ocean')).toBe(true)
    expect(isLoginTheme('sunset')).toBe(true)
    expect(isLoginTheme('night')).toBe(true)
    expect(isLoginTheme('sunrise')).toBe(true)
    expect(isLoginTheme('unknown')).toBe(false)
    expect(isLoginTheme('')).toBe(false)
    expect(isLoginTheme(null)).toBe(false)
  })

  it('resolves stored theme with fallback to ocean when invalid or null', () => {
    expect(resolveStoredTheme('sunset')).toBe('sunset')
    expect(resolveStoredTheme('night')).toBe('night')
    expect(resolveStoredTheme('invalid-theme')).toBe('ocean')
    expect(resolveStoredTheme(null)).toBe('ocean')
    expect(resolveStoredTheme('')).toBe('ocean')
  })
})
