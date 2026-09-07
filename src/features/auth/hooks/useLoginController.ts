import { type FormEvent, useState } from 'react'

import type { SignInCredentials, SignInHandler } from '../auth.types'
import type { LoginCopy } from '../login.copy'

export interface LoginFieldErrors {
  username?: string
  password?: string
}

export interface PerformSignInResult {
  ok: boolean
  formError?: string
}

interface UseLoginControllerOptions {
  onSignIn: SignInHandler
  copy: LoginCopy
  onValidationError?: (firstInvalidField: 'username' | 'password') => void
}

export function validateLoginInput(
  username: string,
  password: string,
  copy: LoginCopy,
): LoginFieldErrors {
  const errors: LoginFieldErrors = {}

  if (!username.trim()) errors.username = copy.usernameRequired
  if (!password) errors.password = copy.passwordRequired

  return errors
}

export async function performSignIn(
  credentials: SignInCredentials,
  onSignIn: SignInHandler,
  copy: LoginCopy,
): Promise<PerformSignInResult> {
  const trimmedUsername = credentials.username.trim()

  try {
    const result = await onSignIn({
      username: trimmedUsername,
      password: credentials.password,
    })

    if (!result.ok) {
      return {
        ok: false,
        formError:
          result.reason === 'invalid-credentials'
            ? copy.invalidCredentials
            : copy.unavailable,
      }
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      formError: copy.unavailable,
    }
  }
}

export function useLoginController({
  onSignIn,
  copy,
  onValidationError,
}: UseLoginControllerOptions) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [formError, setFormError] = useState<string>()

  function updateUsername(value: string) {
    setUsername(value)
    setFieldErrors((current) => ({ ...current, username: undefined }))
    setFormError(undefined)
  }

  function updatePassword(value: string) {
    setPassword(value)
    setFieldErrors((current) => ({ ...current, password: undefined }))
    setFormError(undefined)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validateLoginInput(username, password, copy)
    setFieldErrors(errors)
    setFormError(undefined)

    if (errors.username) {
      onValidationError?.('username')
      return
    }

    if (errors.password) {
      onValidationError?.('password')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await performSignIn({ username, password }, onSignIn, copy)

      if (!result.ok) {
        setFormError(result.formError)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    fieldErrors,
    formError,
    isSubmitting,
    password,
    setShowPassword,
    showPassword,
    submit,
    updatePassword,
    updateUsername,
    username,
  }
}
