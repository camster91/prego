# Native validation and release runbook

## Local prerequisites
Node 22+, Java JDK 21 including javac/jlink, Android SDK 36 and AGP-selected build tools (35.0.0 in the current project); macOS with current supported Xcode for iOS. App minimum: iOS 16.4 (Tailwind 4 CSS baseline), Android API 24 with current WebView. Test real compact/large iPhones, Pixel/Samsung, tablet and low-end devices before finalising support.

## Build
Run `npm ci`, `npm run lint`, `npm test`, `npm run native:sync`. Android: `cd android && ./gradlew assembleDebug bundleRelease lintDebug`. iOS: `xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build`.

The native validation workflow builds unsigned Android bundles and an iOS simulator app. Neither is a signed store release. The build-and-push workflow now publishes images only through an explicit manual publish input, so a PR cannot replace the latest container image. Configure required repository checks and protected production environments before any release.

For the requested usability beta and signed upload workflow, follow [INTERNAL-TESTING.md](INTERNAL-TESTING.md). Internal distribution does not enable draft exercise guidance or purchases.

## Signing and store configuration
- Confirm final bundle ID/name, legal owner, licence, regions/languages and minimum OS policy.
- Configure Apple Developer/App Store Connect signing and Google Play app/signing. Never commit private keys, certificates or service-account JSON.
- Create a non-consumable Pregnancy Pass in both stores and RevenueCat entitlement `pregnancy_pass`; use the current offering's lifetime package only. Keep VITE_PURCHASES_ENABLED=false until products and the reviewed library are ready. Public RevenueCat SDK keys are distinct from secret API keys.
- Exercise sandbox purchase, cancellation, pending/approval, offline launch, refund/revocation, reinstall, account changes and restore paths on both platforms. Mock adapter tests do not establish store readiness.
- Verify encrypted storage migration from old webview/preferences, locked-device behaviour, relaunch, corruption, full deletion, file export and repeated restore on physical devices. iOS keychain can outlive uninstall; device-only storage does not migrate automatically to a different device.
- Confirm SDK privacy manifests and App Privacy/Data Safety declarations, Health apps declaration, terms, user-support contact, provider retention/deletion process and approved safety claims.

## Candidate gate
Record exact commit, native version/build numbers, signed artifact checksums, content versions/approvals, device results, store QA results and reviewer go/no-go. Content and screening approval remain required. Internal software QA must not ask anyone to perform unreviewed exercise.

## Recovery
Release gradually. Pause distribution and withdraw affected content when necessary. Preserve user data during hotfixes; verify migration from the previous release before distribution. App stores cannot instantly roll all installed clients back; ship a corrected version and communicate through approved support channels. This implementation has no configured remote content-withdrawal or crash-monitoring service, so those operational capabilities remain release work.
