// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { SignInHandler, SignInResult } from '../auth.types'
import { englishLoginCopy } from '../login.copy'
import { LoginForm } from './LoginForm'

describe('LoginForm DOM loading and duplicate submit prevention', () => {
  it('handles loading state, prevents duplicate submissions while pending, and recovers on rejection', async () => {
    const user = userEvent.setup()

    let rejectSignIn!: (reason?: unknown) => void

    const deferredPromise = new Promise<SignInResult>((_, reject) => {
      rejectSignIn = reject
    })

    const onSignIn = vi
      .fn<SignInHandler>()
      .mockImplementation(() => deferredPromise)

    render(<LoginForm onSignIn={onSignIn} copy={englishLoginCopy} />)

    const usernameInput = screen.getByLabelText(
      englishLoginCopy.usernameLabel,
    ) as HTMLInputElement
    const passwordInput = screen.getByLabelText(
      englishLoginCopy.passwordLabel,
    ) as HTMLInputElement
    const submitButton = screen.getByRole('button', {
      name: englishLoginCopy.submit,
    }) as HTMLButtonElement
    const formElement = submitButton.closest('form')!

    // Initial state verification
    expect(formElement.getAttribute('aria-busy')).toBe('false')
    expect(submitButton.disabled).toBe(false)
    expect(usernameInput.disabled).toBe(false)
    expect(passwordInput.disabled).toBe(false)

    // 2. Nhập username/password hợp lệ và submit
    await user.type(usernameInput, 'student-42')
    await user.type(passwordInput, 'valid-password')

    await user.click(submitButton)

    // 3. Trong lúc pending, xác nhận:
    // - Nút hiển thị "Signing in…"
    // - Có loading indicator phù hợp (.auth-spinner)
    // - Nút Sign in bị disabled
    // - Các control cần thiết bị disabled theo implementation hiện hành
    // - Form có aria-busy="true"
    expect(formElement.getAttribute('aria-busy')).toBe('true')
    expect(submitButton.textContent).toContain(englishLoginCopy.submitting)
    expect(submitButton.querySelector('.auth-spinner')).not.toBeNull()
    expect(submitButton.disabled).toBe(true)
    expect(usernameInput.disabled).toBe(true)
    expect(passwordInput.disabled).toBe(true)
    expect(onSignIn).toHaveBeenCalledTimes(1)

    // 4. Thử click nhiều lần và nhấn Enter trong lúc pending
    await user.click(submitButton)
    await user.click(submitButton)
    await user.keyboard('{Enter}')

    // 5. Xác nhận SignInHandler chỉ được gọi đúng 1 lần
    expect(onSignIn).toHaveBeenCalledTimes(1)

    // 6. Khi Promise reject:
    // - Form được enable trở lại
    // - Hiển thị safe unavailable error
    rejectSignIn(new Error('Network offline'))

    await waitFor(() => {
      expect(formElement.getAttribute('aria-busy')).toBe('false')
      expect(submitButton.disabled).toBe(false)
      expect(usernameInput.disabled).toBe(false)
      expect(passwordInput.disabled).toBe(false)
      expect(screen.getByRole('alert').textContent).toContain(
        englishLoginCopy.unavailable,
      )
    })

    // Handler vẫn chỉ được gọi đúng 1 lần trong suốt vòng đời
    expect(onSignIn).toHaveBeenCalledTimes(1)
  })
})
