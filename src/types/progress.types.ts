import type { ExerciseCategory, Trimester } from './exercise.types';

export interface TrimesterStats {
  trimester: Trimester;
  workoutsCompleted: number;
  totalMinutes: number;
  favoriteExercises: string[]; // exercise IDs
  averageDifficulty: number;
}

export interface WeeklyProgress {
  weekStartDate: Date;
  workoutsCompleted: number;
  totalMinutes: number;
  exerciseBreakdown: Record<ExerciseCategory, number>;
}

export type AchievementType =
  | 'first-workout'
  | 'week-streak-3'
  | 'week-streak-7'
  | 'trimester-complete'
  | 'category-master'
  | 'consistency-champion'
  | 'workout-count-10'
  | 'workout-count-25'
  | 'workout-count-50';

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  earnedAt?: Date;
  icon: string;
}

export interface UserProgress {
  // Overall stats
  totalWorkoutsCompleted: number;
  totalMinutesExercised: number;
  currentStreak: number;
  longestStreak: number;

  // By trimester
  trimesterStats: TrimesterStats[];

  // Weekly data for charts
  weeklyHistory: WeeklyProgress[];

  // Achievements
  achievements: Achievement[];
}
