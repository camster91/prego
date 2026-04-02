import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'

// Analytics Placeholder
// Drop in your VITE_POSTHOG_KEY in your .env file to enable analytics
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
if (POSTHOG_KEY) {
  // 1. npm install posthog-js
  // 2. import posthog from 'posthog-js'
  // 3. posthog.init(POSTHOG_KEY, { api_host: 'https://app.posthog.com' })
  console.log('Analytics initialized (placeholder)');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for PWA offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed — app works fine without it
    });
  });
}
