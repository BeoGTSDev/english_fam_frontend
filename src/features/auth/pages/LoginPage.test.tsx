import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { SignInHandler } from '../auth.types'
import { englishLoginCopy, vietnameseLoginCopy } from '../login.copy'
import { LoginPage } from './LoginPage'

const unavailableSignIn: SignInHandler = async () => ({
  ok: false,
  reason: 'unavailable',
})

describe('LoginPage', () => {
  it('renders private username and password sign-in without public registration', () => {
    const html = renderToStaticMarkup(
      <LoginPage onSignIn={unavailableSignIn} />,
    )

    // Form inputs and accessibility attributes
    expect(html).toContain('name="username"')
    expect(html).toContain('name="password"')
    expect(html).toContain('type="password"')
    expect(html).toContain('autoComplete="username"')
    expect(html).toContain('autoComplete="current-password"')
    expect(html).toContain('placeholder="Enter your username"')
    expect(html).toContain('placeholder="Enter your password"')
    expect(html).toContain('noValidate=""')

    // Theme & Accessible Toggle
    expect(html).toContain('data-theme="ocean"')
    expect(html).toContain('aria-label="Switch to theme Sunset"')
    expect(html).toContain('title="Switch to theme Sunset"')

    // Password toggle
    expect(html).toContain('aria-label="Show password"')
    expect(html).toContain('aria-pressed="false"')

    // Brand logo
    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="EnglishFam"')
    expect(html).toContain('englishfam-logo.png')

    // Submit button
    expect(html).toContain('type="submit"')
    expect(html).toContain('Sign in')

    // Strict non-public verification: No public signup or 3rd-party auth
    expect(html).not.toContain('Sign Up')
    expect(html).not.toContain('Register')
    expect(html).not.toContain('Google')
    expect(html).not.toContain('Apple')
    expect(html).not.toContain('Forgot password')
  })

  it('supports the approved Vietnamese interface copy shape', () => {
    const html = renderToStaticMarkup(
      <LoginPage onSignIn={unavailableSignIn} copy={vietnameseLoginCopy} />,
    )

    expect(html).toContain('Chào mừng bạn trở lại')
    expect(html).toContain(
      'Đăng nhập bằng tài khoản do Quản trị viên cung cấp.',
    )
    expect(html).toContain('Tên đăng nhập')
    expect(html).toContain('Mật khẩu')
    expect(html).toContain('Nhập tên đăng nhập')
    expect(html).toContain('Nhập mật khẩu')
    expect(html).toContain('Đăng nhập')
    expect(html).toContain('aria-label="Chuyển sang giao diện Sunset"')
    expect(html).toContain('aria-label="Hiện mật khẩu"')

    // Ensures no English registration or unauthorized third party appears
    expect(html).not.toContain('Sign Up')
    expect(html).not.toContain('Đăng ký')
    expect(html).not.toContain('Google')
    expect(html).not.toContain('Apple')
    expect(html).not.toContain('Quên mật khẩu')
  })

  it('supports explicit English copy configuration', () => {
    const html = renderToStaticMarkup(
      <LoginPage onSignIn={unavailableSignIn} copy={englishLoginCopy} />,
    )

    expect(html).toContain('Welcome back')
    expect(html).toContain(
      'Sign in with the account provided by your administrator.',
    )
    expect(html).toContain('Username')
    expect(html).toContain('Password')
  })
})
