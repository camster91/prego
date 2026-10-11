# CLAUDE.md — Prego

Prego is a React/Capacitor pregnancy movement companion with Today, Move, Learn, Progress and You. Exercise content is draft: never label it approved or enable guided workouts without qualified review and an approved screening/eligibility contract. See docs/PRODUCT-REQUIREMENTS.md and docs/RELEASE-READINESS.md.

**Production URL**: https://prego.ashbi.ca

## Tech Stack

- **Frontend**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4
- **State**: Zustand 5 (versioned browser storage or encrypted native storage), TanStack React Query v5
- **Routing**: React Router v7 with lazy-loaded pages
- **Backend**: Express 4 (serves SPA + Stripe API endpoints)
- **Mobile**: Capacitor 8 (iOS/Android)
- **Testing**: Vitest 4 + Testing Library + jsdom
- **Deployment**: GitHub Actions → Coolify (webhook)

## Commands

```bash
npm run dev          # Vite dev server (localhost:5173)
npm run build        # tsc -b && vite build → dist/
npm run lint         # ESLint (flat config, v9)
npm run test         # Vitest run (once)
npm run test:watch   # Vitest watch mode
npm start            # Express server on port 3000
npm run preview      # Preview production build
```

## Project Structure

```
src/
├── app/              # App.tsx (root + providers), routes/ (router config, layouts)
├── components/       # Feature-specific components (e.g. Pricing)
├── data/             # Mock data (exercises.ts, workouts.ts)
├── hooks/            # Custom hooks (useTimer for workout sessions)
├── pages/            # 11 page components (Home, Exercises, Workouts, Progress, etc.)
├── shared/
│   ├── components/
│   │   ├── ui/       # Reusable UI: Button (CVA variants), Card, Badge
│   │   └── layout/   # Header, BottomNav, PageLayout
│   └── utils/        # cn() helper (clsx + tailwind-merge)
├── stores/           # Zustand stores (userStore, workoutSessionStore)
├── test/             # Test setup and specs
└── types/            # TypeScript type definitions (exercise, user, workout, progress, timer)
server/               # Express backend (Stripe webhooks, checkout, health check)
```

## Path Alias

`@/*` maps to `./src/*` — use `@/` imports throughout (configured in tsconfig and vite).

## Key Conventions

### Error Handling
- Global `ErrorBoundary` wraps the app in `App.tsx` — catches unhandled React errors
- Individual pages handle "not found" states (exercise, workout) with fallback UI
- Server gracefully handles missing Stripe configuration (warns on startup, returns 503)

### Components
- Functional components with hooks only — no class components (ErrorBoundary is the sole exception)
- Pages use **named exports** with lazy loading via `.then()` pattern
- Button variants use `class-variance-authority` (primary, secondary, ghost, danger, outline, success)
- Card uses compound component pattern (Card, CardHeader, CardTitle, CardContent)

### Styling
- **Tailwind CSS only** — no CSS files in src
- Custom color palette: `primary` (sky blue), `accent` (magenta), `trimester` (emerald/amber/violet for T1/T2/T3), `sage`, `blush`
- Custom animations defined in `tailwind.config.js`: countdown-pulse, progress-fill, slide-up, fade-in
- Use `cn()` from `@/shared/utils/cn` to merge classnames

### State Management
- Zustand stores with `persist` middleware using src/lib/storage.ts; native keychain/encrypted storage, web localStorage; preserve migrations and complete deletion
- localStorage keys: `prego-user-storage`, `prego-workout-session-storage`
- Memoized selector functions for derived state (e.g. `selectCompletedWorkoutsCount`)

### Types
- TypeScript strict mode enabled
- Type definitions live in `src/types/` — one file per domain (exercise, user, workout, progress, timer)
- Factory functions for object creation (e.g. `createUserProfile()`)

### Data
- All exercise/workout data is mock data in `src/data/`
- Data access via helper functions: `getExerciseById()`, `getWorkoutById()`, `filterExercises()`
- No external database — state persisted via localStorage

### Layouts
- `RootLayout`: Header + Outlet + BottomNav (main app shell)
- `WorkoutLayout`: Minimal layout for active workout sessions (no nav)
- Mobile-first responsive design

## Testing

- Tests in `src/test/` using Vitest with jsdom environment
- Setup file: `src/test/setup.ts` (imports jest-dom matchers)
- Current tests cover exercise filtering, data retrieval, pregnancy info calculations
- Run `npm run test` before committing

## Backend API

Express server (`server/index.js`):
- `POST /api/webhooks/stripe` — Stripe webhook handler
- `POST /api/create-checkout-session` — Stripe subscription checkout
- `POST /api/create-portal-session` — Stripe customer portal
- `GET /api/health` — Health check
- Serves built SPA from `dist/` with fallback routing

## Environment Variables

- `STRIPE_SECRET_KEY` — Stripe API key (backend)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signature validation
- `COOLIFY_TOKEN` — Deployment webhook authorization
- `APP_URL` — Production domain (default: https://prego.ashbi.ca)
- `PORT` — Server port (default: 3000)

## Domain-Specific Notes

- **Pregnancy safety is critical**: legacy draft trimester tags are not clinical approval; src/lib/contentReview.ts fails closed until review and screening rules are supplied
- Stage derives from calendar dates via calculatePregnancyInfo()/usePregnancyStage(); never use stale profile week fields for selection. Explicit unknown/out-of-range/date-passed states never grant eligibility.
- Audio cues use Web Audio API directly (not the use-sound library) in ActiveWorkoutPage
- PWA-capable: manifest.json, service worker (`public/sw.js`), registered in `main.tsx`
- Production service worker is generated from the complete immutable asset bundle by scripts/generate-service-worker.mjs; native builds do not register it
- Icon-only buttons must include `aria-label` for accessibility
