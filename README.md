# EnglishFam Frontend

Private frontend/PWA repository for the EnglishFam family learning platform.

## Canonical documentation

Product scope, requirements, learning rules, API/security contracts and technical architecture are maintained in the canonical documentation repository:

- [BeoGTSDev/english_fam_docs](https://github.com/BeoGTSDev/english_fam_docs)
- Code workflow: `english_fam_docs/docs/06-development/CODE_REPOSITORY_WORKFLOW_EN.md`
- Agent workflow: `english_fam_docs/AGENTS.md`

This repository must consume those approved contracts rather than redefine them locally.

## Repository workflow

`main` is the latest approved repository state. Runtime work uses short-lived Jira-keyed branches and Pull Requests, normally ending in Squash & Merge.

Example branch:

```text
feature/EFA-<number>-<short-description>
```

Do not commit real credentials. Local configuration belongs in ignored `.env*` files; `.env.example` contains placeholders only.

## Current status

Phase 7 repository foundation only. Application framework/runtime setup belongs to EFA-73 and later implementation tasks.
