import { useState, type ReactNode } from 'react'

export type AdminTab =
  | 'dashboard'
  | 'accounts'
  | 'assignments'
  | 'curriculum'
  | 'questions'
  | 'assessment-review'
  | 'operations'

export interface AdminShellProps {
  currentTab: AdminTab
  onSelectTab: (tab: AdminTab) => void
  children: ReactNode
}

interface NavItem {
  id: AdminTab
  labelVi: string
  labelEn: string
  icon: ReactNode
  flowId: string
}

export function AdminShell({
  currentTab,
  onSelectTab,
  children,
}: AdminShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'vi' | 'en'>('vi')

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      labelVi: 'Tổng quan hệ thống',
      labelEn: 'Admin Dashboard',
      flowId: 'UF-ADM-006',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      id: 'accounts',
      labelVi: 'Tài khoản & Người dùng',
      labelEn: 'Accounts / Users',
      flowId: 'UF-ADM-001',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: 'assignments',
      labelVi: 'Phân công Phụ huynh - Học sinh',
      labelEn: 'Guardian–Student Assignments',
      flowId: 'UF-ADM-002',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
    },
    {
      id: 'curriculum',
      labelVi: 'Chương trình học (Curriculum)',
      labelEn: 'Curriculum Governance',
      flowId: 'UF-ADM-003',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      id: 'questions',
      labelVi: 'Ngân hàng câu hỏi',
      labelEn: 'Question Bank',
      flowId: 'UF-ADM-004',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 'assessment-review',
      labelVi: 'Duyệt bài đánh giá gắn cờ',
      labelEn: 'Assessment Review',
      flowId: 'UF-ADM-005',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
    {
      id: 'operations',
      labelVi: 'Vận hành & Giám sát',
      labelEn: 'Operations & Monitoring',
      flowId: 'UF-ADM-006',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ]

  const handleTabClick = (tab: AdminTab) => {
    onSelectTab(tab)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200 bg-white z-20">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg shadow-sm">
            EF
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">
              EnglishFam Admin
            </h1>
            <span className="text-[11px] font-medium text-slate-500 mt-1 inline-block">
              Quản trị nền tảng gia đình
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            7 Phân hệ Chuẩn (Canonical Surfaces)
          </div>
          {navItems.map((item) => {
            const isActive = currentTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left">
                  {language === 'vi' ? item.labelVi : item.labelEn}
                </span>
                {item.id === 'curriculum' && (
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                    EFA-198
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Capability info footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">
              Quyền hạn (Capability):
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 leading-normal">
            <code>admin:curriculum:manage</code>
            <br />
            <code>admin:account:provision</code>
          </p>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            EF
          </div>
          <span className="text-sm font-bold text-slate-900">
            EnglishFam Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white p-4 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-bold text-slate-900">
                Danh mục Quản trị
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3.5 py-3 text-xs font-semibold cursor-pointer min-h-[44px] ${
                    currentTab === item.id
                      ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{language === 'vi' ? item.labelVi : item.labelEn}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top bar for desktop */}
        <div className="hidden lg:flex items-center justify-between border-b border-slate-200 bg-white px-8 py-3.5 sticky top-0 z-10 shadow-2xs">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-slate-800 capitalize">
              {navItems.find((n) => n.id === currentTab)?.labelVi}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language switch */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('vi')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'vi'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                Tiếng Việt
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                English
              </button>
            </div>

            {/* Profile avatar */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                AD
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-slate-800">
                  Administrator
                </div>
                <div className="text-[10px] text-slate-400">
                  admin@englishfam.internal
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content body */}
        <main className="flex-1 p-2 sm:p-4">{children}</main>
      </div>
    </div>
  )
}
