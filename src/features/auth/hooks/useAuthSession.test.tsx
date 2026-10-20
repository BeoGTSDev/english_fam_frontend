// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppError } from '../../../shared/errors/app-error'
import { useAuthSession } from './useAuthSession'

const profile = {
  profile_id: 'p1',
  role: 'STUDENT' as const,
  display_name: 'Learner',
  locale: 'en',
  account_status: 'ACTIVE' as const,
}
const api = () => ({
  login: vi.fn().mockResolvedValue({
    accessToken: 'private-token',
    expiresAt: Date.now() + 60000,
  }),
  profile: vi.fn().mockResolvedValue(profile),
  logout: vi.fn().mockResolvedValue(undefined),
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})
describe('in-memory backend session lifecycle', () => {
  it('does not let an old failed logout overwrite a newly verified session', async () => {
    const backend = api()
    let reject!: (error: Error) => void
    backend.logout.mockImplementationOnce(
      () =>
        new Promise((_resolve, fail) => {
          reject = fail
        }),
    )
    const { result } = renderHook(() => useAuthSession(backend))
    await act(async () => {
      await result.current.signIn({ username: 'u', password: 'p' })
    })
    let logout!: Promise<void>
    act(() => {
      logout = result.current.signOut()
    })
    await act(async () => {
      await result.current.signIn({ username: 'u', password: 'p' })
    })
    await act(async () => {
      reject(new Error('outage'))
      await logout
    })
    expect(result.current.profile).toEqual(profile)
    expect(result.current.notice).toBe('')
  })
  it.each(['unauthenticated', 'forbidden'] as const)(
    'clears identity after server %s on visibility revalidation',
    async (kind) => {
      const backend = api()
      const { result } = renderHook(() => useAuthSession(backend))
      await act(async () => {
        await result.current.signIn({ username: 'u', password: 'p' })
      })
      backend.profile.mockRejectedValueOnce(new AppError(kind, 'safe'))
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: 'visible',
      })
      await act(async () => {
        document.dispatchEvent(new Event('visibilitychange'))
      })
      expect(result.current.profile).toBeNull()
      expect(result.current.notice).toContain('no longer available')
    },
  )
  it('requires verified server profile before authentication and never persists credentials', async () => {
    const backend = api()
    const storage = vi.spyOn(Storage.prototype, 'setItem')
    const { result } = renderHook(() => useAuthSession(backend))
    await act(async () => {
      expect(
        await result.current.signIn({
          username: 'u@e.test',
          password: 'secret',
        }),
      ).toEqual({ ok: true })
    })
    expect(result.current.profile).toEqual(profile)
    expect(backend.profile).toHaveBeenCalledWith('private-token')
    expect(storage).not.toHaveBeenCalled()
    await act(async () => {
      await result.current.signOut()
    })
    expect(result.current.profile).toBeNull()
    expect(backend.logout).toHaveBeenCalledWith('private-token')
  })
  it('revokes an issued token when profile verification fails', async () => {
    const backend = api()
    backend.profile.mockRejectedValue(new AppError('forbidden', 'safe'))
    const { result } = renderHook(() => useAuthSession(backend))
    await act(async () => {
      expect(
        (await result.current.signIn({ username: 'u', password: 'p' })).ok,
      ).toBe(false)
    })
    expect(result.current.profile).toBeNull()
    expect(backend.logout).toHaveBeenCalledWith('private-token')
  })
  it('clears profile at authoritative expiry', async () => {
    vi.useFakeTimers()
    const backend = api()
    const { result } = renderHook(() => useAuthSession(backend))
    await act(async () => {
      await result.current.signIn({ username: 'u', password: 'p' })
    })
    act(() => {
      vi.advanceTimersByTime(60001)
    })
    expect(result.current.profile).toBeNull()
    expect(result.current.notice).toContain('expired')
  })
  it('clears local identity even when server logout fails', async () => {
    const backend = api()
    backend.logout.mockRejectedValue(
      new AppError('retryable-dependency', 'safe'),
    )
    const { result } = renderHook(() => useAuthSession(backend))
    await act(async () => {
      await result.current.signIn({ username: 'u', password: 'p' })
    })
    await act(async () => {
      await result.current.signOut()
    })
    expect(result.current.profile).toBeNull()
    expect(result.current.notice).toContain('could not be confirmed')
  })
  it('ignores late login after sign-out and revokes the late session', async () => {
    const backend = api()
    let resolve!: (value: typeof profile) => void
    backend.profile.mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done
        }),
    )
    const { result } = renderHook(() => useAuthSession(backend))
    let login!: Promise<unknown>
    await act(async () => {
      login = result.current.signIn({ username: 'u', password: 'p' })
      await Promise.resolve()
    })
    await act(async () => {
      await result.current.signOut()
      resolve(profile)
      await login
    })
    expect(result.current.profile).toBeNull()
    expect(backend.logout).toHaveBeenCalledWith('private-token')
  })
  it.each(['unauthenticated', 'retryable-dependency'] as const)(
    'classifies login denial %s safely',
    async (kind) => {
      const backend = api()
      backend.login.mockRejectedValue(new AppError(kind, 'safe'))
      const { result } = renderHook(() => useAuthSession(backend))
      await act(async () => {
        expect(
          await result.current.signIn({ username: 'u', password: 'p' }),
        ).toEqual({
          ok: false,
          reason:
            kind === 'unauthenticated' ? 'invalid-credentials' : 'unavailable',
        })
      })
    },
  )
})
