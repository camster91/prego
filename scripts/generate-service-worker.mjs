import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const walk = async (path) =>
  (
    await Promise.all(
      (await readdir(path, { withFileTypes: true })).map(async (entry) =>
        entry.isDirectory()
          ? walk(`${path}/${entry.name}`)
          : `${path}/${entry.name}`,
      ),
    )
  ).flat();
const files = (await walk("dist")).filter(
  (file) => !file.endsWith("/sw.js") && !file.endsWith(".map"),
);
const digest = createHash("sha256");
for (const file of files.sort())
  digest.update(file).update(await readFile(file));
const assets = files.map((file) => "/" + file.replace(/^dist\//, ""));
await writeFile(
  "dist/sw.js",
  `const CACHE = 'prego-${digest.digest("hex").slice(0, 16)}';
const ASSETS = ${JSON.stringify(assets)};
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
// Keep updates waiting until all old app windows close. Never swap a workout's
// content/assets underneath a running session.
self.addEventListener('activate', event => event.waitUntil((async () => { const keys = await caches.keys(); await Promise.all(keys.filter(key => key.startsWith('prego-') && key !== CACHE).map(key => caches.delete(key))); await self.clients.claim(); })()));
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (request.mode === 'navigate') {
      try { const response = await fetch(request); if (response.ok) return response; } catch {}
      return (await cache.match('/index.html')) ?? new Response('Prego is unavailable offline. Connect once to download the app.', { status: 503 });
    }
    // Bundled assets are public, immutable and independent of request Origin.
    const cached = await cache.match(request, { ignoreVary: true });
    return cached ?? fetch(request);
  })());
});
`,
);
