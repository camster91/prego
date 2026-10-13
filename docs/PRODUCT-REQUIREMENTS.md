# Prego v1 product requirements

Working name. Implementation authorised by the user's 2026-10-11 instruction to continue toward iOS/Android readiness with custom Higgsfield images and animations. The scope map is in CAPABILITY-MAP.md.

## Objective and boundaries
Pregnancy movement education with Today, Move, Learn, Progress and You. Preserve React/TypeScript/Capacitor. Adults within a qualified reviewer-defined intended population. General education, no diagnostic functions or medical clearance. Free core; one-time paid pregnancy library proposed, price not selected. Postpartum, social feeds, nutrition and AI eligibility are excluded.

Clinical review, store credentials, purchase products and physical-device evidence cannot be fabricated. Unreviewed exercise content must not start a guided workout. Missing/invalid stage or rules fail closed. Due-date passage never infers an outcome. Generated artwork is decorative, not an approved exercise demonstration.

## Commands and structure
`npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm run native:sync`, `npm run dev`. Source in src/, regression tests in src/test/, media in public/media/, native projects in ios/ and android/, evidence in docs/. Named React page exports, strict TypeScript, existing utility-class styling and semantic palette tokens.

## Acceptance
- Stage derives from calendar dates and refreshes on day change/foreground; malformed/out-of-range dates remain explicit.
- Encrypted native persistence, versioned browser persistence and validated export/restore; errors visible, reset clears profile/history/timer/backups and does not erase store purchase ownership.
- Timer pauses on interruption, survives relaunch paused, never consumes time while hidden, calls completion once and handles empty content safely.
- Five destinations; accessible controls, text scaling, focus, reduced motion, safe areas and dark appearance; generated media stored locally with provenance.
- Native iOS project and Android API 36, reproducible web/native CI, no external mobile checkout or unverified premium claims.
- Store transactions must be verified and restored before billing is enabled. No mock entitlement grants.

## Verification and release
Vitest for date boundaries, store/reset/restore, eligibility and timer lifecycle; browser checks for routes, onboarding, navigation and accessible failure states; Android Gradle and iOS Xcode validation of exact candidate; physical-device, store sandbox, offline and clinical evidence required before release. Runtime dependencies, CI and native project changes are authorised by the requested readiness work. Never fabricate approval, ship secrets, publish unreviewed guidance or claim unsigned builds are store ready.
