# Feature ownership

Phase 8 runtime code uses feature-first ownership defined by EFA-233.

Expected feature areas include `auth`, `learner`, `guardian`, `admin`, `curriculum`, `content`, `assessment`, `roadmap`, `learning` and `ai-tutor` as they are implemented by their Jira tickets.

Each feature owns its pages, components, hooks/controller logic, API mapping, schemas, types and tests. Do not deep-import another feature's internals. Move code into `src/shared` only when it is genuinely cross-cutting or a foundational primitive.

For parallel frontend work, a Jira ticket should primarily modify its own feature area. Shared-foundation changes must be explicitly in scope to reduce merge conflicts.
