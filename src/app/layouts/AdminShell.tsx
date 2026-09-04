import { useState, type ReactNode } from 'react'
import { useLanguage } from '../context/LanguageContext'

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
  labelKey: string
  flowId: string
  icon: ReactNode
}

export function AdminShell({
  currentTab,
  onSelectTab,
  children,
}: AdminShellProps) {
  const { language, setLanguage, t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ef_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('ef_sidebar_collapsed', String(next))
      } catch {
        // ignore localStorage errors
      }
      return next
    })
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      labelKey: 'nav.dashboard',
      flowId: 'UF-ADM-006',
      icon: (
        <svg
          className="h-4 w-4 shrink-0"
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
      labelKey: 'nav.accounts',
      flowId: 'UF-ADM-001',
      icon: (
        <svg
          className="h-4 w-4 shrink-0"
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
      labelKey: 'nav.assignments',
      flowId: 'UF-ADM-002',
      icon: (
        <svg
          className="h-4 w-4 shrink-0"
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
      labelKey: 'nav.curriculum',
      flowId: 'UF-ADM-003',
      icon: (
        <svg
          className="h-4 w-4 shrink-0"
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
      labelKey: 'nav.questions',
      flowId: 'UF-ADM-004',
      icon: (
        <svg
          className="h-4 w-4 shrink-0"
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
      labelKey: 'nav.assessmentReview',
      flowId: 'UF-ADM-005',
      icon: (
        <svg
          className="h-4 w-4 shrink-0"
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
      labelKey: 'nav.operations',
      flowId: 'UF-ADM-006',
      icon: (
        <svg
          className="h-4 w-4 shrink-0"
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row antialiased">
      {/* Desktop Sidebar (Collapsible: w-64 vs w-16) */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-800 bg-[#0B132B] z-20 transition-all duration-200 ease-in-out ${
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        }`}
      >
        {/* Brand with Logo & Collapse Button */}
        <div
          className={`flex items-center border-b border-slate-800/80 bg-slate-950/40 py-3 ${
            isCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src="/englishfam-logo.png"
              alt="EnglishFam Logo"
              className="h-7 w-auto object-contain rounded bg-white p-0.5 shrink-0"
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5 leading-tight">
                  EnglishFam
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1 py-0.2 rounded">
                    Admin
                  </span>
                </h1>
                <span className="text-[10px] text-slate-400 font-medium block truncate">
                  {t('brand.subtitle')}
                </span>
              </div>
            )}
          </div>

          {/* Toggle button inside sidebar header */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            title={isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
            className="rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {!isCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('nav.section')}
            </div>
          )}
          {navItems.map((item) => {
            const isActive = currentTab === item.id
            const labelText = t(item.labelKey)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                title={isCollapsed ? labelText : undefined}
                className={`w-full flex items-center rounded-lg py-2 text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs shadow-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span
                  className={
                    isCollapsed ? 'sr-only' : 'flex-1 text-left truncate'
                  }
                >
                  {labelText}
                </span>
                {!isCollapsed && item.id === 'curriculum' && (
                  <span
                    className={`rounded text-[10px] font-mono px-1.5 py-0.5 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    EFA-198
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Capability info footer */}
        <div
          className={`border-t border-slate-800 bg-slate-950/60 ${
            isCollapsed
              ? 'p-2.5 flex justify-center'
              : 'p-3 m-2.5 rounded-lg border'
          }`}
          title="admin:curriculum:manage, admin:account:provision"
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            {!isCollapsed && (
              <span className="text-[11px] font-semibold text-slate-200">
                {t('nav.capability')}
              </span>
            )}
          </div>
          <p
            className={
              isCollapsed
                ? 'sr-only'
                : 'mt-1 font-mono text-[10px] text-slate-400 leading-tight'
            }
          >
            admin:curriculum:manage
            <br />
            admin:account:provision
          </p>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-[#0B132B] px-4 py-2.5 shadow-md">
        <div className="flex items-center gap-2.5">
          <img
            src="/englishfam-logo.png"
            alt="EnglishFam"
            className="h-7 w-auto object-contain rounded bg-white p-0.5"
          />
          <span className="text-xs font-bold text-white">EnglishFam Admin</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle for mobile */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-blue-400 cursor-pointer"
          >
            {language === 'vi' ? '🇻🇳 VN' : '🇬🇧 EN'}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 cursor-pointer flex items-center justify-center"
          >
            <svg
              className="h-5 w-5"
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
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-[#0B132B] border-r border-slate-800 p-4 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-xs text-white">
                {t('nav.section')}
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
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
                  className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium cursor-pointer ${
                    currentTab === item.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{t(item.labelKey)}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area (Dynamic padding for collapsed/expanded sidebar) */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ease-in-out ${
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}
      >
        {/* Top bar for desktop */}
        <div className="hidden lg:flex items-center justify-between border-b border-slate-200/80 bg-white px-5 py-2 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {/* Sidebar toggle button in topbar */}
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={
                isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'
              }
              title={isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer mr-1"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h11"
                />
              </svg>
            </button>
            <span className="font-medium text-slate-400">Admin</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">
              {t(navItems.find((n) => n.id === currentTab)?.labelKey || '')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Professional Capsule Language Switcher */}
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('vi')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-150 cursor-pointer text-xs ${
                  language === 'vi'
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <span
                  className={`text-[9px] font-bold uppercase px-1 py-0.2 rounded ${
                    language === 'vi'
                      ? 'bg-red-50 text-red-600 border border-red-200/80'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  VN
                </span>
                <span>Tiếng Việt</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-150 cursor-pointer text-xs ${
                  language === 'en'
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <span
                  className={`text-[9px] font-bold uppercase px-1 py-0.2 rounded ${
                    language === 'en'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200/80'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  EN
                </span>
                <span>English</span>
              </button>
            </div>

            {/* Profile avatar */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="h-7 w-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                AD
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-slate-800">
                  {t('profile.role')}
                </div>
                <div className="text-[10px] text-slate-400">
                  {t('profile.email')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content body - Fixed stable container so toggling sidebar does not break layout */}
        <main className="flex-1 p-3 sm:p-4 lg:p-5">
          <div className="max-w-6xl mx-auto w-full transition-all duration-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
