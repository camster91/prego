import { describe, it, expect, beforeEach } from 'vitest';
import {
  useWorkoutSessionStore,
  selectCompletedWorkoutsCount,
  selectTotalMinutesExercised,
  selectRecentSessions
} from '../stores/workoutSessionStore';

describe('workoutSessionStore', () => {
  beforeEach(() => {
    useWorkoutSessionStore.setState({
      currentSession: null,
      currentExerciseIndex: 0,
      isPaused: false,
      completedSessions: []
    });
  });

  describe('startWorkout', () => {
    it('creates a new session', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-1');

      const session = useWorkoutSessionStore.getState().currentSession;
      expect(session).not.toBeNull();
      expect(session?.workoutPlanId).toBe('workout-1');
      expect(session?.status).toBe('in-progress');
      expect(session?.exercisesCompleted).toEqual([]);
      expect(session?.totalDurationSeconds).toBe(0);
    });

    it('resets exercise index and pause state', () => {
      useWorkoutSessionStore.setState({ currentExerciseIndex: 3, isPaused: true });
      useWorkoutSessionStore.getState().startWorkout('workout-1');

      expect(useWorkoutSessionStore.getState().currentExerciseIndex).toBe(0);
      expect(useWorkoutSessionStore.getState().isPaused).toBe(false);
    });
  });

  describe('completeExercise', () => {
    it('adds a completed exercise to the session', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-1');
      useWorkoutSessionStore.getState().completeExercise('exercise-1', 30);

      const session = useWorkoutSessionStore.getState().currentSession;
      expect(session?.exercisesCompleted).toHaveLength(1);
      expect(session?.exercisesCompleted[0].exerciseId).toBe('exercise-1');
      expect(session?.exercisesCompleted[0].actualDurationSeconds).toBe(30);
      expect(session?.exercisesCompleted[0].skipped).toBe(false);
      expect(session?.totalDurationSeconds).toBe(30);
    });

    it('accumulates total duration', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-1');
      useWorkoutSessionStore.getState().completeExercise('ex-1', 30);
      useWorkoutSessionStore.getState().completeExercise('ex-2', 45);

      const session = useWorkoutSessionStore.getState().currentSession;
      expect(session?.totalDurationSeconds).toBe(75);
      expect(session?.exercisesCompleted).toHaveLength(2);
    });

    it('does nothing when no session is active', () => {
      useWorkoutSessionStore.getState().completeExercise('ex-1', 30);
      expect(useWorkoutSessionStore.getState().currentSession).toBeNull();
    });

    it('marks exercise as skipped when specified', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-1');
      useWorkoutSessionStore.getState().completeExercise('ex-1', 0, true);

      const session = useWorkoutSessionStore.getState().currentSession;
      expect(session?.exercisesCompleted[0].skipped).toBe(true);
    });
  });

  describe('endWorkout', () => {
    it('completes the session and stores it', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-1');
      useWorkoutSessionStore.getState().completeExercise('ex-1', 30);
      useWorkoutSessionStore.getState().endWorkout(4, 'Great workout');

      const state = useWorkoutSessionStore.getState();
      expect(state.currentSession).toBeNull();
      expect(state.completedSessions).toHaveLength(1);
      expect(state.completedSessions[0].status).toBe('completed');
      expect(state.completedSessions[0].perceivedDifficulty).toBe(4);
      expect(state.completedSessions[0].notes).toBe('Great workout');
      expect(state.completedSessions[0].completedAt).toBeDefined();
    });
  });

  describe('abandonWorkout', () => {
    it('marks the session as abandoned', () => {
      useWorkoutSessionStore.getState().startWorkout('workout-1');
      useWorkoutSessionStore.getState().abandonWorkout();

      const state = useWorkoutSessionStore.getState();
      expect(state.currentSession).toBeNull();
      expect(state.completedSessions).toHaveLength(1);
      expect(state.completedSessions[0].status).toBe('abandoned');
    });
  });

  describe('pause/resume', () => {
    it('toggles pause state', () => {
      useWorkoutSessionStore.getState().pauseWorkout();
      expect(useWorkoutSessionStore.getState().isPaused).toBe(true);

      useWorkoutSessionStore.getState().resumeWorkout();
      expect(useWorkoutSessionStore.getState().isPaused).toBe(false);
    });
  });

  describe('nextExercise / previousExercise', () => {
    it('increments exercise index', () => {
      useWorkoutSessionStore.getState().nextExercise();
      expect(useWorkoutSessionStore.getState().currentExerciseIndex).toBe(1);
    });

    it('decrements exercise index but not below 0', () => {
      useWorkoutSessionStore.setState({ currentExerciseIndex: 2 });
      useWorkoutSessionStore.getState().previousExercise();
      expect(useWorkoutSessionStore.getState().currentExerciseIndex).toBe(1);

      useWorkoutSessionStore.setState({ currentExerciseIndex: 0 });
      useWorkoutSessionStore.getState().previousExercise();
      expect(useWorkoutSessionStore.getState().currentExerciseIndex).toBe(0);
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      // Create some completed sessions
      useWorkoutSessionStore.getState().startWorkout('w-1');
      useWorkoutSessionStore.getState().completeExercise('ex-1', 120);
      useWorkoutSessionStore.getState().endWorkout(3);

      useWorkoutSessionStore.getState().startWorkout('w-2');
      useWorkoutSessionStore.getState().completeExercise('ex-2', 180);
      useWorkoutSessionStore.getState().endWorkout(4);

      // And one abandoned session
      useWorkoutSessionStore.getState().startWorkout('w-3');
      useWorkoutSessionStore.getState().abandonWorkout();
    });

    it('selectCompletedWorkoutsCount counts only completed sessions', () => {
      const count = selectCompletedWorkoutsCount(useWorkoutSessionStore.getState());
      expect(count).toBe(2);
    });

    it('selectTotalMinutesExercised sums completed session durations', () => {
      const minutes = selectTotalMinutesExercised(useWorkoutSessionStore.getState());
      expect(minutes).toBe(5); // (120 + 180) / 60 = 5
    });

    it('selectRecentSessions returns sorted completed sessions', () => {
      const recent = selectRecentSessions(useWorkoutSessionStore.getState(), 5);
      expect(recent).toHaveLength(2);
      // Most recent first
      if (recent[0].completedAt && recent[1].completedAt) {
        expect(new Date(recent[0].completedAt).getTime())
          .toBeGreaterThanOrEqual(new Date(recent[1].completedAt).getTime());
      }
    });

    it('selectRecentSessions respects limit', () => {
      const recent = selectRecentSessions(useWorkoutSessionStore.getState(), 1);
      expect(recent).toHaveLength(1);
    });
  });
});
