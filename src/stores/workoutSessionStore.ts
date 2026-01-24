import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkoutSession, CompletedExercise } from '../types';

interface WorkoutSessionState {
  // Current session
  currentSession: WorkoutSession | null;
  currentExerciseIndex: number;
  isPaused: boolean;

  // Session history
  completedSessions: WorkoutSession[];

  // Actions
  startWorkout: (workoutPlanId: string) => void;
  completeExercise: (exerciseId: string, durationSeconds: number, skipped?: boolean) => void;
  nextExercise: () => void;
  previousExercise: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  endWorkout: (difficulty?: 1 | 2 | 3 | 4 | 5, notes?: string) => void;
  abandonWorkout: () => void;
  clearCurrentSession: () => void;
}

export const useWorkoutSessionStore = create<WorkoutSessionState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      currentExerciseIndex: 0,
      isPaused: false,
      completedSessions: [],

      startWorkout: (workoutPlanId) => {
        const newSession: WorkoutSession = {
          id: crypto.randomUUID(),
          workoutPlanId,
          startedAt: new Date(),
          totalDurationSeconds: 0,
          exercisesCompleted: [],
          status: 'in-progress'
        };

        set({
          currentSession: newSession,
          currentExerciseIndex: 0,
          isPaused: false
        });
      },

      completeExercise: (exerciseId, durationSeconds, skipped = false) => {
        const session = get().currentSession;
        if (!session) return;

        const completedExercise: CompletedExercise = {
          exerciseId,
          completedAt: new Date(),
          actualDurationSeconds: durationSeconds,
          skipped
        };

        set({
          currentSession: {
            ...session,
            exercisesCompleted: [...session.exercisesCompleted, completedExercise],
            totalDurationSeconds: session.totalDurationSeconds + durationSeconds
          }
        });
      },

      nextExercise: () => {
        set((state) => ({
          currentExerciseIndex: state.currentExerciseIndex + 1
        }));
      },

      previousExercise: () => {
        set((state) => ({
          currentExerciseIndex: Math.max(0, state.currentExerciseIndex - 1)
        }));
      },

      pauseWorkout: () => set({ isPaused: true }),

      resumeWorkout: () => set({ isPaused: false }),

      endWorkout: (difficulty, notes) => {
        const session = get().currentSession;
        if (!session) return;

        const completedSession: WorkoutSession = {
          ...session,
          completedAt: new Date(),
          status: 'completed',
          perceivedDifficulty: difficulty,
          notes
        };

        set((state) => ({
          currentSession: null,
          currentExerciseIndex: 0,
          isPaused: false,
          completedSessions: [...state.completedSessions, completedSession]
        }));
      },

      abandonWorkout: () => {
        const session = get().currentSession;
        if (!session) return;

        const abandonedSession: WorkoutSession = {
          ...session,
          completedAt: new Date(),
          status: 'abandoned'
        };

        set((state) => ({
          currentSession: null,
          currentExerciseIndex: 0,
          isPaused: false,
          completedSessions: [...state.completedSessions, abandonedSession]
        }));
      },

      clearCurrentSession: () => {
        set({
          currentSession: null,
          currentExerciseIndex: 0,
          isPaused: false
        });
      }
    }),
    {
      name: 'prego-workout-session-storage',
      partialize: (state) => ({
        completedSessions: state.completedSessions
      })
    }
  )
);

// Selector helpers
export const selectCompletedWorkoutsCount = (state: WorkoutSessionState) =>
  state.completedSessions.filter(s => s.status === 'completed').length;

export const selectTotalMinutesExercised = (state: WorkoutSessionState) =>
  Math.round(
    state.completedSessions
      .filter(s => s.status === 'completed')
      .reduce((acc, s) => acc + s.totalDurationSeconds, 0) / 60
  );

export const selectRecentSessions = (state: WorkoutSessionState, limit = 5) =>
  state.completedSessions
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, limit);
