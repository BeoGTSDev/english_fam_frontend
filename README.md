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
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, copy the environment template with:

```powershell
Copy-Item .env.example .env.local
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

## Repository workflow

`main` is the latest approved repository state. Runtime work uses short-lived Jira-keyed branches and Pull Requests, normally ending in Squash & Merge.

Example branch:

```text
feature/EFA-<number>-<short-description>
```

Do not commit real credentials. Local configuration belongs in ignored `.env*` files; `.env.example` contains placeholders only.

## Current status

Phase 7 frontend local environment setup is complete. EFA-236 establishes the Phase 8 application foundation so multiple frontend developers can work in separate feature areas against the frozen Phase 5 UI baseline, Phase 6 API/security contracts and EFA-233 architecture rules.
