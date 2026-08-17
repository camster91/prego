import { createBrowserRouter } from 'react-router-dom';
import { RootLayout, WorkoutLayout } from './layouts';
import { withSuspense } from '../../shared/components/ui/LoadingSpinner';
import {
  ActiveWorkoutPage,
  ExerciseDetailPage,
  ExercisesPage,
  HomePage,
  NotFoundPage,
  OnboardingPage,
  PricingPage,
  PrivacyPolicyPage,
  ProgressPage,
  SettingsPage,
  SuccessPage,
  TermsOfServicePage,
  WorkoutDetailPage,
  WorkoutsPage,
} from './lazyPages';

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
      { path: 'pricing', element: withSuspense(PricingPage) },
      { path: 'success', element: withSuspense(SuccessPage) },
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
  },
  {
    path: '*',
    element: withSuspense(NotFoundPage)
  }
]);
