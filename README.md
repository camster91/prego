# Prego — Pregnancy Exercise App

**A modern, mobile-friendly application delivering pregnancy-safe exercises, guided workout plans, real-time timers, and progress tracking.**

As part of our **2026 App Portfolio Launch**, Prego is being finalized for Android and iOS app store submission via Capacitor. This standalone wellness app is designed to provide high-quality, accessible fitness guidance to expecting mothers.

## 📱 Features

- **Personalized Onboarding:** Automatic trimester tracking based on due date.
- **Curated Exercise Library:** 12+ pregnancy-safe exercises filterable by trimester, category, and intensity.
- **Guided Workout Plans:** 8 pre-built programs (5-15 mins) specifically tailored by trimester.
- **Active Workout Timer:** Real-time countdowns, audio cues, and an intuitive exercise queue.
- **Progress Tracking:** Weekly activity charts, streak tracking, and achievement badges.
- **Offline Capable:** State is persisted locally for on-the-go workouts.

## 🛠 Tech Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Lucide Icons
- **State Management:** Zustand (persisted)
- **Routing:** React Router v6
- **Mobile Build:** Capacitor (for native iOS/Android packaging)
- **Bundler:** Vite

## 🚀 Store Submission Prep (Action Items)

To prepare for the upcoming Google Play and Apple App Store launch:
- [ ] Generate release keystore for Android signing.
- [ ] Generate production App Icons and Splash Screens via `capacitor-assets`.
- [ ] Create the Apple Developer provisioning profiles.
- [ ] Finalize store listing metadata (Screenshots, Privacy Policy URL, App Description).
- [ ] Implement optional GlowOS analytics telemetry (if applicable).

## ⚡ Getting Started (Local Dev)

```bash
# Clone the repository
git clone https://github.com/camster91/prego.git
cd prego

# Install dependencies
npm install

# Start the Vite dev server
npm run dev

# For native mobile preview:
npx cap sync
npx cap open android
```

---
*Developed by Cameron Ashley / Nexus AI.*
