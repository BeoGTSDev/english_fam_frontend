import { useCallback, useEffect, useRef, useState } from 'react'
import { AppError } from '../../../shared/errors/app-error'
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
  return { profile, notice, signIn, signOut }
}
