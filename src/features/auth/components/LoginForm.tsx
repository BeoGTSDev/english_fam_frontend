import { type CSSProperties, useId, useRef } from 'react'

import englishFamLogo from '../assets/englishfam-logo.png'
import type { SignInHandler } from '../auth.types'
import { useLoginController } from '../hooks/useLoginController'
import { englishLoginCopy, type LoginCopy } from '../login.copy'

interface LoginFormProps {
  onSignIn: SignInHandler
  copy?: LoginCopy
}

export function LoginForm({
  onSignIn,
  copy = englishLoginCopy,
}: LoginFormProps) {
  const usernameId = useId()
  const passwordId = useId()
  const usernameErrorId = `${usernameId}-error`
  const passwordErrorId = `${passwordId}-error`

  const usernameInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const {
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
  } = useLoginController({
    onSignIn,
    copy,
    onValidationError(firstInvalidField) {
      if (firstInvalidField === 'username') {
        usernameInputRef.current?.focus()
      } else if (firstInvalidField === 'password') {
        passwordInputRef.current?.focus()
      }
    },
  })

  return (
    <form
      className="auth-form"
      onSubmit={submit}
      noValidate
      aria-busy={isSubmitting}
    >
      <header className="auth-heading">
        <span
          className="auth-brand-logo"
          role="img"
          aria-label={copy.brandName}
          style={
            {
              '--auth-brand-logo-image': `url(${englishFamLogo})`,
            } as CSSProperties
          }
        />
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </header>

      <div className="auth-field">
        <label htmlFor={usernameId}>{copy.usernameLabel}</label>
        <div
          className={`auth-input-shell${fieldErrors.username ? ' auth-input-shell--invalid' : ''}`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
          <input
            ref={usernameInputRef}
            id={usernameId}
            name="username"
            type="text"
            value={username}
            onChange={(event) => updateUsername(event.target.value)}
            placeholder={copy.usernamePlaceholder}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.username)}
            aria-describedby={
              fieldErrors.username ? usernameErrorId : undefined
            }
          />
        </div>
        {fieldErrors.username ? (
          <p className="auth-field-error" id={usernameErrorId}>
            {fieldErrors.username}
          </p>
        ) : null}
      </div>

      <div className="auth-field">
        <label htmlFor={passwordId}>{copy.passwordLabel}</label>
        <div
          className={`auth-input-shell${fieldErrors.password ? ' auth-input-shell--invalid' : ''}`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <rect x="4" y="10" width="16" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          <input
            ref={passwordInputRef}
            id={passwordId}
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => updatePassword(event.target.value)}
            placeholder={copy.passwordPlaceholder}
            autoComplete="current-password"
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? passwordErrorId : undefined
            }
          />
          <button
            className="auth-password-toggle"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={isSubmitting}
            aria-pressed={showPassword}
            aria-label={showPassword ? copy.hidePassword : copy.showPassword}
          >
            {showPassword ? (
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m3 3 18 18" />
                <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5.3 9 8a9.7 9.7 0 0 1-2 3.7" />
                <path d="M6.6 6.6C4.3 8.1 3 10.4 3 12c0 2.7 3.5 8 9 8 1.5 0 2.9-.4 4.1-1" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M3 12c0-2.7 3.5-8 9-8s9 5.3 9 8-3.5 8-9 8-9-5.3-9-8Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          </button>
        </div>
        {fieldErrors.password ? (
          <p className="auth-field-error" id={passwordErrorId}>
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p className="auth-form-error" role="alert" aria-live="assertive">
          {formError}
        </p>
      ) : null}

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="auth-spinner" aria-hidden="true" />
        ) : null}
        {isSubmitting ? copy.submitting : copy.submit}
      </button>
    </form>
  )
}
