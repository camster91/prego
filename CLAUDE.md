# CLAUDE.md

## Project Overview

Prego is a pregnancy exercise web app built with React 19, TypeScript, and Vite. It provides pregnancy-safe exercises, workout plans, progress tracking, and a real-time timer.

## Commands

- `npm run dev` — Start Vite dev server (port 5173)
- `npm run build` — TypeScript type-check (`tsc -b`) then Vite production build
- `npm run lint` — Run ESLint on all files
- `npm run preview` — Preview production build

## Architecture

- **Framework**: React 19 + TypeScript (strict mode, ES2022 target)
- **Build**: Vite 7 with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS v4 via PostCSS
- **State**: Zustand with localStorage persistence
- **Routing**: React Router v7
- **Data viz**: Recharts
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
│   └── utils/        # Utility functions (cn for class merging)
├── stores/           # Zustand stores (userStore, workoutSessionStore)
├── hooks/            # Custom hooks (useTimer)
├── data/             # Static exercise/workout data
├── types/            # TypeScript type definitions
└── assets/           # Static assets
```

## Code Conventions

- TypeScript strict mode is enabled; all code must type-check
- Use `@/` path alias for imports from `src/`
- Utility classes via Tailwind; use `cn()` from `@/shared/utils` to merge classes
- Component files use PascalCase (e.g., `HomePage.tsx`)
- Type files use `*.types.ts` in the `types/` directory
- ESLint flat config with React Hooks and React Refresh plugins
- No test framework is configured; there are no tests
