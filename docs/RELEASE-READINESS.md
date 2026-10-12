# Prego release evidence — October 12, 2026

**Status: engineering candidate; blocked for public/store release. No 100/100 claim.**

## Verified locally

| Check | Evidence |
| --- | --- |
| Web lint and strict TypeScript/build | npm run lint and npm run build passed |
| Regression tests | 80 tests across 8 files passed; date boundaries, storage/reset/backup, fail-closed content, timer lifecycle/StrictMode and purchase adapter |
| Browser flows | 18 Playwright scenarios passed across 320px, 390px and 768px; onboarding/profile reload/deletion, five destinations, offline deep links, forged purchase URL, blocked unreviewed session |
| Browser accessibility | Automated axe WCAG checks passed on primary destinations and populated You screen, including Today dark mode; no horizontal overflow at tested widths |
| Android packaging | JDK 21 / SDK 36 Gradle assembleDebug, bundleRelease and lintDebug passed; debug APK and unsigned AAB produced; artifact hashes in native-artifact-checksums.json |
| Native project sync | Capacitor sync passed for both Android and iOS; iOS SPM contains all six native plugins |
| Production dependency audit | npm audit --omit=dev reports zero vulnerabilities after compatible patches |
| Custom media | Higgsfield studio photograph, five-second decorative video, app icon; local assets, provenance and checksums recorded |

Android lint succeeds with nonfatal warnings, primarily launcher/resource lint plus dependency/update and backup-policy recommendations. Treat signed-device/store review as outstanding. Capacitor CLI's transitive uuid advisory remains moderate in development tooling; no forced downgrade was performed.

## Remote native evidence

Both jobs passed in [Native validation run 38144840912](https://github.com/camster91/prego/actions/runs/38144840912): Android debug APK, unsigned release AAB and lint; unsigned iOS simulator compilation on macOS with all native plugins. The Android SDK action's obsolete default `tools` package was replaced with explicit supported packages.

[Web validation run 38144868347](https://github.com/camster91/prego/actions/runs/38144868347) passed lint, TypeScript, all 68 regression tests, production build and all 15 browser/accessibility scenarios. The existing build-only workflow was manually disabled in the repository; it has been re-enabled. Both passing runs validated source commit `4b155bc145d9eda87c327b0c81aba880987e8868`; subsequent documentation updates do not alter the app binaries.

## Internal testing preparation — October 12

The owner requested TestFlight and Google Play internal testing. The manual Native validation workflow now checks signing configuration before building, verifies web/native checks, and calls a signed IPA/AAB upload workflow only when explicitly dispatched with `publish_internal=true`. Normal PR checks cannot distribute. See [INTERNAL-TESTING.md](INTERNAL-TESTING.md) for exact secure settings and tester instructions; [BETA-EVIDENCE.json](BETA-EVIDENCE.json) records store processing/install results without inventing them.

Guided workouts and purchases remain disabled: this is a usability beta, not an exercise programme. Restore/deletion now use a verified encrypted-native/web transaction journal; partial failures roll back and interrupted operations recover before hydration. Regression tests inject failed writes, locked storage, interrupted transactions and invalid recovery records. Eight Node tests cover configuration/privacy and the removed legacy payment routes; three offline Python contract tests verify internal-only Play uploads and failure cleanup. Signed uploads and real native recovery remain unverified pending account configuration. The authorized both-platform upload attempt [38278671034](https://github.com/camster91/prego/actions/runs/38278671034) failed at the configuration check: all Apple signing/API variables and Google keystore/service-account secrets were absent; build/upload jobs were skipped and no store release was made.

## Release-blocking evidence still missing

- Qualified professional content approvals, approved screening/eligibility/referral policy and region-specific warning guidance. Current content and screening gate deliberately disables all guided workouts, including deep links. Do not ask beta users to perform drafts.
- Complete reviewed library/articles/demonstrations. The repository remains a 12-movement/8-plan draft inventory; targets in the blueprint are production work.
- Signed iOS archive and TestFlight build. Unsigned simulator compilation has passed; signing and distribution have not been verified.
- Real Apple/Google product configuration and store sandbox purchase/restore/refund/pending/reinstall/offline tests. Purchase adapter unit tests are not receipt/store QA. Purchases remain disabled by default.
- Physical iOS/Android device tests, VoiceOver/TalkBack, large text, native share/export, encrypted-vault migration/locked-device/reinstall/corruption and partial-restore failure recovery. Browser tests do not replace them.
- Accurate reviewed privacy/terms/store declarations; provider retention/deletion and support ownership; naming/trademark/licence clearance; signed release provenance, branch protections and protected publishing.
- Approved-content withdrawal, privacy-minimised crash monitoring, rollout/hotfix rehearsal and actual beta usefulness/retention/pricing evidence.

## 100-point scorecard

| Domain | Available points | Current assessment |
| --- | --- | --- |
| Clinical safety and approved rules | 25 | Blocked: approval and clinical rule contracts absent |
| Exercise and educational content | 20 | Blocked: reviewed production library absent |
| UX/accessibility | 20 | Partial automated/browser evidence; native assistive-technology/device evidence absent |
| Reliability/performance/testing | 15 | Automated/browser, local Android and remote iOS simulator build evidence; native interruption and device budgets outstanding |
| Privacy/security | 10 | Encrypted native storage and clean production dependency audit; provider/device/legal assessment outstanding |
| Store/billing readiness | 5 | Adapter/native scaffolding complete; real sandbox/signing/submission evidence absent |
| Validated demand | 5 | No beta evidence collected |

Scores are not awarded while required evidence is missing. A passing build is not approval to distribute health guidance or accept payment. See IMPLEMENTATION-BACKLOG.md and NATIVE-RELEASE-RUNBOOK.md for the work needed to close each gate.
