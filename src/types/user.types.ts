import type { IntensityLevel, Trimester } from './exercise.types';

export interface UserPreferences {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  reminderTime?: string; // "09:00" format
  reminderDays: number[]; // 0-6 (Sunday-Saturday)
  preferredIntensity: IntensityLevel;
  preferredDuration: number; // minutes
}

export interface UserProfile {
  id: string;
  displayName: string;

  // Pregnancy info
  dueDate: Date;
  currentTrimester: Trimester;
  currentWeek: number;

  // Health considerations
  healthConditions: string[];
  doctorApproved: boolean;

  // Preferences
  preferences: UserPreferences;
}
