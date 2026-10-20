import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from './api-client'
import { AppError } from '../errors/app-error'

const fetchMock = vi.fn<typeof fetch>()
beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com/api/v1/')
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  fetchMock.mockReset()
})

describe('shared API transport', () => {
  it('returns the response envelope intact and preserves caller headers', async () => {
    const body = {
      data: { id: 'one' },
      meta: { request_id: 'req', api_version: 'v1' },
    }
    fetchMock.mockResolvedValue(Response.json(body))
    await expect(
      apiRequest('/items', { headers: { Authorization: 'Bearer session' } }),
    ).resolves.toEqual(body)
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://api.example.com/api/v1/items',
    )
    const options = fetchMock.mock.calls[0][1]!
    expect(new Headers(options.headers).get('Accept')).toBe('application/json')
    expect(new Headers(options.headers).get('Authorization')).toBe(
      'Bearer session',
    )
  })
  it.each([
    [401, 'unauthenticated'],
    [403, 'forbidden'],
    [404, 'not-found'],
    [409, 'conflict'],
    [422, 'validation'],
    [429, 'rate-limited'],
    [503, 'retryable-dependency'],
    [500, 'unknown'],
  ])(
    'maps status %s without exposing backend error messages',
    async (status, kind) => {
      fetchMock.mockResolvedValue(
        Response.json(
          {
            error: {
              code: 'SAFE_CODE',
              message: 'private database URI',
              password: 'secret',
            },
          },
          { status: status as number },
        ),
      )
      const result = apiRequest('/items')
      await expect(result).rejects.toBeInstanceOf(AppError)
      await expect(result).rejects.toMatchObject({
        kind,
        status,
        code: 'SAFE_CODE',
      })
      await expect(result).rejects.not.toHaveProperty(
        'message',
        'private database URI',
      )
    },
  )
  it('accepts empty 204 responses', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
    await expect(
      apiRequest('/session', { method: 'DELETE' }),
    ).resolves.toBeUndefined()
  })
  it('maps network errors to a safe retryable dependency failure', async () => {
    fetchMock.mockRejectedValue(new TypeError('secret internal DNS address'))
    await expect(apiRequest('/items')).rejects.toMatchObject({
      kind: 'retryable-dependency',
      code: 'NETWORK_UNAVAILABLE',
      message: 'A required service is temporarily unavailable.',
    })
  })
  it('rejects malformed success JSON using a safe unknown error', async () => {
    fetchMock.mockResolvedValue(
      new Response('private malformed body', { status: 200 }),
    )
    await expect(apiRequest('/items')).rejects.toMatchObject({
      kind: 'unknown',
      message: 'The request could not be completed.',
    })
  })
  it('classifies malformed error bodies by HTTP status alone', async () => {
    fetchMock.mockResolvedValue(
      new Response('private error payload', { status: 503 }),
    )
    await expect(apiRequest('/items')).rejects.toMatchObject({
      kind: 'retryable-dependency',
      status: 503,
      code: undefined,
    })
  })
  it('fails safely without configuration before sending requests', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    await expect(apiRequest('/items')).rejects.toMatchObject({
      kind: 'configuration',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('bounds requests to twenty seconds and clears the timeout', async () => {
    vi.useFakeTimers()
    fetchMock.mockImplementation(
      (_url, options) =>
        new Promise((_resolve, reject) =>
          options?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          ),
        ),
    )
    const request = apiRequest('/items')
    const assertion = expect(request).rejects.toMatchObject({
      kind: 'retryable-dependency',
      code: 'REQUEST_TIMEOUT',
    })
    await vi.advanceTimersByTimeAsync(20_000)
    await assertion
    expect(vi.getTimerCount()).toBe(0)
  })
  it('respects caller cancellation and removes its listener', async () => {
    vi.useFakeTimers()
    const caller = new AbortController()
    const remove = vi.spyOn(caller.signal, 'removeEventListener')
    fetchMock.mockImplementation(
      (_url, options) =>
        new Promise((_resolve, reject) =>
          options?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          ),
        ),
    )
    const request = apiRequest('/items', { signal: caller.signal })
    const assertion = expect(request).rejects.toMatchObject({
      kind: 'retryable-dependency',
      code: 'REQUEST_CANCELLED',
    })
    caller.abort()
    await assertion
    expect(remove).toHaveBeenCalledWith('abort', expect.any(Function))
    expect(vi.getTimerCount()).toBe(0)
  })
  it('does not send a request already cancelled by the caller', async () => {
    const caller = new AbortController()
    caller.abort()
    await expect(
      apiRequest('/items', { signal: caller.signal }),
    ).rejects.toMatchObject({ code: 'REQUEST_CANCELLED' })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
