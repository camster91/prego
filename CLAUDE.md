# CLAUDE.md

## Project Overview

Prego is a pregnancy exercise web app built with React 19, TypeScript, and Vite. It provides pregnancy-safe exercises, workout plans, progress tracking, and a real-time timer. Mobile-first design with a calming pregnancy-themed color palette.

## Commands

- `npm run dev` — Start Vite dev server (port 5173)
- `npm run build` — TypeScript type-check (`tsc -b`) then Vite production build
- `npm run lint` — Run ESLint on all files
- `npm run preview` — Preview production build

## Architecture

- **Framework**: React 19 + TypeScript (strict mode, ES2022 target)
- **Build**: Vite 7 with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS v4 via PostCSS + `tailwind.config.js` custom theme
- **State**: Zustand with `persist` middleware (localStorage keys: `prego-user-storage`, `prego-workout-session-storage`)
- **Routing**: React Router v7 (`createBrowserRouter`)
- **Data viz**: Recharts
- **Icons**: Lucide React
- **Dates**: date-fns
- **Path alias**: `@/` maps to `./src/`

## Project Structure

```
src/
├── app/              # App entry, routing (router.tsx)
├── pages/            # Page components (one per route)
├── shared/
│   ├── components/
│   │   ├── ui/       # Reusable UI (Button, Card, Badge, Modal)
│   │   └── layout/   # Header, BottomNav, PageLayout
│   └── utils/        # cn() class-merge utility (clsx + tailwind-merge)
├── stores/           # Zustand stores (userStore, workoutSessionStore)
├── hooks/            # Custom hooks (useTimer)
├── data/             # Static exercise/workout data (no backend)
├── types/            # TypeScript type definitions (*.types.ts)
└── assets/           # Static assets
```

## Routes

| Path | Page | Layout |
|------|------|--------|
| `/` | HomePage | Root (Header + BottomNav) |
| `/exercises` | ExercisesPage | Root |
| `/exercises/:exerciseId` | ExerciseDetailPage | Root |
| `/workouts` | WorkoutsPage | Root |
| `/workouts/:workoutId` | WorkoutDetailPage | Root |
| `/workout/:workoutId/active` | ActiveWorkoutPage | Workout (no BottomNav) |
| `/progress` | ProgressPage | Root |
| `/settings` | SettingsPage | Root |
| `/onboarding` | OnboardingPage | None (standalone) |

## Key Stores

- **useUserStore** — User profile, onboarding state, pregnancy info (due date, trimester, week). Auto-calculates `currentWeek` and `currentTrimester` from `dueDate`.
- **useWorkoutSessionStore** — Active workout session, exercise index, pause state, completed session history. Exports selector helpers: `selectCompletedWorkoutsCount`, `selectTotalMinutesExercised`, `selectRecentSessions`.

## Domain Types

- `Trimester`: `1 | 2 | 3`
- `ExerciseCategory`: `strength | cardio | flexibility | pelvic-floor | breathing | balance`
- `IntensityLevel`: `low | moderate | high`
- `MuscleGroup`: `core | legs | arms | back | glutes | pelvic-floor | full-body`

## Data Layer

All data is static (no API). Exercise and workout definitions live in `src/data/`:
- `exercises.ts` — 12 exercises with trimester safety, contraindications, modifications, and filter helpers (`getExerciseById`, `filterExercises`)
- `workouts.ts` — 8 workout plans organized by trimester with filter helpers (`getWorkoutById`, `filterWorkouts`)

## Tailwind Theme

Custom color scales defined in `tailwind.config.js`:
- `sage` — neutral green tones (app background: `bg-sage-50`)
- `blush` — warm pink tones
- `primary` — sky blue
- `accent` — fuchsia/purple
- `trimester` — `1: emerald`, `2: amber`, `3: violet`

Custom animations: `pulse-slow`, `countdown`, `progress-fill`, `slide-up`, `fade-in`

## Code Conventions

- TypeScript strict mode is enabled; all code must type-check
- Use `@/` path alias for imports from `src/`
- Utility classes via Tailwind; use `cn()` from `@/shared/utils/cn` to merge classes
- Component files use PascalCase (e.g., `HomePage.tsx`)
- Type files use `*.types.ts` in the `types/` directory
- Barrel exports via `index.ts` in `types/` and `pages/`
- ESLint flat config with React Hooks and React Refresh plugins
- No test framework is configured; there are no tests
- No backend or API; all data is in-memory/localStorage
