export type AppErrorKind =
  | 'configuration'
  | 'unauthenticated'
  | 'forbidden'
  | 'not-found'
  | 'validation'
  | 'conflict'
  | 'rate-limited'
  | 'retryable-dependency'
  | 'unknown'

export class AppError extends Error {
  readonly kind: AppErrorKind
  readonly status?: number
  readonly code?: string

  constructor(
    kind: AppErrorKind,
    message: string,
    options?: { status?: number; code?: string },
  ) {
    super(message)
    this.name = 'AppError'
    this.kind = kind
    this.status = options?.status
    this.code = options?.code
  }
}
