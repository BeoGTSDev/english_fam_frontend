# Feature ownership

Phase 8 runtime code uses feature-first ownership defined by EFA-233.

Expected feature areas include `auth`, `learner`, `guardian`, `admin`, `curriculum`, `content`, `assessment`, `roadmap`, `learning` and `ai-tutor` as they are implemented by their Jira tickets.

Each feature owns its pages, components, hooks/controller logic, API mapping, schemas, types and tests. Do not deep-import another feature's internals. Move code into `src/shared` only when it is genuinely cross-cutting or a foundational primitive.

Implemented ownership: `auth` owns memory-only identity/session lifecycle and an authorized
request closure. `assessment` owns Student objective Placement and Admin review pages,
controllers, validated API projections and tests. Application bootstrap composes them;
Assessment cannot import Auth internals or access protected storage directly.

For parallel frontend work, a Jira ticket should primarily modify its own feature area. Shared-foundation changes must be explicitly in scope to reduce merge conflicts.
