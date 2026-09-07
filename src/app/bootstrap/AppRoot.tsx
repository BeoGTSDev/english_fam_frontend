import { AppShell } from '../layouts/AppShell'
import type { SignInHandler } from '../../features/auth/auth.types'
import { LoginPage } from '../../features/auth/pages/LoginPage'

// The approved username/session contract is not available in this repository yet.
// Keep the UI on the typed boundary instead of inventing a backend endpoint.
const unavailableSignIn: SignInHandler = async () => ({
  ok: false,
  reason: 'unavailable',
})

export function AppRoot() {
  return (
    <AppShell>
      <LoginPage onSignIn={unavailableSignIn} />
    </AppShell>
  )
}
