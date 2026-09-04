import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hoverable?: boolean
}

export function Card({
  children,
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-xs ${
        hoverable ? 'transition-shadow hover:shadow-md' : ''
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}
