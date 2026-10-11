import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../hooks/useTimer';
import { durableStorage, flushStorage } from '../lib/storage';
import { StrictMode, createElement } from 'react';
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
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
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

    expect(onExerciseComplete).toHaveBeenCalledWith(0, true, 0);
  });
});

describe('timer lifecycle regressions', () => {
  afterEach(() => { vi.useRealTimers(); Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' }); });
  it('completes once under StrictMode and ignores repeated completion actions', () => {
    const done = vi.fn(); const exerciseDone = vi.fn();
    const { result } = renderHook(() => useTimer(createConfig({ exercises: [{ exerciseId: 'synthetic', name: 'Synthetic timer fixture', durationSeconds: 10, restSeconds: 0 }], onWorkoutComplete: done, onExerciseComplete: exerciseDone })), { wrapper: ({ children }) => createElement(StrictMode, {}, children) });
    act(() => result.current.skip()); act(() => result.current.skip()); act(() => result.current.skip());
    expect(done).toHaveBeenCalledTimes(1); expect(exerciseDone).toHaveBeenCalledTimes(1);
    expect(exerciseDone).toHaveBeenCalledWith(0, true, 0);
  });
  it('pauses when hidden and requires an explicit resume', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTimer(createConfig()));
    act(() => result.current.start());
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    const remaining = result.current.state.remainingSeconds;
    act(() => vi.advanceTimersByTime(60000));
    expect(result.current.state.isPaused).toBe(true); expect(result.current.state.remainingSeconds).toBe(remaining);
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(result.current.state.isPaused).toBe(true);
  });
  it('restores a checkpoint paused after relaunch and keeps repeated movements distinct', async () => {
    const config = createConfig({ persistenceKey: 'synthetic-session' });
    await durableStorage.setItem('prego-active-timer', JSON.stringify({ version: 1, key: 'synthetic-session', signature: 'ex-1:10:5|ex-2:15:0', state: { phase: 'exercise', totalSeconds: 15, remainingSeconds: 9, currentExerciseIndex: 1, totalExercises: 2, isRunning: true, isPaused: false } }));
    const hook = renderHook(() => useTimer(config));
    await act(async () => { await flushStorage(); await Promise.resolve(); });
    expect(hook.result.current.state).toMatchObject({ phase: 'exercise', currentExerciseIndex: 1, remainingSeconds: 9, isRunning: false, isPaused: true });
    hook.unmount(); await durableStorage.removeItem('prego-active-timer');
  });
  it('finishes an empty timer without dereferencing a missing movement', () => {
    const done = vi.fn(); const { result } = renderHook(() => useTimer(createConfig({ exercises: [], onWorkoutComplete: done })));
    act(() => result.current.start());
    expect(result.current.state.phase).toBe('complete'); expect(done).toHaveBeenCalledTimes(1);
  });
});
