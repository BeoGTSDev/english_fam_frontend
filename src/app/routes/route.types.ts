import type { ReactNode } from 'react'

export type AppRole = 'student' | 'guardian' | 'admin'

export interface AppRouteDefinition {
  path: string
  element: ReactNode
  roles?: readonly AppRole[]
}

// Route roles only control frontend UX/navigation. Backend authorization remains authoritative.
