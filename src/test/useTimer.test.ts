import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../hooks/useTimer';
import type { TimerConfig } from '../types';

function createConfig(overrides: Partial<TimerConfig> = {}): TimerConfig {
  return {
    countdownSeconds: 3,
    exercises: [
      { exerciseId: 'ex-1', name: 'Exercise 1', durationSeconds: 10, restSeconds: 5 },
      { exerciseId: 'ex-2', name: 'Exercise 2', durationSeconds: 15, restSeconds: 0 }
    ],
    ...overrides
  };
}

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with countdown phase', () => {
    const config = createConfig();
    const { result } = renderHook(() => useTimer(config));

    expect(result.current.state.phase).toBe('countdown');
    expect(result.current.state.remainingSeconds).toBe(3);
    expect(result.current.state.isRunning).toBe(false);
    expect(result.current.state.currentExerciseIndex).toBe(0);
    expect(result.current.state.totalExercises).toBe(2);
  });

  it('starts timer when start is called', () => {
    const config = createConfig();
    const { result } = renderHook(() => useTimer(config));

    act(() => {
      result.current.start();
    });

    expect(result.current.state.isRunning).toBe(true);
    expect(result.current.state.isPaused).toBe(false);
  });

  it('pauses and resumes', () => {
    const config = createConfig();
    const { result } = renderHook(() => useTimer(config));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.pause();
    });
    expect(result.current.state.isPaused).toBe(true);

    act(() => {
      result.current.resume();
    });
    expect(result.current.state.isPaused).toBe(false);
  });

  it('resets timer back to initial state', () => {
    const config = createConfig();
    const { result } = renderHook(() => useTimer(config));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.state.phase).toBe('countdown');
    expect(result.current.state.remainingSeconds).toBe(3);
    expect(result.current.state.isRunning).toBe(false);
    expect(result.current.state.currentExerciseIndex).toBe(0);
  });

  it('goToExercise changes to specific exercise', () => {
    const config = createConfig();
    const { result } = renderHook(() => useTimer(config));

    act(() => {
      result.current.goToExercise(1);
    });

    expect(result.current.state.phase).toBe('exercise');
    expect(result.current.state.currentExerciseIndex).toBe(1);
    expect(result.current.state.totalSeconds).toBe(15);
  });

  it('goToExercise ignores out-of-bounds index', () => {
    const config = createConfig();
    const { result } = renderHook(() => useTimer(config));

    act(() => {
      result.current.goToExercise(-1);
    });
    expect(result.current.state.currentExerciseIndex).toBe(0);

    act(() => {
      result.current.goToExercise(99);
    });
    expect(result.current.state.currentExerciseIndex).toBe(0);
  });

  it('skip advances through phases', () => {
    const config = createConfig();
    const { result } = renderHook(() => useTimer(config));

    // Skip countdown -> exercise phase
    act(() => {
      result.current.skip();
    });
    expect(result.current.state.phase).toBe('exercise');
    expect(result.current.state.currentExerciseIndex).toBe(0);
    expect(result.current.state.totalSeconds).toBe(10);
  });

  it('handles empty exercises list', () => {
    const config = createConfig({ exercises: [] });
    const { result } = renderHook(() => useTimer(config));

    expect(result.current.state.phase).toBe('countdown');
    expect(result.current.state.totalExercises).toBe(0);
  });

  it('calls onPhaseChange callback', () => {
    const onPhaseChange = vi.fn();
    const config = createConfig({ onPhaseChange });
    const { result } = renderHook(() => useTimer(config));

    // Skip countdown -> should call onPhaseChange with 'exercise'
    act(() => {
      result.current.skip();
    });
    expect(onPhaseChange).toHaveBeenCalledWith('exercise');
  });

  it('calls onExerciseComplete when exercise finishes', () => {
    const onExerciseComplete = vi.fn();
    const config = createConfig({ onExerciseComplete });
    const { result } = renderHook(() => useTimer(config));

    // Skip countdown
    act(() => {
      result.current.skip();
    });

    // Skip first exercise
    act(() => {
      result.current.skip();
    });

    expect(onExerciseComplete).toHaveBeenCalledWith(0);
  });
});
