export interface SignInCredentials {
  username: string
  password: string
}

export type SignInFailureReason = 'invalid-credentials' | 'unavailable'

export type SignInResult =
  | { ok: true }
  | { ok: false; reason: SignInFailureReason }

export type SignInHandler = (
  credentials: SignInCredentials,
) => Promise<SignInResult>
