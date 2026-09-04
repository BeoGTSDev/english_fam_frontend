import { AppShell } from '../layouts/AppShell'

export function AppRoot() {
  return (
    <AppShell>
      <main className="px-6 py-12">
        <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            EnglishFam
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Frontend application foundation ready
          </h1>
          <p className="mt-4 text-slate-600">
            Phase 8 feature work must follow the approved feature-first
            architecture, API contracts, role boundaries and frozen UI baseline.
          </p>
        </section>
      </main>
    </AppShell>
  )
}
