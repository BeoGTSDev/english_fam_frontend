# Pull Request

## Jira / Traceability

- [ ] PR title starts with `[EFA-xxx]`.
- [ ] Branch and commits reference the same Jira issue.
- [ ] Scope matches the Jira task and does not add unrelated product behavior.

## Required CI merge gate

- [ ] The latest **Frontend Quality** workflow for the current PR head is completed with `success`.
- [ ] Format, lint, typecheck, test coverage, build, dependency and security steps all passed.
- [ ] If an earlier CI run failed, the cause was fixed on this same branch and the latest rerun passed.
- [ ] Product Owner validation is recorded before merge.

> Do not merge while any required CI gate above is unchecked. On the current private-repository plan this is an operational project rule; do not treat the absence of GitHub hard branch protection as approval to bypass CI.
