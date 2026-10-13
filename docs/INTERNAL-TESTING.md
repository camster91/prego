# Prego — TestFlight and Google Play internal testing

The requested distribution targets are **TestFlight internal testing** and **Google Play internal testing**. This is a usability beta: professionally unreviewed guided workouts and purchases stay disabled. Uploading a build is separate from store processing and granting tester access; do not report an installation-ready beta until both are confirmed.

## Current configuration

- Bundle ID / Play package: `com.prego.app`. Confirm it matches the owner's registered apps before distribution. An existing different package needs a reviewed project change.
- Initial marketing version: `1.0.0`. Choose a build number greater than all previous Apple/Google uploads; the workflow default `2` is only suitable when no higher build exists.
- Native compilation and automated tests are available. Signed-store uploads have not yet been verified.
- No signing credentials were found in this execution environment. The current GitHub integration returns HTTP 403 when listing repository secrets; the owner must configure or confirm them securely.

## Reuse the existing publisher accounts

A successful signed TestFlight upload was found in `camster91/jw-habits`, run [38138579701](https://github.com/camster91/jw-habits/actions/runs/38138579701), with Apple Team ID `NVJ5UY3T2X`. Prego now defaults to that team and accepts the same credential names. A different team can be supplied with `APPLE_TEAM_ID`; the signing script checks that the profile matches the chosen team and Prego bundle exactly.

These existing account-level files may be reused: the Apple Distribution certificate/private key and password, App Store Connect API key/issuer/key ID, and the Google Play service account (after granting it access to Prego). The Android upload keystore can be reused only if it matches the key registered for this Play app. **The existing JW provisioning profile cannot sign Prego**: create/select an App Store profile for `com.prego.app`.

GitHub environment secrets in `jw-habits` are scoped to that repository/environment. They do not automatically become available to Prego, and GitHub's API does not return their private values. Add the original local signing files to Prego securely; do not extract them through workflow logs or artifacts. No changes were made to the other app's release pipeline.

Supported existing secret names (legacy Prego names below also work):

| Existing name | Prego setting |
| --- | --- |
| `ASC_API_PRIVATE_KEY` | API `.p8` key |
| `IOS_DISTRIBUTION_P12_BASE64` | Distribution certificate/private key |
| `IOS_DISTRIBUTION_P12_PASSWORD` | Certificate password |
| `IOS_APP_STORE_PROFILE_BASE64` | **Prego-specific** distribution profile |
| `ANDROID_UPLOAD_KEYSTORE_BASE64` | Prego's registered upload keystore |

## Secure GitHub setup

Open [repository Actions secrets and variables](https://github.com/camster91/prego/settings/secrets/actions). Never paste private keys, certificate passwords or service-account JSON into chat, issues, logs or tracked files.

Repository **variables**:

| Name | Value |
| --- | --- |
| `APPLE_TEAM_ID` | Optional override of the existing team `NVJ5UY3T2X` |
| `APPLE_APP_ID` | Optional numeric App Store Connect app ID for evidence; upload resolves the signed bundle ID |

Repository **secrets**:

| Name | Required for | Meaning |
| --- | --- | --- |
| `ASC_KEY_ID` | iOS | App Store Connect API key ID |
| `ASC_ISSUER_ID` | iOS | API issuer ID |
| `ASC_PRIVATE_KEY` | iOS | Complete `.p8` API key, including PEM markers/newlines; access sufficient to upload builds |
| `IOS_CERTIFICATE_BASE64` | iOS | Base64 of Apple Distribution `.p12`, including its private key |
| `IOS_CERTIFICATE_PASSWORD` | iOS | Password used to export that `.p12` |
| `IOS_PROFILE_BASE64` | iOS | Base64 of current App Store distribution `.mobileprovision` for the same team and exact bundle ID |
| `ANDROID_KEYSTORE_BASE64` | Android | Base64 of the existing app's upload keystore; do not generate a replacement key for an existing Play app |
| `ANDROID_KEYSTORE_PASSWORD` | Android | Keystore password |
| `ANDROID_KEY_ALIAS` | Android | Upload key alias |
| `ANDROID_KEY_PASSWORD` | Android | Upload key password |
| `PLAY_SERVICE_ACCOUNT_JSON` | Android | Service account JSON authorized in Play Console to release to testing tracks; Android Publisher API enabled |

If you already have the signing files, run `scripts/configure-beta-secrets.sh both` locally after `gh auth login`. The helper prompts for file paths and hides passwords, saves them directly through GitHub CLI, and does not trigger an upload. It requires a local GitHub account/token allowed to manage repository Actions secrets.

Use a local base64 tool that does not print credentials into a recorded session, or a local script piping directly to `gh secret set NAME`. Credentials are decoded only into temporary CI files, private permissions are set, and files/keychains are removed in cleanup steps.

## Account prerequisites

Apple: register the bundle ID; create the App Store Connect app; accept required agreements; create distribution signing material and an API key; add the intended App Store Connect users to an internal TestFlight group. Internal testers need appropriate App Store Connect access; broader testers usually require **external** TestFlight and Beta App Review. This workflow uploads only—it does not invite anyone or grant account access. Confirm privacy/export compliance, beta description and feedback email in App Store Connect before making the build available.

Google: create/register the matching app; configure Play App Signing and its upload key; complete console-required app/health/privacy declarations; authorize the service account; create the internal testing email list or Google Group. A new app may require a first manual bundle upload and console setup before API releases are accepted. This workflow never writes the production track. Internal testing does not automatically satisfy any account-specific closed-testing requirement for later production access.

## Dispatch the exact beta

Use the existing [Native validation workflow](https://github.com/camster91/prego/actions/workflows/native-validation.yml) on branch `feat/mobile-readiness`:

- `publish_internal`: `true`
- `platform`: `both`
- `version`: `1.0.0` (or the registered next version)
- `build_number`: a new number greater than previous store builds

CLI equivalent, once the settings and identifiers above are confirmed:

```bash
gh workflow run native-validation.yml --ref feat/mobile-readiness \
  -f publish_internal=true -f platform=both -f version=1.0.0 -f build_number=2
```

The workflow first checks the configured signing settings, then runs web regression/browser tests and unsigned Android/iOS builds. Only then does it call the internal-distribution workflow to check credentials, archive/export/upload an IPA and sign/upload an AAB. Normal PR/push validation never uploads. Public purchases are forced off. The Android release is explicitly `internal`, with no production promotion. Each signed artifact has a SHA-256 checksum and 14-day GitHub artifact retention.

## Confirm tester availability

Apple: wait for processing, resolve export-compliance prompts, verify the exact version/build, and assign it to the intended internal group. Google: confirm the internal-track release processed, confirm the tester list, copy the actual opt-in link, and verify installation with an authorized tester account. Do not send invitations or tester emails through tools without explicit recipient authorization.

Record both store URLs, build numbers, commit, signed hashes, processing results and first successful installs in the beta evidence file. A successful upload log alone does not prove tester access.

## Beta description / what to test

**Prego usability beta.** Explore Today, Move, Learn, Progress and You; assess readability, navigation, artwork and optional animation. Test fictional profile entry, due-date edits, offline launch, export/restore and full deletion. Guided exercise and purchasing are unavailable while professional content review and store billing QA are pending. This build does not provide medical clearance or exercise prescriptions.

Use a fictional name/due date for software testing. Do not ask testers to perform the draft movements. Ask testers to avoid including pregnancy details or health conditions in screenshots or feedback.

Feedback prompts:

1. Could you find a short session and understand its availability status?
2. Was any text hard to read or control hard to tap?
3. Did offline launch, background/resume or relaunch behave as expected?
4. Could you export, restore and delete your fictional records?
5. What confused you or prevented completion? Include platform/build and steps; omit private health details.

Device acceptance: compact/large iPhone, iPad, Pixel/Samsung and Android tablet; screen-reader navigation, large text, reduced motion, landscape, airplane mode, locked device and repeated relaunch. Exercise playback is expected to remain blocked.

## References

- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
- [TestFlight](https://developer.apple.com/testflight/)
- [Android Publisher bundles upload](https://developers.google.com/android-publisher/api-ref/rest/v3/edits.bundles/upload)
- [Android Publisher testing-track update](https://developers.google.com/android-publisher/api-ref/rest/v3/edits.tracks/update)
- [Play internal testing](https://support.google.com/googleplay/android-developer/answer/9845334)
