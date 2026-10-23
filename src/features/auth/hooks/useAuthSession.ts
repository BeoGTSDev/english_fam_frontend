import { useCallback, useEffect, useRef, useState } from 'react'
import { AppError } from '../../../shared/errors/app-error'
import {
  apiRequest,
  type AuthorizedApiRequest,
} from '../../../shared/api/api-client'
import {
  authApi,
  type BackendSession,
  type SessionProfile,
} from '../api/auth-api'
import type { SignInHandler } from '../auth.types'

export function useAuthSession(api = authApi) {
  const [profile, setProfile] = useState<SessionProfile | null>(null)
  const [notice, setNotice] = useState('')
  const session = useRef<BackendSession | null>(null)
  const generation = useRef(0)
  const pending = useRef(false)
  const clear = useCallback((message = '') => {
    generation.current++
    session.current = null
    setProfile(null)
    setNotice(message)
  }, [])

  const signIn: SignInHandler = async ({ username, password }) => {
    if (pending.current) return { ok: false, reason: 'unavailable' }
    pending.current = true
    const revision = ++generation.current
    let issued: BackendSession | undefined
    try {
      issued = await api.login(username, password)
      const verified = await api.profile(issued.accessToken)
      if (generation.current !== revision || issued.expiresAt <= Date.now()) {
        void api.logout(issued.accessToken).catch(() => {})
        return { ok: false, reason: 'unavailable' }
      }
      session.current = issued
      setProfile(verified)
      setNotice('')
      return { ok: true }
    } catch (error) {
      if (issued) void api.logout(issued.accessToken).catch(() => {})
      return {
        ok: false,
        reason:
          error instanceof AppError && error.kind === 'unauthenticated'
            ? 'invalid-credentials'
            : 'unavailable',
      }
    } finally {
      pending.current = false
    }
  }

  const signOut = async () => {
    const token = session.current?.accessToken
    clear()
    const revision = generation.current
    if (!token) return
    try {
      await api.logout(token)
    } catch (error) {
      if (
        generation.current === revision &&
        !(
          error instanceof AppError &&
          ['unauthenticated', 'forbidden'].includes(error.kind)
        )
      )
        setNotice(
          'Signed out on this device. Server sign-out could not be confirmed; please retry signing in if needed.',
        )
    }
  }
  const request: AuthorizedApiRequest = useCallback(
    async <T>(path: string, init: RequestInit = {}): Promise<T> => {
      if (init.signal?.aborted)
        throw new AppError(
          'retryable-dependency',
          'The request was cancelled.',
          { code: 'REQUEST_CANCELLED' },
        )
      const active = session.current,
        revision = generation.current
      if (!active || active.expiresAt <= Date.now()) {
        clear('Your session has expired. Please sign in again.')
        throw new AppError('unauthenticated', 'Authentication is required.')
      }
      const headers = new Headers(init.headers)
      headers.set('Authorization', `Bearer ${active.accessToken}`)
      try {
        const value = await apiRequest<T>(path, { ...init, headers })
        if (generation.current !== revision)
          throw new AppError('unauthenticated', 'Authentication is required.')
        return value
      } catch (error) {
        if (
          generation.current === revision &&
          error instanceof AppError &&
          error.kind === 'unauthenticated'
        )
          clear('Your session is no longer available. Please sign in again.')
        throw error
      }
    },
    [clear],
  )

  useEffect(() => {
    const active = session.current
    if (!active || !profile) return
    const revision = generation.current
    const expire = () => {
      if (generation.current === revision)
        clear('Your session has expired. Please sign in again.')
    }
    const timer = window.setTimeout(
      expire,
      Math.max(0, active.expiresAt - Date.now()),
    )
    const revalidate = async () => {
      if (document.visibilityState !== 'visible') return
      if (active.expiresAt <= Date.now()) {
        expire()
        return
      }
      try {
        const current = await api.profile(active.accessToken)
        if (generation.current === revision) {
          setProfile((previous) =>
            previous && JSON.stringify(previous) === JSON.stringify(current)
              ? previous
              : current,
          )
          setNotice('')
        }
      } catch (error) {
        if (generation.current !== revision) return
        if (
          error instanceof AppError &&
          ['unauthenticated', 'forbidden'].includes(error.kind)
        )
          clear('Your session is no longer available. Please sign in again.')
        else
          setNotice(
            'Session verification is temporarily unavailable. Please try again.',
          )
      }
    }
    document.addEventListener('visibilitychange', revalidate)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', revalidate)
    }
  }, [api, clear, profile])

  useEffect(
    () => () => {
      generation.current++
      session.current = null
    },
    [],
  )
  return { profile, notice, signIn, signOut, request }
}
