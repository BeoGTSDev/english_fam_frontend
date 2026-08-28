# EnglishFam Frontend

Private frontend/PWA repository for the EnglishFam family learning platform.

## Canonical documentation

Product scope, requirements, learning rules, API/security contracts and technical architecture are maintained in the canonical documentation repository:

- [BeoGTSDev/english_fam_docs](https://github.com/BeoGTSDev/english_fam_docs)
- Code workflow: `english_fam_docs/docs/06-development/CODE_REPOSITORY_WORKFLOW_EN.md`
- Agent workflow: `english_fam_docs/AGENTS.md`
- Development environment: `english_fam_docs/docs/06-development/DEVELOPMENT_ENVIRONMENT_EN.md`

This repository consumes those approved contracts rather than redefining them locally.

## Toolchain

- Node.js 24 LTS
- npm
- React + TypeScript
- Vite
- Tailwind CSS

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
npm run typecheck
npm run lint
npm run build
```

## Environment variables

Only variables prefixed with `VITE_` are browser-exposed. Keep them client-safe. Never add service-role keys, signing secrets or private provider credentials to frontend environment variables.

See `.env.example` for the approved variable names.

## Repository workflow

`main` is the latest approved repository state. Runtime work uses short-lived Jira-keyed branches and Pull Requests, normally ending in Squash & Merge.

Example branch:

```text
feature/EFA-<number>-<short-description>
```

Do not commit real credentials. Local configuration belongs in ignored `.env*` files; `.env.example` contains placeholders only.

## Current status

Phase 7 frontend local environment scaffold is established by EFA-176. The current screen is an environment smoke surface only; product UI behavior remains subject to approved Phase 5 design artifacts and later implementation Jira issues.
