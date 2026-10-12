#!/usr/bin/env bash
# Run locally by the repository owner. Never runs in CI or prints secret values.
set -euo pipefail
set +x
PREGO_REPO='camster91/prego'
PREGO_PLATFORM="${1:-both}"
case "$PREGO_PLATFORM" in both|ios|android) ;; *) echo 'Usage: scripts/configure-beta-secrets.sh [both|ios|android]'; exit 1 ;; esac
command -v gh >/dev/null || { echo 'Install GitHub CLI first: https://cli.github.com'; exit 1; }
gh auth status >/dev/null 2>&1 || { echo 'Sign in locally with gh auth login using repository access.'; exit 1; }
echo "Configuring internal-testing credentials for $PREGO_REPO. Nothing will be uploaded to Apple or Google."
read_value() {
  local prompt="$1"
  read -r -p "$prompt: " PREGO_VALUE
  [ -n "$PREGO_VALUE" ] || { echo 'A value is required.'; exit 1; }
}
set_variable() {
  read_value "$2"
  gh variable set "$1" --repo "$PREGO_REPO" --body "$PREGO_VALUE"
  unset PREGO_VALUE
}
set_text_secret() {
  read_value "$2"
  printf '%s' "$PREGO_VALUE" | gh secret set "$1" --repo "$PREGO_REPO"
  unset PREGO_VALUE
}
set_password() {
  local secret="$1"
  read -r -s -p "$2: " PREGO_PASSWORD
  printf '\n'
  [ -n "$PREGO_PASSWORD" ] || { echo 'A nonempty password is required.'; exit 1; }
  printf '%s' "$PREGO_PASSWORD" | gh secret set "$secret" --repo "$PREGO_REPO"
  unset PREGO_PASSWORD
}
set_file_secret() {
  local secret="$1" encoding="$3"
  read_value "$2 (absolute file path)"
  [ -f "$PREGO_VALUE" ] || { echo 'File not found.'; exit 1; }
  if [ "$encoding" = 'base64' ]; then
    base64 < "$PREGO_VALUE" | tr -d '\r\n' | gh secret set "$secret" --repo "$PREGO_REPO"
  else
    gh secret set "$secret" --repo "$PREGO_REPO" < "$PREGO_VALUE"
  fi
  unset PREGO_VALUE
}
if [ "$PREGO_PLATFORM" = 'both' ] || [ "$PREGO_PLATFORM" = 'ios' ]; then
  set_variable APPLE_TEAM_ID 'Apple Team ID'
  set_variable APPLE_APP_ID 'App Store Connect numeric app ID'
  set_text_secret ASC_KEY_ID 'App Store Connect API key ID'
  set_text_secret ASC_ISSUER_ID 'App Store Connect API issuer ID'
  set_file_secret ASC_PRIVATE_KEY 'App Store Connect .p8 API key' plain
  set_file_secret IOS_CERTIFICATE_BASE64 'Apple Distribution .p12 certificate and private key' base64
  set_password IOS_CERTIFICATE_PASSWORD 'Distribution .p12 password'
  set_file_secret IOS_PROFILE_BASE64 'App Store .mobileprovision profile for com.prego.app' base64
fi
if [ "$PREGO_PLATFORM" = 'both' ] || [ "$PREGO_PLATFORM" = 'android' ]; then
  set_file_secret ANDROID_KEYSTORE_BASE64 'Existing Google Play upload keystore' base64
  set_password ANDROID_KEYSTORE_PASSWORD 'Upload keystore password'
  set_text_secret ANDROID_KEY_ALIAS 'Upload key alias'
  set_password ANDROID_KEY_PASSWORD 'Upload key password'
  set_file_secret PLAY_SERVICE_ACCOUNT_JSON 'Authorized Google Play service-account JSON' plain
fi
echo 'Secure settings saved. Confirm the registered app IDs and next build number, then run the internal-testing workflow.'
