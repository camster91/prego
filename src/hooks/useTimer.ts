import { useState, useCallback, useRef, useEffect } from 'react';
import type { TimerState, TimerConfig } from '../types';

export function useTimer(config: TimerConfig) {
  const [state, setState] = useState<TimerState>(() => ({
    phase: 'countdown',
    totalSeconds: config.countdownSeconds,
    remainingSeconds: config.countdownSeconds,
    currentExerciseIndex: 0,
    totalExercises: config.exercises.length,
    isRunning: false,
    isPaused: false
  }));

  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const moveToNextExercise = useCallback(
    (currentState: TimerState, exercises: TimerConfig['exercises']): TimerState => {
      const nextIndex = currentState.currentExerciseIndex + 1;

      if (nextIndex >= exercises.length) {
        // Workout complete
        config.onPhaseChange?.('complete');
        config.onWorkoutComplete?.();
        return {
          ...currentState,
          phase: 'complete',
          remainingSeconds: 0,
          isRunning: false
        };
      }

      // Start next exercise
      const nextExercise = exercises[nextIndex];
      config.onPhaseChange?.('exercise');

      return {
        ...currentState,
        phase: 'exercise',
        currentExerciseIndex: nextIndex,
        totalSeconds: nextExercise.durationSeconds,
        remainingSeconds: nextExercise.durationSeconds
      };
    },
    [config]
  );

  const handlePhaseComplete = useCallback(
    (currentState: TimerState): TimerState => {
      const { phase, currentExerciseIndex } = currentState;
      const exercises = config.exercises;

      switch (phase) {
        case 'countdown': {
          // Start first exercise
          const firstExercise = exercises[0];
          config.onPhaseChange?.('exercise');
          return {
            ...currentState,
            phase: 'exercise',
            totalSeconds: firstExercise.durationSeconds,
            remainingSeconds: firstExercise.durationSeconds
          };
        }

        case 'exercise': {
          config.onExerciseComplete?.(currentExerciseIndex);
          const currentExercise = exercises[currentExerciseIndex];

          // Check if there's rest time
          if (currentExercise.restSeconds > 0) {
            config.onPhaseChange?.('rest');
            return {
              ...currentState,
              phase: 'rest',
              totalSeconds: currentExercise.restSeconds,
              remainingSeconds: currentExercise.restSeconds
            };
          }

          // No rest, go to next exercise or complete
          return moveToNextExercise(currentState, exercises);
        }

        case 'rest': {
          return moveToNextExercise(currentState, exercises);
        }

        default:
          return currentState;
      }
    },
    [config, moveToNextExercise]
  );

  // Timer tick
  useEffect(() => {
    if (!state.isRunning || state.isPaused) {
      clearTimer();
      return;
    }

    lastTickRef.current = Date.now();

    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setState((prev) => {
        if (!prev.isRunning || prev.isPaused) return prev;

        const newRemaining = Math.max(0, prev.remainingSeconds - elapsed);

        // Handle phase transitions
        if (newRemaining <= 0) {
          return handlePhaseComplete(prev);
        }

        return { ...prev, remainingSeconds: newRemaining };
      });
    }, 100); // Update every 100ms for smooth display

    return clearTimer;
  }, [state.isRunning, state.isPaused, handlePhaseComplete, clearTimer]);

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true, isPaused: false }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    lastTickRef.current = Date.now();
    setState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  const skip = useCallback(() => {
    setState((prev) => handlePhaseComplete(prev));
  }, [handlePhaseComplete]);

  const reset = useCallback(() => {
    clearTimer();
    setState({
      phase: 'countdown',
      totalSeconds: config.countdownSeconds,
      remainingSeconds: config.countdownSeconds,
      currentExerciseIndex: 0,
      totalExercises: config.exercises.length,
      isRunning: false,
      isPaused: false
    });
  }, [config, clearTimer]);

  const goToExercise = useCallback(
    (index: number) => {
      if (index < 0 || index >= config.exercises.length) return;

      const exercise = config.exercises[index];
      setState((prev) => ({
        ...prev,
        phase: 'exercise',
        currentExerciseIndex: index,
        totalSeconds: exercise.durationSeconds,
        remainingSeconds: exercise.durationSeconds
      }));
    },
    [config.exercises]
  );

  return { state, start, pause, resume, skip, reset, goToExercise };
}
