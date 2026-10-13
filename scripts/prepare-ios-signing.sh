#!/usr/bin/env bash
set -euo pipefail
umask 077
SIGNING_DIR="$RUNNER_TEMP/prego-signing"
mkdir -p "$SIGNING_DIR" "$HOME/Library/MobileDevice/Provisioning Profiles"
export SIGNING_DIR
python3 - <<'PY'
import base64, os
from pathlib import Path
root = Path(os.environ['SIGNING_DIR'])
for key, name in [('IOS_CERTIFICATE_BASE64', 'distribution.p12'), ('IOS_PROFILE_BASE64', 'profile.mobileprovision')]:
    root.joinpath(name).write_bytes(base64.b64decode(os.environ[key], validate=True))
root.joinpath('AuthKey_' + os.environ['ASC_KEY_ID'] + '.p8').write_text(os.environ['ASC_PRIVATE_KEY'])
PY
security create-keychain -p "$IOS_CERTIFICATE_PASSWORD" "$SIGNING_DIR/build.keychain-db"
security set-keychain-settings -lut 21600 "$SIGNING_DIR/build.keychain-db"
security unlock-keychain -p "$IOS_CERTIFICATE_PASSWORD" "$SIGNING_DIR/build.keychain-db"
security import "$SIGNING_DIR/distribution.p12" -P "$IOS_CERTIFICATE_PASSWORD" -A -t cert -f pkcs12 -k "$SIGNING_DIR/build.keychain-db"
security list-keychains -d user -s "$SIGNING_DIR/build.keychain-db" login.keychain-db
security set-key-partition-list -S apple-tool:,apple: -k "$IOS_CERTIFICATE_PASSWORD" "$SIGNING_DIR/build.keychain-db"
security cms -D -i "$SIGNING_DIR/profile.mobileprovision" > "$SIGNING_DIR/profile.plist"
python3 - <<'PY'
import datetime, os, plistlib, shutil
from pathlib import Path
root = Path(os.environ['SIGNING_DIR'])
profile = plistlib.loads(root.joinpath('profile.plist').read_bytes())
team = os.environ['APPLE_TEAM_ID']
expected = team + '.com.prego.app'
if profile.get('TeamIdentifier') != [team] or profile.get('Entitlements', {}).get('application-identifier') != expected:
    raise SystemExit('Profile team or bundle ID does not match com.prego.app. Configure the correct distribution profile.')
if profile.get('ExpirationDate', datetime.datetime.min) <= datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None):
    raise SystemExit('Distribution profile has expired.')
if profile.get('ProvisionedDevices') or profile.get('ProvisionsAllDevices') or profile.get('Entitlements', {}).get('get-task-allow'):
    raise SystemExit('Use an App Store distribution profile, not development, ad hoc or enterprise.')
uuid = profile['UUID']
shutil.copyfile(root.joinpath('profile.mobileprovision'), Path.home() / 'Library/MobileDevice/Provisioning Profiles' / (uuid + '.mobileprovision'))
root.joinpath('profile-uuid').write_text(uuid)
with root.joinpath('ExportOptions.plist').open('wb') as out:
    plistlib.dump({'method': 'app-store-connect', 'teamID': team, 'signingStyle': 'manual',
                  'manageAppVersionAndBuildNumber': False, 'provisioningProfiles': {'com.prego.app': uuid}}, out)
PY
