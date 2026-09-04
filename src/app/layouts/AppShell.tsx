import type { PropsWithChildren } from 'react'

export function AppShell({ children }: PropsWithChildren) {
  return <div className="min-h-screen bg-slate-50 text-slate-950">{children}</div>
}
