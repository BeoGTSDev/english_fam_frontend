import { readClientEnv } from '../../config/env'
import { AppError, type AppErrorKind } from '../errors/app-error'

interface ApiErrorEnvelope {
  error?: {
    code?: string
  }
}

function classifyStatus(status: number): AppErrorKind {
  if (status === 401) return 'unauthenticated'
  if (status === 403) return 'forbidden'
  if (status === 404) return 'not-found'
  if (status === 409) return 'conflict'
  if (status === 422) return 'validation'
  if (status === 429) return 'rate-limited'
  if (status === 503) return 'retryable-dependency'
  return 'unknown'
}

function safeMessage(kind: AppErrorKind): string {
  switch (kind) {
    case 'configuration':
      return 'Frontend API configuration is unavailable.'
    case 'unauthenticated':
      return 'Authentication is required.'
    case 'forbidden':
      return 'You do not have permission to perform this action.'
    case 'not-found':
      return 'The requested resource was not found.'
    case 'validation':
      return 'The request contains invalid data.'
    case 'conflict':
      return 'The request conflicts with the current server state.'
    case 'rate-limited':
      return 'Too many requests. Please try again later.'
    case 'retryable-dependency':
      return 'A required service is temporarily unavailable.'
    default:
      return 'The request could not be completed.'
  }
}

async function readErrorEnvelope(
  response: Response,
): Promise<ApiErrorEnvelope> {
  try {
    const body = (await response.json()) as unknown

    if (typeof body !== 'object' || body === null || !('error' in body)) {
      return {}
    }

    const error = Reflect.get(body, 'error')

    if (typeof error !== 'object' || error === null || !('code' in error)) {
      return {}
    }

    const code = Reflect.get(error, 'code')
    return typeof code === 'string' ? { error: { code } } : {}
  } catch {
    // Never surface raw transport/backend payloads to the UI error model.
  }

  return {}
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { apiBaseUrl } = readClientEnv()

  if (!apiBaseUrl) {
    throw new AppError('configuration', safeMessage('configuration'))
  }

  const headers = new Headers(init.headers)

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  const response = await fetch(
    `${apiBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`,
    {
      ...init,
      headers,
    },
  )

  if (!response.ok) {
    const kind = classifyStatus(response.status)
    const envelope = await readErrorEnvelope(response)
    throw new AppError(kind, safeMessage(kind), {
      status: response.status,
      code: envelope.error?.code,
    })
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
