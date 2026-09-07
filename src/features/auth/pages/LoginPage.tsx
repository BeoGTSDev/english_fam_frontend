import type { SignInHandler } from '../auth.types'
import { LoginForm } from '../components/LoginForm'
import { LoginThemeToggle } from '../components/LoginThemeToggle'
import { useLoginTheme } from '../hooks/useLoginTheme'
import { englishLoginCopy, type LoginCopy } from '../login.copy'
import '../styles/login.css'

interface LoginPageProps {
  onSignIn: SignInHandler
  copy?: LoginCopy
}

export function LoginPage({ onSignIn, copy }: LoginPageProps) {
  const { cycleTheme, theme } = useLoginTheme()
  const resolvedCopy = copy ?? englishLoginCopy

  return (
    <main className="auth-page" data-theme={theme}>
      <svg
        className="auth-waves"
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="auth-wave auth-wave--one"
          d="M0 140C185 96 277 176 454 124c189-55 318 53 489 7 181-49 300 43 497-16v305H0Z"
        />
        <path
          className="auth-wave auth-wave--two"
          d="M0 220c169-50 294 37 462-13 174-52 306 47 482 0 177-47 320 39 496-10v223H0Z"
        />
        <path
          className="auth-wave auth-wave--three"
          d="M0 300c156-39 301 26 458-12 181-43 315 40 491 1 177-40 326 35 491-4v135H0Z"
        />
        <path
          className="auth-wave auth-wave--four"
          d="M0 360c176-28 282 20 461-5 191-28 317 29 495 2 186-28 309 22 484-3v66H0Z"
        />
      </svg>

      <section className="auth-card">
        <LoginThemeToggle
          theme={theme}
          switchToThemeLabel={resolvedCopy.switchToTheme}
          onCycleTheme={cycleTheme}
        />
        <LoginForm onSignIn={onSignIn} copy={resolvedCopy} />
      </section>
    </main>
  )
}
