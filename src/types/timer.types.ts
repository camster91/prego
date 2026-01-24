export type TimerPhase = 'countdown' | 'exercise' | 'rest' | 'complete';

export interface TimerExercise {
  exerciseId: string;
  name: string;
  durationSeconds: number;
  restSeconds: number;
}

export interface TimerState {
  phase: TimerPhase;
  totalSeconds: number;
  remainingSeconds: number;
  currentExerciseIndex: number;
  totalExercises: number;
  isRunning: boolean;
  isPaused: boolean;
}

export interface TimerConfig {
  countdownSeconds: number; // Initial countdown before workout
  exercises: TimerExercise[];
  onExerciseComplete?: (exerciseIndex: number) => void;
  onWorkoutComplete?: () => void;
  onPhaseChange?: (phase: TimerPhase) => void;
}
