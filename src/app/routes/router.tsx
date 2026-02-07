import { createBrowserRouter } from 'react-router-dom';
import { RootLayout, WorkoutLayout } from './layouts';

// Pages
import { HomePage } from '../../pages/HomePage';
import { ExercisesPage } from '../../pages/ExercisesPage';
import { ExerciseDetailPage } from '../../pages/ExerciseDetailPage';
import { WorkoutsPage } from '../../pages/WorkoutsPage';
import { WorkoutDetailPage } from '../../pages/WorkoutDetailPage';
import { ActiveWorkoutPage } from '../../pages/ActiveWorkoutPage';
import { ProgressPage } from '../../pages/ProgressPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { OnboardingPage } from '../../pages/OnboardingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'exercises', element: <ExercisesPage /> },
      { path: 'exercises/:exerciseId', element: <ExerciseDetailPage /> },
      { path: 'workouts', element: <WorkoutsPage /> },
      { path: 'workouts/:workoutId', element: <WorkoutDetailPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'settings', element: <SettingsPage /> }
    ]
  },
  {
    path: '/workout',
    element: <WorkoutLayout />,
    children: [
      { path: ':workoutId/active', element: <ActiveWorkoutPage /> }
    ]
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />
  }
]);
