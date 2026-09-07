export interface LoginCopy {
  brandName: string
  title: string
  subtitle: string
  usernameLabel: string
  usernamePlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  showPassword: string
  hidePassword: string
  submit: string
  submitting: string
  usernameRequired: string
  passwordRequired: string
  invalidCredentials: string
  unavailable: string
  switchToTheme: string
}

export const englishLoginCopy: LoginCopy = {
  brandName: 'EnglishFam',
  title: 'Welcome back',
  subtitle: 'Sign in with the account provided by your administrator.',
  usernameLabel: 'Username',
  usernamePlaceholder: 'Enter your username',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  submit: 'Sign in',
  submitting: 'Signing in…',
  usernameRequired: 'Enter your username.',
  passwordRequired: 'Enter your password.',
  invalidCredentials: 'Invalid login credentials.',
  unavailable: 'Sign-in is temporarily unavailable. Please try again.',
  switchToTheme: 'Switch to theme',
}

export const vietnameseLoginCopy: LoginCopy = {
  brandName: 'EnglishFam',
  title: 'Chào mừng bạn trở lại',
  subtitle: 'Đăng nhập bằng tài khoản do Quản trị viên cung cấp.',
  usernameLabel: 'Tên đăng nhập',
  usernamePlaceholder: 'Nhập tên đăng nhập',
  passwordLabel: 'Mật khẩu',
  passwordPlaceholder: 'Nhập mật khẩu',
  showPassword: 'Hiện mật khẩu',
  hidePassword: 'Ẩn mật khẩu',
  submit: 'Đăng nhập',
  submitting: 'Đang đăng nhập…',
  usernameRequired: 'Vui lòng nhập tên đăng nhập.',
  passwordRequired: 'Vui lòng nhập mật khẩu.',
  invalidCredentials: 'Thông tin đăng nhập không chính xác.',
  unavailable: 'Tạm thời không thể đăng nhập. Vui lòng thử lại.',
  switchToTheme: 'Chuyển sang giao diện',
}
