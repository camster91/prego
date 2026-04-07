# Prego

**Pregnancy Exercise App**

A modern, mobile-friendly application delivering pregnancy-safe exercises, guided workout plans, real-time timers, and progress tracking. Built with Capacitor for native iOS and Android deployment.

## Features

### Personalized Experience
- **Automatic Trimester Tracking:** Calculates current trimester based on due date
- **Safe Exercise Library:** 12+ pregnancy-safe exercises vetted for each trimester
- **Smart Filtering:** Filter by trimester, category, and intensity level

### Workout Programs
- **Guided Workout Plans:** 8 pre-built programs (5-15 minutes each)
- **Trimester-Tailored:** Programs specifically designed for each pregnancy stage
- **Custom Workouts:** Build your own workout from the exercise library

### Active Workout
- **Real-time Timer:** Countdown timers with audio cues
- **Exercise Queue:** Intuitive queue system for workout flow
- **Rest Intervals:** Configurable rest periods between exercises

### Progress Tracking
- **Activity History:** Weekly activity charts and statistics
- **Streak Tracking:** Maintain workout consistency
- **Achievement Badges:** Unlock achievements for milestones

### Mobile-First
- **Offline Capable:** State persisted locally for on-the-go workouts
- **Native Apps:** iOS and Android via Capacitor
- **PWA Support:** Install on any device

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v4 + Lucide Icons |
| State | Zustand (persisted) |
| Routing | React Router v7 |
| Mobile | Capacitor 8 (iOS + Android) |
| Build | Vite |
| Charts | Recharts |
| Audio | use-sound |

## Prerequisites

- Node.js 18+
- npm 9+
- For native builds: Android Studio and/or Xcode

## Installation

```bash
# Clone the repository
git clone https://github.com/camster91/prego.git
cd prego

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

### Development

```bash
# Start Vite dev server
npm run dev

# Preview production build
npm run preview
```

### Native Mobile

```bash
# Build web assets
npm run build

# Sync to native projects
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

### Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
src/
├── components/            # React components
│   ├── exercises/        # Exercise card and detail components
│   ├── workout/          # Timer, queue, and workout player
│   ├── progress/         # Charts and achievement components
│   └── ui/               # Base UI components
├── pages/                 # Route pages
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
├── data/                  # Exercise and workout data
├── utils/                 # Utility functions
└── types/                 # TypeScript definitions

public/
└── sounds/                # Audio files for timer cues

server/
└── index.js              # Express server (optional backend)
```

## Configuration

### Capacitor

Edit `capacitor.config.ts` for native app configuration:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.prego',
  appName: 'Prego',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

### Environment Variables

Create a `.env` file if needed for backend features:

```env
VITE_API_URL=https://api.example.com
```

## Store Submission Checklist

Before submitting to app stores:

- [ ] Generate release keystore for Android signing
- [ ] Generate production App Icons and Splash Screens
- [ ] Create Apple Developer provisioning profiles
- [ ] Finalize store listing metadata
  - [ ] App screenshots (phone, tablet)
  - [ ] Privacy Policy URL
  - [ ] App description and keywords
- [ ] Configure app.json / app.config.js

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest |
| `npm run preview` | Preview production build |

## Data Structure

### Exercise
```typescript
interface Exercise {
  id: string;
  name: string;
  description: string;
  trimester: 1 | 2 | 3 | 'all';
  category: 'strength' | 'stretch' | 'cardio' | 'breathing';
  intensity: 'low' | 'medium' | 'high';
  duration: number; // seconds
  instructions: string[];
}
```

### Workout
```typescript
interface Workout {
  id: string;
  name: string;
  description: string;
  trimester: 1 | 2 | 3 | 'all';
  exercises: Exercise[];
  totalDuration: number;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

## License

Proprietary - All rights reserved.

---
Developed by Cameron Ashley / Nexus AI.
