# Prego

Pregnancy movement education and personal workout records, built with React, TypeScript and Capacitor for web, iOS and Android.

**Current status: engineering candidate, not approved for public/store release.** Guided workouts are blocked until qualified content and screening review. Native store purchases are disabled by default. No checkbox establishes medical clearance, and a checkout URL cannot grant an entitlement.

## Experience

Today, Move, Learn, Progress and You provide session previews, original Higgsfield artwork and optional decorative motion, trusted-resource links, personal records and data controls. Media is bundled locally; motion has pause and reduced-motion handling. There are 12 draft exercise records and 8 draft workout plans; a professionally reviewed production library remains outstanding.

Native records use iOS keychain/Android encrypted storage. Web records use versioned browser storage with a local recovery copy. Exported JSON backups contain private information. Local mirrors cannot protect against clearing all browser data or losing a device. Full local deletion includes profile, history, active timer and recovery copies; store/provider purchase records are separate.

## Development

Node 22+:

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
npm run test:e2e
```

For the browser suite, first run `npx playwright install chromium`. Production builds generate a versioned offline service worker for all bundled assets. Native apps use bundled web assets without a browser service worker.

## Native builds

```sh
npm run native:sync
npm run native:android
npm run native:ios
```

Android requires JDK 21 and SDK 36. Run `./gradlew assembleDebug bundleRelease lintDebug` from android/. iOS requires macOS/current Xcode. Minimum app OS: iOS 16.4; Android API 24 with current WebView. Unsigned bundles and simulator builds are validation artifacts, not store submissions.

## Billing

The native RevenueCat adapter uses the current offering's lifetime package and named `pregnancy_pass` entitlement. Configure store products and public native SDK keys, then complete real sandbox purchase/restore tests. Leave VITE_PURCHASES_ENABLED=false until release gates pass. Never place secret provider keys in VITE_* variables. The Express server serves the app and a health check; legacy Stripe routes return HTTP 410 and cannot initiate payments or customer portal sessions.

## Internal testing

The requested beta targets are TestFlight internal testing and Google Play's internal track. The manual Native validation workflow can sign/upload to both after configuration and passing checks; PRs never distribute. See [secure setup and tester instructions](docs/INTERNAL-TESTING.md). Guided workouts and purchases remain disabled for this usability beta. No upload is claimed until signed artifacts, store processing and tester installation are verified.

Restore/deletion now use a verified transaction journal before updating in-memory records. Failed replacements roll back; interrupted operations recover before app hydration. Native journals use the same encrypted storage as records. Keep an exported backup for device loss or full browser-storage deletion.

## Project map

src/ contains UI, routes, stores, data and hooks; src/test/ contains Vitest regression tests; e2e/ contains Playwright/axe checks. ios/ and android/ are native projects. assets/ preserves original generated artwork; public/media/ contains optimised runtime media. docs/ holds requirements, evidence and remaining release work.

- [Product requirements](docs/PRODUCT-REQUIREMENTS.md)
- [Capability map](CAPABILITY-MAP.md)
- [Release evidence and blockers](docs/RELEASE-READINESS.md)
- [Native release runbook](docs/NATIVE-RELEASE-RUNBOOK.md)
- [Clinical/content review brief](docs/CONTENT-REVIEW-BRIEF.md)
- [Remaining implementation backlog](docs/IMPLEMENTATION-BACKLOG.md)
- [Custom media provenance](docs/ASSET-PROVENANCE.md)

GitHub shipping epic #41 remains the parent tracker. Preserve existing data issue #18 and CI issue #42. Licensed under MIT; see [LICENSE](LICENSE). The README update and licensing PRs are integrated with the mobile-readiness work.
