import { AppShell } from '../layouts/AppShell'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { useAuthSession } from '../../features/auth/hooks/useAuthSession'
import { englishLoginCopy } from '../../features/auth/login.copy'

export function AppRoot() {
  const { profile, notice, signIn, signOut } = useAuthSession()
  return (
    <AppShell>
      {notice && (
        <p role="status" className="p-4 text-center">
          {notice}
        </p>
      )}
      {profile ? (
        <main className="mx-auto max-w-xl p-8">
          <h1 className="text-2xl font-semibold">EnglishFam</h1>
          <p className="my-4">Signed in as {profile.display_name}.</p>
          <button
            type="button"
            className="rounded border px-4 py-2"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </main>
      ) : (
        <LoginPage
          onSignIn={signIn}
          copy={{
            ...englishLoginCopy,
            usernameLabel: 'Email',
            usernamePlaceholder: 'Enter your account email',
            usernameRequired: 'Enter your account email.',
          }}
        />
      )}
    </AppShell>
  )
}
