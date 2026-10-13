import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const base = { PATH: process.env.PATH, PREGO_VERSION_NAME: '1.0.0', PREGO_BUILD_NUMBER: '2' };
const ios = { ...base, APPLE_TEAM_ID: 'ABCDEFGHIJ', APPLE_APP_ID: '123456', ASC_KEY_ID: 'TESTKEY', ASC_ISSUER_ID: 'fixture', ASC_PRIVATE_KEY: 'PRIVATE-FIXTURE-NOT-A-REAL-KEY', IOS_CERTIFICATE_BASE64: 'fixture', IOS_CERTIFICATE_PASSWORD: 'fixture', IOS_PROFILE_BASE64: 'fixture' };
const run = (platform, env) => spawnSync(process.execPath, ['scripts/check-beta-config.mjs', platform], { env, encoding: 'utf8' });
test('missing credentials fail before signing or upload and report setting names', () => {
  const result = run('ios', base);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /APPLE_TEAM_ID/);
  assert.match(result.stderr, /IOS_PROFILE_BASE64/);
});
test('presence checks do not echo credential contents', () => {
  const result = run('ios', ios);
  assert.equal(result.status, 0);
  assert.doesNotMatch(result.stdout + result.stderr, /PRIVATE-FIXTURE/);
});
test('rejects invalid version, build number and team identifiers', () => {
  for (const change of [{ PREGO_BUILD_NUMBER: '0' }, { PREGO_BUILD_NUMBER: '2100000001' }, { PREGO_VERSION_NAME: '1.0; echo bad' }, { APPLE_TEAM_ID: 'wrong' }]) {
    assert.notEqual(run('ios', { ...ios, ...change }).status, 0);
  }
});
test('malformed service account cannot expose JSON or private-key fragments', () => {
  const result = run('android', { ...base, ANDROID_KEYSTORE_BASE64: 'fixture', PREGO_KEYSTORE_PASSWORD: 'fixture', PREGO_KEY_ALIAS: 'fixture', PREGO_KEY_PASSWORD: 'fixture', PLAY_SERVICE_ACCOUNT_JSON: '{PRIVATE-FRAGMENT' });
  assert.notEqual(result.status, 0);
  assert.doesNotMatch(result.stderr, /PRIVATE-FRAGMENT/);
});

test('numeric App Store ID is optional because upload resolves the signed bundle identifier', () => {
  const { APPLE_APP_ID, ...withoutAppId } = ios;
  assert.equal(APPLE_APP_ID, '123456');
  assert.equal(run('ios', withoutAppId).status, 0);
});
