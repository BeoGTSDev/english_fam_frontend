import { useState } from 'react'

import {
  getNextLoginTheme,
  isLoginTheme,
  type LoginTheme,
} from '../login-theme'

export const LOGIN_THEME_STORAGE_KEY = 'englishfam.login-theme.v1'

export function resolveStoredTheme(storedTheme: string | null): LoginTheme {
  return isLoginTheme(storedTheme) ? storedTheme : 'ocean'
}

function getInitialTheme(): LoginTheme {
  if (typeof window === 'undefined') return 'ocean'

  try {
    const storedTheme = window.localStorage.getItem(LOGIN_THEME_STORAGE_KEY)
    return resolveStoredTheme(storedTheme)
  } catch {
    return 'ocean'
  }
}

export function useLoginTheme() {
  const [theme, setTheme] = useState<LoginTheme>(getInitialTheme)

  function cycleTheme() {
    const nextTheme = getNextLoginTheme(theme)
    setTheme(nextTheme)

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(LOGIN_THEME_STORAGE_KEY, nextTheme)
      } catch {
        // Theme switching remains available when browser storage is blocked.
      }
    }
  }

  return { cycleTheme, theme }
}
