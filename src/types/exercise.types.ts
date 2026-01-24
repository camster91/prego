export type Trimester = 1 | 2 | 3;

export type ExerciseCategory =
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'pelvic-floor'
  | 'breathing'
  | 'balance';

export type IntensityLevel = 'low' | 'moderate' | 'high';

export type MuscleGroup =
  | 'core'
  | 'legs'
  | 'arms'
  | 'back'
  | 'glutes'
  | 'pelvic-floor'
  | 'full-body';

export interface ExerciseModification {
  trimester: Trimester;
  description: string;
  adjustedIntensity?: IntensityLevel;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  thumbnailUrl: string;
  videoUrl?: string;

  // Pregnancy-specific
  safeTrmesters: Trimester[];
  contraindications: string[];
  modifications: ExerciseModification[];

  // Exercise details
  category: ExerciseCategory;
  targetMuscles: MuscleGroup[];
  intensity: IntensityLevel;

  // Timing
  defaultDurationSeconds: number;
  defaultReps?: number;
  defaultSets?: number;

  // Equipment
  equipmentRequired: string[];
}

export interface ExerciseFilters {
  trimester?: Trimester;
  category?: ExerciseCategory;
  intensity?: IntensityLevel;
  muscleGroup?: MuscleGroup;
  searchQuery?: string;
}
