# Prego v1 — Proposed capability map

Status: working scope; user directed implementation on 2026-10-11. External publication remains controlled.
Prepared: 2026-10-11. Source: user-provided October 2026 product blueprint.

## Product boundaries

Pregnancy fitness education for adults within a professionally reviewed intended population. Retain React, TypeScript and Capacitor. Five destinations: Today, Move, Learn, Progress and You. Free useful core plus a proposed one-time Pregnancy Pass; price remains a hypothesis.

Postpartum programmes, AI advice, social features, meal planning and medical tracking are outside v1. The app does not grant medical clearance. Passing a due date must not infer pregnancy outcome.

## Capabilities

Dependencies refer to provider contracts, not a requirement to finish every provider screen before prototyping consumers.

| Stable module id | Responsibility | Depends on |
| --- | --- | --- |
| clinical-governance | Intended population, screening/referral policy, warning guidance, review ownership and approved rule contracts | — |
| personal-data | Versioned persistence, migration, export, restore, deletion and recovery | — |
| pregnancy-stage | Date-derived gestational stage, date edits and explicit unknown/out-of-range states | clinical-governance |
| approved-content | Exercise/article registry, reviewed modifications, media, approval history and withdrawal/version policy | clinical-governance |
| workout-selection | Deterministic eligibility, filters and substitutions; unknown inputs never imply eligibility | pregnancy-stage, approved-content |
| workout-player | Guided sessions, interruption-safe pause/resume, offline assets and idempotent completion records | personal-data, workout-selection |
| app-experience | Accessible navigation, onboarding, Today, Move, Learn, Progress and You; preferences and opt-in reminders | personal-data, pregnancy-stage, approved-content, workout-player |
| native-billing | iOS/Android integration, verified purchases, restoration and entitlement lifecycle | — |
| release-validation | Reproducible checks/builds, privacy verification, device QA, beta evidence and release operations | app-experience, native-billing |

Build order: establish clinical-governance and personal-data contracts; define pregnancy-stage and approved-content; implement workout-selection; implement workout-player; integrate app-experience; complete release-validation. Native-billing can proceed independently once native platform requirements are established. Restore CI validation early and keep it running throughout this sequence.

Each module specification should define its inputs, outputs, validation, error behaviour, compatibility, owner and evidence required for acceptance. Clinical rules and screening copy require qualified review; developers must not invent them.

## Existing GitHub work to preserve

Repository metadata and issues inspected via GitHub on 2026-10-11; this is not a source-code, clinical or CI audit.

| Thread | Verified status / proposed use |
| --- | --- |
| [#41](https://github.com/camster91/prego/issues/41) | Open parent shipping epic; retain as the backlog anchor. |
| [#18](https://github.com/camster91/prego/issues/18) | Open data recovery issue; expand to cover versioned native/web persistence, complete deletion and restoration. A shadow copy in the same storage is not protection against clearing all storage. |
| [#42](https://github.com/camster91/prego/issues/42) | Open validation issue; refresh its August commit/workflow evidence before claiming current CI failure or missing protection. |
| [#13](https://github.com/camster91/prego/issues/13) | Open dependency-refresh issue; reconcile against the current lockfile and pending upgrade PRs before choosing changes. |
| [#31](https://github.com/camster91/prego/issues/31) / [PR #53](https://github.com/camster91/prego/pull/53) | Licensing decision remains open; an open MIT-license PR already exists. Do not duplicate or infer a licensing decision. |
| [PR #61](https://github.com/camster91/prego/pull/61) | Open README update; coordinate future documentation with it. |

Default branch is master. Its package.json declares React 19, TypeScript 5.9, Capacitor 8, Zustand 5 and Vitest 4; includes Android and Stripe dependencies. This does not establish installed versions or native/billing correctness. Available scripts include npm run lint, npm test and npm run build.

## Proposed backlog priorities

1. Establish intended-use boundaries, reviewer ownership, evidence registry and content approval process.
2. Refresh #42 against the actual master head and restore reproducible mandatory validation.
3. Expand #18 with concrete export/restore/deletion/migration acceptance cases; document limits of device-local recovery.
4. Specify pregnancy-stage behaviour and boundary/date regression cases; do not hard-code clinical policy without review.
5. Specify deterministic eligibility and interruption-safe workout state.
6. Define accessible user flows and approved-content production requirements.
7. Add native iOS and verify Android/store billing, offline entitlements and restore behaviour.
8. Complete device/privacy/accessibility QA, beta instrumentation and controlled release evidence.

Before publishing child issues, reconcile each against existing issues and PRs. Each issue needs scope, dependencies, acceptance criteria, verification, affected platforms and evidence to close. Targets in the blueprint are proposed targets, not completed work or verified market/regulatory facts.

## Scope decisions for the PRD

- Confirm whether the next deliverable is requirements/backlog, blueprint review or implementation.
- Confirm launch regions/languages and supported device/OS baseline.
- Assign product, clinical review, content and support owners.
- Define the free library and paid-content boundary, including offline entitlement behaviour.
- Select measured startup/workout-start budgets and the exact beta metric denominators.
- Revalidate store, naming, regulatory and permissions claims against authoritative sources before release.

Implementation is underway under the user’s instruction. See docs/PRODUCT-REQUIREMENTS.md and docs/RELEASE-READINESS.md for current scope and evidence. This map indexes module responsibilities.
