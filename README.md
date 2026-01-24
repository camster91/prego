# Prego - Pregnancy Exercise App

A modern, mobile-friendly web application for pregnancy-safe exercises with workout plans, progress tracking, and real-time timer guidance.

## Features

- **Onboarding Flow** - Personalized setup with due date calculation for automatic trimester tracking
- **Exercise Library** - 12+ pregnancy-safe exercises with detailed instructions, filterable by trimester, category, and intensity
- **Workout Plans** - 8 pre-built workout programs organized by trimester (5-15 minutes each)
- **Active Workout Timer** - Real-time countdown with audio cues, pause/resume, skip controls, and exercise queue
- **Progress Tracking** - Workout history, streak tracking, weekly activity charts, and achievement badges
- **Settings** - Profile management, sound preferences, and workout customization

## Tech Stack

- **React 19** + TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** for styling
- **Zustand** for state management (persisted to localStorage)
- **React Router v6** for navigation
- **Recharts** for progress visualization
- **Lucide React** for icons
- **date-fns** for date calculations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prego.git
cd prego

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Production files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── app/           # App entry, providers, routing
├── data/          # Mock exercise and workout data
├── hooks/         # Custom hooks (timer)
├── pages/         # Page components
│   ├── HomePage.tsx
│   ├── ExercisesPage.tsx
│   ├── WorkoutsPage.tsx
│   ├── ActiveWorkoutPage.tsx
│   ├── ProgressPage.tsx
│   └── SettingsPage.tsx
├── shared/        # Reusable UI components
│   ├── components/
│   │   ├── ui/    # Button, Card, Badge, Modal
│   │   └── layout/# Header, BottomNav, PageLayout
│   └── utils/     # Utility functions
├── stores/        # Zustand stores
│   ├── userStore.ts
│   └── workoutSessionStore.ts
└── types/         # TypeScript definitions
```

## Exercise Categories

- **Strength** - Wall push-ups, squats, leg lifts
- **Cardio** - Seated marching, standing exercises
- **Flexibility** - Cat-cow stretch, hip circles, shoulder rolls
- **Pelvic Floor** - Kegel exercises
- **Breathing** - Deep belly breathing
- **Balance** - Bird dog, modified warrior poses

## Safety Notice

This app is for informational purposes only. Always consult with your healthcare provider before starting any exercise program during pregnancy.

## License

MIT
