import { describe, expect, it, vi } from 'vitest'

import type { SignInHandler } from '../auth.types'
import { englishLoginCopy, vietnameseLoginCopy } from '../login.copy'
import { performSignIn, validateLoginInput } from './useLoginController'

describe('validateLoginInput', () => {
  it('requires both private account fields', () => {
    expect(validateLoginInput('  ', '', englishLoginCopy)).toEqual({
      username: englishLoginCopy.usernameRequired,
      password: englishLoginCopy.passwordRequired,
    })
  })

  it('validates missing username while password is provided', () => {
    expect(validateLoginInput('', 'secret', englishLoginCopy)).toEqual({
      username: englishLoginCopy.usernameRequired,
    })
  })

  it('validates whitespace-only username as empty', () => {
    expect(validateLoginInput('   \t  ', 'secret', englishLoginCopy)).toEqual({
      username: englishLoginCopy.usernameRequired,
    })
  })

  it('validates missing password while username is provided', () => {
    expect(validateLoginInput('student-1', '', englishLoginCopy)).toEqual({
      password: englishLoginCopy.passwordRequired,
    })
  })

  it('returns localized validation errors with Vietnamese copy', () => {
    expect(validateLoginInput('', '', vietnameseLoginCopy)).toEqual({
      username: vietnameseLoginCopy.usernameRequired,
      password: vietnameseLoginCopy.passwordRequired,
    })
  })

  it('accepts a valid username that is not an email address', () => {
    expect(
      validateLoginInput('student-101', 'secret', englishLoginCopy),
    ).toEqual({})
  })
})

describe('performSignIn', () => {
  it('trims username but preserves password spaces', async () => {
    const onSignIn = vi.fn<SignInHandler>().mockResolvedValue({ ok: true })

    const result = await performSignIn(
      { username: '  student-42  ', password: '  pass with spaces  ' },
      onSignIn,
      englishLoginCopy,
    )

    expect(result).toEqual({ ok: true })
    expect(onSignIn).toHaveBeenCalledWith({
      username: 'student-42',
      password: '  pass with spaces  ',
    })
  })

  it('maps invalid-credentials reason to safe localized copy', async () => {
    const onSignIn = vi.fn<SignInHandler>().mockResolvedValue({
      ok: false,
      reason: 'invalid-credentials',
    })

    const result = await performSignIn(
      { username: 'student-1', password: 'wrong' },
      onSignIn,
      englishLoginCopy,
    )

    expect(result).toEqual({
      ok: false,
      formError: englishLoginCopy.invalidCredentials,
    })
  })

  it('maps unavailable reason to safe localized copy', async () => {
    const onSignIn = vi.fn<SignInHandler>().mockResolvedValue({
      ok: false,
      reason: 'unavailable',
    })

    const result = await performSignIn(
      { username: 'student-1', password: 'secret' },
      onSignIn,
      vietnameseLoginCopy,
    )

    expect(result).toEqual({
      ok: false,
      formError: vietnameseLoginCopy.unavailable,
    })
  })

  it('handles handler rejection by returning unavailable without leaking error', async () => {
    const onSignIn = vi
      .fn<SignInHandler>()
      .mockRejectedValue(new Error('Network timeout'))

    const result = await performSignIn(
      { username: 'student-1', password: 'secret' },
      onSignIn,
      englishLoginCopy,
    )

    expect(result).toEqual({
      ok: false,
      formError: englishLoginCopy.unavailable,
    })
  })
})
