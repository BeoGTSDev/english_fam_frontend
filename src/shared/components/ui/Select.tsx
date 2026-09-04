import type { ReactNode, SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: SelectOption[]
  children?: ReactNode
}

export function Select({
  label,
  error,
  options,
  children,
  id,
  className = '',
  disabled,
  ...props
}: SelectProps) {
  const selectId =
    id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          id={selectId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-1 disabled:bg-slate-50 disabled:text-slate-400 min-h-[44px] cursor-pointer ${
            error
              ? 'border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500'
              : 'border-slate-300 hover:border-slate-400 focus-visible:border-blue-600 focus-visible:ring-blue-600'
          } ${className}`.trim()}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="pointer-events-none absolute right-3 flex items-center text-slate-400">
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  )
}
