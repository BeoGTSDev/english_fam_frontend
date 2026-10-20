import { apiRequest } from '../../../shared/api/api-client'
import { AppError } from '../../../shared/errors/app-error'

export interface BackendSession {
  accessToken: string
  expiresAt: number
}
export interface SessionProfile {
  profile_id: string
  role: 'ADMIN' | 'STUDENT' | 'GUARDIAN'
  display_name: string
  locale: string
  account_status: 'ACTIVE'
}
function data(body: unknown): Record<string, unknown> {
  if (typeof body !== 'object' || body === null || !('data' in body))
    throw invalid()
  const value = body.data
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw invalid()
  return value as Record<string, unknown>
}
const invalid = () =>
  new AppError('unknown', 'The server response could not be verified.')
const authorization = (token: string) => ({ Authorization: `Bearer ${token}` })

export const authApi = {
  async login(email: string, password: string): Promise<BackendSession> {
    const result = data(
      await apiRequest<unknown>('auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      }),
    )
    const expiresAt =
      typeof result.expires_at === 'string'
        ? Date.parse(result.expires_at)
        : NaN
    if (
      typeof result.access_token !== 'string' ||
      !result.access_token ||
      /\s/.test(result.access_token) ||
      result.token_type !== 'Bearer' ||
      !Number.isFinite(expiresAt) ||
      expiresAt <= Date.now()
    )
      throw invalid()
    return { accessToken: result.access_token, expiresAt }
  },
  async profile(token: string): Promise<SessionProfile> {
    const result = data(
      await apiRequest<unknown>('session', {
        headers: authorization(token),
        cache: 'no-store',
      }),
    )
    if (
      typeof result.profile_id !== 'string' ||
      !result.profile_id ||
      !['ADMIN', 'STUDENT', 'GUARDIAN'].includes(String(result.role)) ||
      typeof result.display_name !== 'string' ||
      typeof result.locale !== 'string' ||
      result.account_status !== 'ACTIVE'
    )
      throw invalid()
    // Deliberately project safe fields; unknown server fields never become UI state.
    return {
      profile_id: result.profile_id,
      role: result.role as SessionProfile['role'],
      display_name: result.display_name,
      locale: result.locale,
      account_status: 'ACTIVE',
    }
  },
  async logout(token: string): Promise<void> {
    await apiRequest<unknown>('auth/logout', {
      method: 'POST',
      headers: authorization(token),
    })
  },
}
