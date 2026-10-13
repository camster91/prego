import { lazy } from 'react';

// Keep lazy component definitions in a component-only module so Vite's Fast
// Refresh boundary remains valid while the router exports configuration.
export const HomePage = lazy(() => import('../../pages/HomePage').then(m => ({ default: m.HomePage })));
export const ExercisesPage = lazy(() => import('../../pages/ExercisesPage').then(m => ({ default: m.ExercisesPage })));
export const ExerciseDetailPage = lazy(() => import('../../pages/ExerciseDetailPage').then(m => ({ default: m.ExerciseDetailPage })));
export const WorkoutsPage = lazy(() => import('../../pages/WorkoutsPage').then(m => ({ default: m.WorkoutsPage })));
export const WorkoutDetailPage = lazy(() => import('../../pages/WorkoutDetailPage').then(m => ({ default: m.WorkoutDetailPage })));
export const ActiveWorkoutPage = lazy(() => import('../../pages/ActiveWorkoutPage').then(m => ({ default: m.ActiveWorkoutPage })));
export const ProgressPage = lazy(() => import('../../pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
export const SettingsPage = lazy(() => import('../../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
export const PrivacyPolicyPage = lazy(() => import('../../pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
export const TermsOfServicePage = lazy(() => import('../../pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
export const OnboardingPage = lazy(() => import('../../pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
export const PricingPage = lazy(() => import('../../pages/PricingPage').then(m => ({ default: m.PricingPage })));
export const SuccessPage = lazy(() => import('../../pages/SuccessPage').then(m => ({ default: m.SuccessPage })));
export const NotFoundPage = lazy(() => import('../../pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export const LearnPage = lazy(() => import('../../pages/LearnPage').then(m => ({ default: m.LearnPage })));
