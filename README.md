# EnglishFam Frontend

Private frontend/PWA repository for the EnglishFam family learning platform.

## Canonical documentation

Product scope, requirements, learning rules, API/security contracts and technical architecture are maintained in the canonical documentation repository:

- [BeoGTSDev/english_fam_docs](https://github.com/BeoGTSDev/english_fam_docs)
- Code workflow: `english_fam_docs/docs/06-development/CODE_REPOSITORY_WORKFLOW_EN.md`
- **Frontend coding architecture & folder rules:** `english_fam_docs/docs/06-development/FRONTEND_ARCHITECTURE_RULES_EN.md`
- Agent workflow: `english_fam_docs/AGENTS.md`
- Development environment: `english_fam_docs/docs/06-development/DEVELOPMENT_ENVIRONMENT_EN.md`

This repository consumes those approved contracts rather than redefining them locally.

For Phase 8+ runtime work, the frontend architecture rules are mandatory. The default feature direction is `Page/Route -> Feature Component -> Feature Hook/UI Controller -> API Client/Service -> Backend API`. Client routing/role visibility is UX only and must never become authorization or canonical learning/assessment truth.

## Toolchain

- Node.js 24 LTS
- npm
- React + TypeScript
- Vite
- Tailwind CSS

## Runtime architecture

The EFA-236 application foundation follows the EFA-233 feature-first baseline:

```text
src/
├── app/
│   ├── bootstrap/
│   ├── layouts/
│   └── routes/
├── features/
├── shared/
│   ├── api/
│   └── errors/
├── config/
├── App.tsx
└── main.tsx
```

Feature Jira tickets own their feature folders (`auth`, `learner`, `guardian`, `admin`, `curriculum`, `content`, `assessment`, `roadmap`, `learning`, `ai-tutor`) when those modules are implemented. Shared code is reserved for genuine cross-cutting primitives.

### Parallel frontend development

For two-developer Phase 8 work:

1. branch from current `main` using a Jira-keyed English branch name;
2. keep each PR scoped primarily to its Jira feature folder;
3. avoid unrelated edits to `src/app`, `src/shared` and global styling;
4. if shared-foundation changes are required, keep them small and explicit in the Jira/PR scope;
5. rebase/update from `main` before final review when another FE PR has merged first;
6. required CI checks must pass before Squash & Merge.

## Local development

```bash
npm ci
test -e .env.local || cp .env.example .env.local
npm run dev
```

On Windows PowerShell, copy the environment template with:

```powershell
if (-not (Test-Path -LiteralPath .env.local)) { Copy-Item .env.example .env.local }
```

The Vite dev server starts on its normal local port (typically `http://localhost:5173`).

Available checks:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npm run dependency:check
npm run security:audit
```

## Environment variables

Only variables prefixed with `VITE_` are browser-exposed. Keep them client-safe. Never add service-role keys, signing secrets or private provider credentials to frontend environment variables.

See `.env.example` for the approved variable names. Shared API transport reads `VITE_API_BASE_URL`; feature API modules must use the approved backend contract rather than direct protected-database access.

### Standalone backend Auth integration — 2026-10-20

Point `VITE_API_BASE_URL` at the Node API, for example `http://127.0.0.1:3000/api/v1`.
The backend `APP_ORIGIN` must exactly match the Vite browser origin (including localhost versus
127.0.0.1). Existing local environment files are not overwritten by the template update.
The login identifier is the Admin-provisioned account email; passwords are sent unchanged.
The Auth API module validates the success envelope and verifies `GET /session` before showing
authenticated identity. The current authenticated surface confirms identity and supports logout;
it does not implement the planned Student/Guardian/Admin dashboards.

Opaque Bearer tokens exist only in memory. Reloading or closing the tab requires sign-in again;
there is no browser-storage persistence, refresh token, cookie authentication or public signup.
Server expiry clears client identity; returning to a visible tab rechecks current account status.
Logout immediately clears local identity and attempts server revocation; a dependency failure is
reported safely because revocation cannot then be guaranteed. Backend authorization remains
authoritative on every protected request. The shared HTTP transport has a 20-second timeout,
caller cancellation and safe error mapping; it never navigates or displays notifications itself.

Auth integration is under `features/auth/api/` and `features/auth/hooks/useAuthSession.ts`;
application bootstrap owns composition. Unit/DOM tests cover credential denial, safe projection,
expiry, revocation failure, stale responses and the login/session/logout HTTP envelopes.
Coverage now includes Auth API, session lifecycle and shared HTTP transport in addition to App;
it does not represent all planned frontend features. Real browser acceptance uses synthetic
accounts against the local Node API and PostgreSQL, never real family credentials.

Local acceptance on 2026-10-20: 57 tests passed; configured coverage reached 85.15% branches
and 93.33% lines. Typecheck, lint, format, build and dependency checks passed; npm audit
reported zero vulnerabilities after updating the transitive source-map-js patch. Browser
checks passed for login, verified identity, logout, credential denial and reload. Synthetic
fixtures and temporary browser API/Vite servers were removed/stopped afterward. CI installs
from the lockfile with `npm ci`; LF checkout rules make formatting reproducible on Windows.
These are local results; no staging, deployment, PR merge or feature-complete dashboard is claimed.

## Repository workflow

`main` is the latest approved repository state. Runtime work uses short-lived Jira-keyed branches and Pull Requests, normally ending in Squash & Merge.

Example branch:

```text
feature/EFA-<number>-<short-description>
```

Do not commit real credentials. Local configuration belongs in ignored `.env*` files; `.env.example` contains placeholders only.

## Current status

Phase 7 frontend local environment setup is complete. EFA-236 establishes the Phase 8 application foundation so multiple frontend developers can work in separate feature areas against the frozen Phase 5 UI baseline, Phase 6 API/security contracts and EFA-233 architecture rules.
