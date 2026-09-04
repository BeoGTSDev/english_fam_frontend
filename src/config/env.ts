export interface ClientEnv {
  apiBaseUrl: string
  appEnv: string
}

export function readClientEnv(): ClientEnv {
  return {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim() ?? '',
    appEnv: import.meta.env.VITE_APP_ENV?.trim() ?? 'local',
  }
}
