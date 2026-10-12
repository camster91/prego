const platform = process.argv[2];
const common = ['PREGO_VERSION_NAME', 'PREGO_BUILD_NUMBER'];
const required = platform === 'ios'
  ? [...common, 'APPLE_TEAM_ID', 'APPLE_APP_ID', 'ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_PRIVATE_KEY', 'IOS_CERTIFICATE_BASE64', 'IOS_CERTIFICATE_PASSWORD', 'IOS_PROFILE_BASE64']
  : platform === 'android'
    ? [...common, 'ANDROID_KEYSTORE_BASE64', 'PREGO_KEYSTORE_PASSWORD', 'PREGO_KEY_ALIAS', 'PREGO_KEY_PASSWORD', 'PLAY_SERVICE_ACCOUNT_JSON']
    : [];
if (!required.length) throw new Error('Expected ios or android');
const missing = required.filter(key => !process.env[key]?.trim());
if (missing.length) {
  console.error(`Configure these GitHub Actions settings before uploading: ${missing.join(', ')}`);
  process.exit(1);
}
if (!/^\d+\.\d+\.\d+$/.test(process.env.PREGO_VERSION_NAME)) throw new Error('Version must be major.minor.patch');
const build = Number(process.env.PREGO_BUILD_NUMBER);
if (!Number.isInteger(build) || build < 1 || build > 2100000000) throw new Error('Build number must be 1–2100000000 and greater than the previous store build');
if (platform === 'ios') {
  if (!/^[A-Z0-9]{10}$/.test(process.env.APPLE_TEAM_ID)) throw new Error('Apple Team ID must have 10 uppercase letters/digits');
  if (!/^\d+$/.test(process.env.APPLE_APP_ID)) throw new Error('App Store Connect app ID must be numeric');
} else {
  let account;
  try { account = JSON.parse(process.env.PLAY_SERVICE_ACCOUNT_JSON); }
  catch { throw new Error('Invalid Play service account JSON'); }
  if (account.type !== 'service_account' || !account.client_email || !account.private_key) throw new Error('Invalid Play service account configuration');
}
console.log(`${platform} signing settings are present. No credential values were logged.`);
