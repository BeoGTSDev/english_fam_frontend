export const loginThemes = ['ocean', 'sunset', 'night', 'sunrise'] as const

export type LoginTheme = (typeof loginThemes)[number]

export const loginThemeLabels: Record<LoginTheme, string> = {
  ocean: 'Ocean',
  sunset: 'Sunset',
  night: 'Night',
  sunrise: 'Sunrise',
}

export function getNextLoginTheme(theme: LoginTheme): LoginTheme {
  const currentIndex = loginThemes.indexOf(theme)

  return loginThemes[(currentIndex + 1) % loginThemes.length]
}

export function isLoginTheme(value: string | null): value is LoginTheme {
  return loginThemes.some((theme) => theme === value)
}
