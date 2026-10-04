# Prego

A mobile-first pregnancy exercise app with trimester-aware workouts, guided timers and progress tracking.

## What it does

Prego helps expectant parents follow short, gentle workouts suited to their stage of pregnancy. After a quick onboarding step that asks for the due date, the app works out the current week and trimester and filters the exercise library and workout plans to match. Workouts run with a full-screen timer, rest intervals and audio cues, and completed sessions feed a progress page with charts, a streak and achievement badges.

It is a React single-page app that also installs as a PWA, with a Capacitor Android project and a small Express server for Stripe subscription checkout.

Prego is a fitness companion, not medical advice. Users should follow their care provider's guidance.

## Features

- **Onboarding** that calculates pregnancy week and trimester from the due date
- **Exercise library** (12 exercises) with filters for trimester, category (strength, stretch, cardio, breathing) and intensity, plus step-by-step instructions, contraindications and modifications on each detail page
- **Workout plans** (8 pre-built routines) tailored to each trimester
- **Active workout player** with countdown timer, exercise queue, rest phases and Web Audio cues (sound can be turned off)
- **Progress page** with weekly activity charts (Recharts), current streak and achievement badges
- **Settings** for profile and preferences, plus privacy policy and terms pages
- **Pricing and checkout** pages backed by Stripe Checkout and the Stripe customer portal
- **Installable PWA** with a service worker (network-first navigation, cache-first static assets)
- **Local persistence**: profile and workout history are stored on the device with Zustand

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript (strict), React Router 7 with lazy-loaded pages |
| Build | Vite 7 |
| Styling | Tailwind CSS 4, class-variance-authority, lucide-react icons |
| State | Zustand 5 (persisted), TanStack Query 5 |
| Charts | Recharts |
| Dates | date-fns |
| Mobile | Capacitor 8 (Android) |
| Server | Express 4, Stripe SDK |
| Testing | Vitest, Testing Library, jsdom |
| Container | Dockerfile |

## Getting started

```bash
git clone https://github.com/camster91/prego.git
cd prego
npm install
npm run dev          # http://localhost:5173
```

The front end runs without any configuration. For the payment endpoints, copy `.env.example` to `.env` and add your own Stripe test keys, then build and start the server:

```bash
npm run build
npm start            # Express serves dist/ and the API on port 3000
```

Without Stripe keys the server still starts and the payment endpoints return 503.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm start` | Start the Express server |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm test` | Run tests once (Vitest) |
| `npm run test:watch` | Tests in watch mode |

### Android

```bash
npm run build
npx cap sync android
npx cap open android
```

## Testing

```bash
npm test
```

Tests in `src/test/` cover pregnancy week and trimester calculation, exercise filtering, the user and workout-session stores, and the workout timer hook.

## Project structure

```
src/
├── app/             # App root, providers, router and layouts
├── pages/           # Home, onboarding, exercises, workouts, active workout, progress, settings, pricing, legal
├── components/      # Feature components (pricing)
├── shared/          # UI kit (Button, Card, Badge, Modal), layout, utilities
├── hooks/           # useTimer
├── stores/          # Zustand stores (user profile, workout sessions)
├── data/            # Exercise and workout definitions
├── types/           # Domain types
└── test/            # Vitest specs
server/
└── index.js         # Express: SPA hosting, Stripe checkout, portal, webhook, health check
android/             # Capacitor Android project
```

## API

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/create-checkout-session` | Start a Stripe subscription checkout |
| `POST` | `/api/create-portal-session` | Open the Stripe customer portal |
| `POST` | `/api/webhooks/stripe` | Stripe webhook receiver |
| `GET` | `/api/health` | Health check |
