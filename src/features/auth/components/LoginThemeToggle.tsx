import {
  getNextLoginTheme,
  loginThemeLabels,
  type LoginTheme,
} from '../login-theme'

interface LoginThemeToggleProps {
  theme: LoginTheme
  switchToThemeLabel: string
  onCycleTheme: () => void
}

function ThemeIcon({ theme }: { theme: LoginTheme }) {
  if (theme === 'night') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
      </svg>
    )
  }

  if (theme === 'sunrise') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M3 17h1m16 0h1M5.6 10.6l.7.7m12.1-.7-.7.7M8 17a4 4 0 0 1 8 0M3 21h18M12 9V3l3 3m-6 0 3-3" />
      </svg>
    )
  }

  if (theme === 'sunset') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M3 17h1m16 0h1M5.6 10.6l.7.7m12.1-.7-.7.7M8 17a4 4 0 0 1 8 0M3 21h18M12 3v6l3-3m-6 0 3 3" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
    </svg>
  )
}

export function LoginThemeToggle({
  theme,
  switchToThemeLabel,
  onCycleTheme,
}: LoginThemeToggleProps) {
  const nextTheme = getNextLoginTheme(theme)
  const accessibleLabel = `${switchToThemeLabel} ${loginThemeLabels[nextTheme]}`

  return (
    <button
      className="auth-theme-toggle"
      type="button"
      onClick={onCycleTheme}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      <ThemeIcon theme={theme} />
    </button>
  )
}
