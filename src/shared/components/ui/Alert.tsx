import type { ReactNode } from 'react'

export type AlertType = 'info' | 'success' | 'warning' | 'danger' | 'conflict'

export interface AlertProps {
  type?: AlertType
  title?: string
  children: ReactNode
  action?: ReactNode
  onDismiss?: () => void
  className?: string
}

export function Alert({
  type = 'info',
  title,
  children,
  action,
  onDismiss,
  className = '',
}: AlertProps) {
  const typeConfig: Record<
    AlertType,
    {
      border: string
      bg: string
      text: string
      iconColor: string
      icon: ReactNode
    }
  > = {
    info: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      iconColor: 'text-blue-600',
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    success: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      iconColor: 'text-emerald-600',
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    warning: {
      border: 'border-amber-200',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      iconColor: 'text-amber-600',
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    danger: {
      border: 'border-rose-200',
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      iconColor: 'text-rose-600',
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
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    conflict: {
      border: 'border-purple-200',
      bg: 'bg-purple-50',
      text: 'text-purple-950',
      iconColor: 'text-purple-600',
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
    },
  }

  const current = typeConfig[type]

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${current.bg} ${current.border} ${current.text} ${className}`.trim()}
    >
      <div className={`mt-0.5 shrink-0 ${current.iconColor}`}>
        {current.icon}
      </div>
      <div className="flex-1">
        {title && <h4 className="font-bold mb-1">{title}</h4>}
        <div className="leading-relaxed">{children}</div>
        {action && <div className="mt-3 flex items-center gap-2">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
