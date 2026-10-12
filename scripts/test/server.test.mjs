import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import app from '../../server/app.js';
let server;
let url;
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  url = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));
test('health check is minimal, does not cache or expose server technology', async () => {
  const response = await fetch(`${url}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-powered-by'), null);
});
test('old payment and customer portal routes never charge or disclose customer access', async () => {
  for (const path of ['create-checkout-session', 'create-portal-session', 'webhooks/stripe']) {
    const response = await fetch(`${url}/api/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"customerId":"cus_other_account"}' });
    assert.equal(response.status, 410);
    assert.deepEqual(await response.json(), { error: 'Legacy web billing is unavailable.' });
  }
});
test('security policy forbids third-party framing and script execution', async () => {
  const response = await fetch(`${url}/api/health`);
  assert.match(response.headers.get('content-security-policy'), /script-src 'self'/);
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
});
test('unknown API paths return JSON 404 instead of the app shell', async () => {
  const response = await fetch(`${url}/api/unknown`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Not found' });
});
