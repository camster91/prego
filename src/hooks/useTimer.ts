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

  // Store config in a ref so timer callbacks always see the latest
  // without causing interval restarts when callbacks change
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  });

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
        configRef.current.onPhaseChange?.('complete');
        configRef.current.onWorkoutComplete?.();
        return {
          ...currentState,
          phase: 'complete',
          remainingSeconds: 0,
          isRunning: false
        };
      }

      const nextExercise = exercises[nextIndex];
      configRef.current.onPhaseChange?.('exercise');

      return {
        ...currentState,
        phase: 'exercise',
        currentExerciseIndex: nextIndex,
        totalSeconds: nextExercise.durationSeconds,
        remainingSeconds: nextExercise.durationSeconds
      };
    },
    []
  );

  const handlePhaseComplete = useCallback(
    (currentState: TimerState): TimerState => {
      const { phase, currentExerciseIndex } = currentState;
      const exercises = configRef.current.exercises;

      switch (phase) {
        case 'countdown': {
          const firstExercise = exercises[0];
          configRef.current.onPhaseChange?.('exercise');
          return {
            ...currentState,
            phase: 'exercise',
            totalSeconds: firstExercise.durationSeconds,
            remainingSeconds: firstExercise.durationSeconds
          };
        }

        case 'exercise': {
          configRef.current.onExerciseComplete?.(currentExerciseIndex);
          const currentExercise = exercises[currentExerciseIndex];

          if (currentExercise.restSeconds > 0) {
            configRef.current.onPhaseChange?.('rest');
            return {
              ...currentState,
              phase: 'rest',
              totalSeconds: currentExercise.restSeconds,
              remainingSeconds: currentExercise.restSeconds
            };
          }

          return moveToNextExercise(currentState, exercises);
        }

        case 'rest': {
          return moveToNextExercise(currentState, exercises);
        }

        default:
          return currentState;
      }
    },
    [moveToNextExercise]
  );

  // Timer tick — dependencies are stable (no config object)
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

        if (newRemaining <= 0) {
          return handlePhaseComplete(prev);
        }

        return { ...prev, remainingSeconds: newRemaining };
      });
    }, 100);

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
    const cfg = configRef.current;
    setState({
      phase: 'countdown',
      totalSeconds: cfg.countdownSeconds,
      remainingSeconds: cfg.countdownSeconds,
      currentExerciseIndex: 0,
      totalExercises: cfg.exercises.length,
      isRunning: false,
      isPaused: false
    });
  }, [clearTimer]);

  const goToExercise = useCallback(
    (index: number) => {
      const exercises = configRef.current.exercises;
      if (index < 0 || index >= exercises.length) return;

      const exercise = exercises[index];
      setState((prev) => ({
        ...prev,
        phase: 'exercise',
        currentExerciseIndex: index,
        totalSeconds: exercise.durationSeconds,
        remainingSeconds: exercise.durationSeconds
      }));
    },
    []
  );

  return { state, start, pause, resume, skip, reset, goToExercise };
}
