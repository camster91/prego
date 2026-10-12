import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'
import { Capacitor } from '@capacitor/core';
import { useUserStore, useWorkoutSessionStore } from './stores';
import { recoverDataTransaction } from './lib/storageTransaction';

let recoveryFailed = false;
try {
  await recoverDataTransaction();
  await Promise.all([useUserStore.persist.rehydrate(), useWorkoutSessionStore.persist.rehydrate()]);
} catch { recoveryFailed = true; }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {recoveryFailed ? <main className="mx-auto max-w-md p-6" role="alert">
      <h1 className="mb-4 text-2xl font-semibold">Your saved data needs recovery</h1>
      <p className="mb-6">Prego preserved the saved copy and paused loading. Unlock your device and try again. Keep any exported backup.</p>
      <button className="min-h-12 rounded-xl bg-primary-800 px-5 text-white" onClick={() => window.location.reload()}>Try again</button>
    </main> : <App />}
  </StrictMode>,
)

// Register service worker for PWA offline support
if (import.meta.env.PROD && !Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed — app works fine without it
    });
  });
}
