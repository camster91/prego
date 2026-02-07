import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout, WorkoutLayout } from './layouts';
import { withSuspense } from '../../shared/components/ui/LoadingSpinner';

// Lazy-loaded pages (named exports converted to default via .then())
const HomePage = lazy(() => import('../../pages/HomePage').then(m => ({ default: m.HomePage })));
const ExercisesPage = lazy(() => import('../../pages/ExercisesPage').then(m => ({ default: m.ExercisesPage })));
const ExerciseDetailPage = lazy(() => import('../../pages/ExerciseDetailPage').then(m => ({ default: m.ExerciseDetailPage })));
const WorkoutsPage = lazy(() => import('../../pages/WorkoutsPage').then(m => ({ default: m.WorkoutsPage })));
const WorkoutDetailPage = lazy(() => import('../../pages/WorkoutDetailPage').then(m => ({ default: m.WorkoutDetailPage })));
const ActiveWorkoutPage = lazy(() => import('../../pages/ActiveWorkoutPage').then(m => ({ default: m.ActiveWorkoutPage })));
const ProgressPage = lazy(() => import('../../pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const SettingsPage = lazy(() => import('../../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const PrivacyPolicyPage = lazy(() => import('../../pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('../../pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const OnboardingPage = lazy(() => import('../../pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'exercises', element: withSuspense(ExercisesPage) },
      { path: 'exercises/:exerciseId', element: withSuspense(ExerciseDetailPage) },
      { path: 'workouts', element: withSuspense(WorkoutsPage) },
      { path: 'workouts/:workoutId', element: withSuspense(WorkoutDetailPage) },
      { path: 'progress', element: withSuspense(ProgressPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'privacy', element: withSuspense(PrivacyPolicyPage) },
      { path: 'terms', element: withSuspense(TermsOfServicePage) }
    ]
  },
  {
    path: '/workout',
    element: <WorkoutLayout />,
    children: [
      { path: ':workoutId/active', element: withSuspense(ActiveWorkoutPage) }
    ]
  },
  {
    path: '/onboarding',
    element: withSuspense(OnboardingPage)
  }
]);
