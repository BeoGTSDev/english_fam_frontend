import { afterEach, describe, expect, it, vi } from 'vitest'
import { authApi } from './auth-api'

const profile = {
  profile_id: 'profile-1',
  role: 'STUDENT',
  display_name: 'Learner',
  locale: 'en',
  account_status: 'ACTIVE',
}
const respond = (data: unknown) =>
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(Response.json({ data, meta: { api_version: 'v1' } })),
  )
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})
describe('backend Auth contract', () => {
  it('maps the login identifier to email and keeps password unchanged', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api/v1')
    respond({
      access_token: 'opaque-token',
      token_type: 'Bearer',
      expires_at: new Date(Date.now() + 60000).toISOString(),
    })
    expect(await authApi.login(' USER@Example.test ', ' pAss ')).toMatchObject({
      accessToken: 'opaque-token',
    })
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.test',
          password: ' pAss ',
        }),
      }),
    )
  })
  it('projects safe profile fields and sends bearer credentials only to API', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api/v1')
    respond({ ...profile, password_hash: 'never-copy' })
    expect(await authApi.profile('opaque-token')).toEqual(profile)
    const options = vi.mocked(fetch).mock.calls[0][1]!
    expect(new Headers(options.headers).get('Authorization')).toBe(
      'Bearer opaque-token',
    )
    expect(options.cache).toBe('no-store')
  })
  it.each([
    null,
    {},
    { access_token: '', token_type: 'Bearer', expires_at: 'invalid' },
    { access_token: 'a', token_type: 'Bearer', expires_at: '2000-01-01' },
  ])('rejects malformed or expired login responses', async (body) => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api/v1')
    respond(body)
    await expect(authApi.login('x@y.test', 'p')).rejects.toMatchObject({
      kind: 'unknown',
    })
  })
  it.each([
    { ...profile, role: 'SUPERADMIN' },
    { ...profile, account_status: 'SUSPENDED' },
    { ...profile, display_name: null },
  ])('rejects unsafe session projections', async (body) => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api/v1')
    respond(body)
    await expect(authApi.profile('token')).rejects.toMatchObject({
      kind: 'unknown',
    })
  })
})
