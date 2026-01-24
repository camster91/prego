import type { Exercise, ExerciseCategory, IntensityLevel, Trimester } from './exercise.types';

export interface WorkoutExercise {
  exerciseId: string;
  exercise?: Exercise; // Populated on fetch
  order: number;

  // Override defaults if needed
  durationSeconds?: number;
  reps?: number;
  sets?: number;

  // Rest after this exercise
  restSeconds: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;

  // Organization
  trimester: Trimester;
  weekRange: { start: number; end: number }; // e.g., weeks 1-13

  // Content
  exercises: WorkoutExercise[];
  totalDurationMinutes: number;
  intensity: IntensityLevel;
  category: ExerciseCategory;

  // Scheduling
  recommendedFrequency: number; // times per week
}

export interface CompletedExercise {
  exerciseId: string;
  completedAt: Date;
  actualDurationSeconds: number;
  skipped: boolean;
}

export interface WorkoutSession {
  id: string;
  workoutPlanId: string;

  // Timing
  startedAt: Date;
  completedAt?: Date;
  totalDurationSeconds: number;

  // Progress
  exercisesCompleted: CompletedExercise[];
  status: 'in-progress' | 'completed' | 'abandoned';

  // User feedback
  perceivedDifficulty?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}
