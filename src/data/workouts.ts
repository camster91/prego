import type { WorkoutPlan } from '../types';

export const workoutPlans: WorkoutPlan[] = [
  // First Trimester Workouts
  {
    id: 'first-tri-gentle-start',
    name: 'Gentle Start',
    description: 'A gentle introduction to prenatal exercise. Perfect for early pregnancy when energy may be low.',
    thumbnailUrl: '/images/workouts/gentle-start.jpg',
    trimester: 1,
    weekRange: { start: 1, end: 13 },
    exercises: [
      { exerciseId: 'prenatal-breathing', order: 1, durationSeconds: 120, restSeconds: 30 },
      { exerciseId: 'shoulder-circles', order: 2, durationSeconds: 45, restSeconds: 20 },
      { exerciseId: 'cat-cow', order: 3, durationSeconds: 60, restSeconds: 30 },
      { exerciseId: 'kegel-basic', order: 4, durationSeconds: 60, restSeconds: 20 },
      { exerciseId: 'hip-circles', order: 5, durationSeconds: 45, restSeconds: 0 }
    ],
    totalDurationMinutes: 8,
    intensity: 'low',
    category: 'flexibility',
    recommendedFrequency: 3
  },
  {
    id: 'first-tri-strength',
    name: 'First Trimester Strength',
    description: 'Build foundational strength safely during your first trimester.',
    thumbnailUrl: '/images/workouts/strength-1.jpg',
    trimester: 1,
    weekRange: { start: 1, end: 13 },
    exercises: [
      { exerciseId: 'prenatal-breathing', order: 1, durationSeconds: 60, restSeconds: 30 },
      { exerciseId: 'wall-pushup', order: 2, durationSeconds: 45, restSeconds: 30 },
      { exerciseId: 'prenatal-squat', order: 3, durationSeconds: 45, restSeconds: 30 },
      { exerciseId: 'bird-dog', order: 4, durationSeconds: 60, restSeconds: 30 },
      { exerciseId: 'standing-calf-raise', order: 5, durationSeconds: 45, restSeconds: 20 },
      { exerciseId: 'kegel-basic', order: 6, durationSeconds: 60, restSeconds: 0 }
    ],
    totalDurationMinutes: 10,
    intensity: 'moderate',
    category: 'strength',
    recommendedFrequency: 3
  },

  // Second Trimester Workouts
  {
    id: 'second-tri-energy',
    name: 'Second Trimester Energy Boost',
    description: 'Take advantage of your second trimester energy with this balanced workout.',
    thumbnailUrl: '/images/workouts/energy-boost.jpg',
    trimester: 2,
    weekRange: { start: 14, end: 27 },
    exercises: [
      { exerciseId: 'prenatal-breathing', order: 1, durationSeconds: 60, restSeconds: 20 },
      { exerciseId: 'cat-cow', order: 2, durationSeconds: 60, restSeconds: 20 },
      { exerciseId: 'prenatal-yoga-warrior', order: 3, durationSeconds: 60, restSeconds: 30 },
      { exerciseId: 'wall-pushup', order: 4, durationSeconds: 45, restSeconds: 30 },
      { exerciseId: 'side-lying-leg-lift', order: 5, durationSeconds: 60, restSeconds: 30 },
      { exerciseId: 'prenatal-squat', order: 6, durationSeconds: 45, restSeconds: 30 },
      { exerciseId: 'seated-march', order: 7, durationSeconds: 60, restSeconds: 20 },
      { exerciseId: 'kegel-basic', order: 8, durationSeconds: 60, restSeconds: 0 }
    ],
    totalDurationMinutes: 12,
    intensity: 'moderate',
    category: 'strength',
    recommendedFrequency: 4
  },
  {
    id: 'second-tri-cardio',
    name: 'Gentle Cardio Flow',
    description: 'Low-impact cardio workout to maintain fitness and boost mood.',
    thumbnailUrl: '/images/workouts/cardio-flow.jpg',
    trimester: 2,
    weekRange: { start: 14, end: 27 },
    exercises: [
      { exerciseId: 'shoulder-circles', order: 1, durationSeconds: 45, restSeconds: 15 },
      { exerciseId: 'hip-circles', order: 2, durationSeconds: 45, restSeconds: 15 },
      { exerciseId: 'seated-march', order: 3, durationSeconds: 90, restSeconds: 30 },
      { exerciseId: 'standing-calf-raise', order: 4, durationSeconds: 45, restSeconds: 20 },
      { exerciseId: 'prenatal-squat', order: 5, durationSeconds: 45, restSeconds: 30 },
      { exerciseId: 'seated-march', order: 6, durationSeconds: 90, restSeconds: 30 },
      { exerciseId: 'prenatal-breathing', order: 7, durationSeconds: 60, restSeconds: 0 }
    ],
    totalDurationMinutes: 10,
    intensity: 'moderate',
    category: 'cardio',
    recommendedFrequency: 3
  },

  // Third Trimester Workouts
  {
    id: 'third-tri-comfort',
    name: 'Third Trimester Comfort',
    description: 'Gentle exercises focused on relieving common third trimester discomforts.',
    thumbnailUrl: '/images/workouts/comfort.jpg',
    trimester: 3,
    weekRange: { start: 28, end: 40 },
    exercises: [
      { exerciseId: 'prenatal-breathing', order: 1, durationSeconds: 120, restSeconds: 30 },
      { exerciseId: 'shoulder-circles', order: 2, durationSeconds: 45, restSeconds: 20 },
      { exerciseId: 'cat-cow', order: 3, durationSeconds: 60, restSeconds: 30 },
      { exerciseId: 'hip-circles', order: 4, durationSeconds: 45, restSeconds: 30 },
      { exerciseId: 'side-lying-leg-lift', order: 5, durationSeconds: 60, restSeconds: 30 },
      { exerciseId: 'kegel-basic', order: 6, durationSeconds: 90, restSeconds: 0 }
    ],
    totalDurationMinutes: 10,
    intensity: 'low',
    category: 'flexibility',
    recommendedFrequency: 4
  },
  {
    id: 'third-tri-labor-prep',
    name: 'Labor Preparation',
    description: 'Prepare your body for labor with exercises focused on pelvic floor and hip mobility.',
    thumbnailUrl: '/images/workouts/labor-prep.jpg',
    trimester: 3,
    weekRange: { start: 28, end: 40 },
    exercises: [
      { exerciseId: 'prenatal-breathing', order: 1, durationSeconds: 120, restSeconds: 30 },
      { exerciseId: 'cat-cow', order: 2, durationSeconds: 90, restSeconds: 30 },
      { exerciseId: 'hip-circles', order: 3, durationSeconds: 60, restSeconds: 30 },
      { exerciseId: 'prenatal-squat', order: 4, durationSeconds: 60, restSeconds: 40 },
      { exerciseId: 'kegel-basic', order: 5, durationSeconds: 120, restSeconds: 30 },
      { exerciseId: 'prenatal-breathing', order: 6, durationSeconds: 120, restSeconds: 0 }
    ],
    totalDurationMinutes: 13,
    intensity: 'low',
    category: 'pelvic-floor',
    recommendedFrequency: 5
  },

  // Quick Workouts (All Trimesters)
  {
    id: 'quick-stretch',
    name: 'Quick 5-Minute Stretch',
    description: 'A quick stretch routine when you only have a few minutes.',
    thumbnailUrl: '/images/workouts/quick-stretch.jpg',
    trimester: 1,
    weekRange: { start: 1, end: 40 },
    exercises: [
      { exerciseId: 'shoulder-circles', order: 1, durationSeconds: 45, restSeconds: 15 },
      { exerciseId: 'cat-cow', order: 2, durationSeconds: 60, restSeconds: 15 },
      { exerciseId: 'hip-circles', order: 3, durationSeconds: 45, restSeconds: 15 },
      { exerciseId: 'prenatal-breathing', order: 4, durationSeconds: 60, restSeconds: 0 }
    ],
    totalDurationMinutes: 5,
    intensity: 'low',
    category: 'flexibility',
    recommendedFrequency: 7
  },
  {
    id: 'pelvic-power',
    name: 'Pelvic Floor Focus',
    description: 'Dedicated pelvic floor strengthening session for any stage of pregnancy.',
    thumbnailUrl: '/images/workouts/pelvic-floor.jpg',
    trimester: 1,
    weekRange: { start: 1, end: 40 },
    exercises: [
      { exerciseId: 'prenatal-breathing', order: 1, durationSeconds: 60, restSeconds: 20 },
      { exerciseId: 'kegel-basic', order: 2, durationSeconds: 90, restSeconds: 30 },
      { exerciseId: 'cat-cow', order: 3, durationSeconds: 60, restSeconds: 20 },
      { exerciseId: 'kegel-basic', order: 4, durationSeconds: 90, restSeconds: 0 }
    ],
    totalDurationMinutes: 7,
    intensity: 'low',
    category: 'pelvic-floor',
    recommendedFrequency: 5
  }
];

export function getWorkoutById(id: string): WorkoutPlan | undefined {
  return workoutPlans.find(w => w.id === id);
}

export function filterWorkouts(filters: {
  trimester?: 1 | 2 | 3;
  category?: string;
  intensity?: string;
  maxDuration?: number;
}): WorkoutPlan[] {
  return workoutPlans.filter(workout => {
    // Filter by trimester - show workouts designed for this trimester
    // or workouts that span all trimesters (weekRange.start = 1, weekRange.end = 40)
    if (filters.trimester) {
      const isAllTrimester = workout.weekRange.start === 1 && workout.weekRange.end === 40;
      if (!isAllTrimester && workout.trimester !== filters.trimester) {
        return false;
      }
    }

    // Filter by category
    if (filters.category && workout.category !== filters.category) {
      return false;
    }

    // Filter by intensity
    if (filters.intensity && workout.intensity !== filters.intensity) {
      return false;
    }

    // Filter by max duration
    if (filters.maxDuration && workout.totalDurationMinutes > filters.maxDuration) {
      return false;
    }

    return true;
  });
}
