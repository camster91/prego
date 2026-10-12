import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const app = express();
const root = dirname(fileURLToPath(import.meta.url));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
  if (process.env.NODE_ENV === 'production') res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
// Legacy web billing cannot accept money or grant access. Mobile billing uses
// the configured native stores, never an unauthenticated customer portal.
for (const path of ['/api/create-checkout-session', '/api/create-portal-session', '/api/webhooks/stripe']) {
  app.post(path, (req, res) => res.status(410).json({ error: 'Legacy web billing is unavailable.' }));
}
app.get('/api/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ status: 'ok' });
});
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
app.use(express.static(join(root, '../dist'), {
  setHeaders(res, path) {
    res.setHeader('Cache-Control', path.includes('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache');
  },
}));
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(join(root, '../dist/index.html'));
});
export default app;
