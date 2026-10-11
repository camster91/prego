# Prego implementation backlog — remaining release work

Prepared for parent epic #41. Draft scopes; not new GitHub issues. Preserve #18, #42, #13 and #31 rather than duplicating them. Priorities describe release blockers, not a promise of clinical approval.

| Priority | Scope / existing thread | Dependencies | Acceptance / evidence |
| --- | --- | --- | --- |
| P0 | Clinical governance and approved screening | Named qualified reviewers | Written intended population, contraindication/referral decision table, unknown-state handling and region-reviewed stop/urgent guidance; signed/date-stamped approval. Developers must not invent policy. |
| P0 | Approved library production | Governance | Target 30–40 movements, 24–36 curated sessions, 15–20 articles; every record has reviewer, sources, version, applicable stages and demonstration rights; all runtime rules covered by regression cases. |
| P0 | iOS native candidate | Current implementation, macOS/Xcode | Simulator CI passes; signed TestFlight candidate; storage, focus/text scaling, timer interruption and offline checks on compact/large iPhones and iPad; exact artifact/version evidence. |
| P0 | Store purchases and entitlement integration | Store/RevenueCat accounts, approved content | Non-consumable product/entitlement mapping; purchase/cancel/pending/refund/restore/reinstall/account-change cases pass on iOS and Android; no web redirect or fictitious premium grant. |
| P0 | Data migration/recovery/deletion — #18 | Current storage/data controls | Upgrade from production webview storage verified; native encrypted vault/lock/uninstall states verified; export/restore parity including notes; corruption/quota/failure handling; deletion includes all local mirrors, timers and temporary exports. Measure restore transaction recovery under partial write failure. |
| P0 | Required validation and release policy — #42 | New web/native workflows | Required checks configured in GitHub; real PR execution passes; master protection blocks unchecked merges/direct release pushes; signed publishing isolated and human approved. Refresh old issue evidence. |
| P1 | Accessibility/device QA | All primary flows | VoiceOver/TalkBack, large text, reduced motion, keyboard/modal focus, targets, landscape, safe areas, physical low-end devices and tablets; capture defects and exact build results. Browser axe success is only partial evidence. |
| P1 | Privacy, support and operations | Billing and data inventory | Legal/policy review; accurate provider disclosures and retention/deletion; owned support channel; crash/health monitoring without pregnancy payloads; remote reviewed-content withdrawal and hotfix runbook rehearsal. |
| P1 | Naming/legal — #31 and PR #53 | Owner/legal review | Distinct name checked in both stores, domains/handles and relevant trademarks; licence decision reviewed, no inferred endorsement. |
| P1 | Beta/retention/pricing | Approved content and usable signed builds | Consent and questionnaire; defined denominators for first workout/14-day/4-week metrics; real pricing interest/payment evidence; documented go/no-go. Do not count unreviewed exercise participation. |

Each child issue should contain scope, dependencies, acceptance cases, platforms/devices, evidence/reviewer ownership and rollback; link the specific PRD capability. Development-only moderate CLI dependency advisories remain to triage in #13; do not force a framework downgrade without testing.
