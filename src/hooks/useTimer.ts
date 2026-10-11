import { useState, useCallback, useRef, useEffect } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import type { TimerState, TimerConfig } from "../types";
import { durableStorage } from "../lib/storage";

const initial = (config: TimerConfig): TimerState => ({
  phase: "countdown",
  totalSeconds: config.countdownSeconds,
  remainingSeconds: config.countdownSeconds,
  currentExerciseIndex: 0,
  totalExercises: config.exercises.length,
  isRunning: false,
  isPaused: false,
});
export function useTimer(config: TimerConfig) {
  const [state, setState] = useState<TimerState>(() => initial(config));
  const [isRestoring, setIsRestoring] = useState(!!config.persistenceKey);
  const stateRef = useRef(state);
  const configRef = useRef(config);
  const lastTick = useRef(0);
  const restoredKey = useRef<string | undefined>(undefined);
  const lastSaved = useRef("");
  const persist = useCallback((next: TimerState, force = false) => {
    const current = configRef.current;
    if (!current.persistenceKey) return;
    const signature = `${current.persistenceKey}:${next.phase}:${next.currentExerciseIndex}:${Math.ceil(next.remainingSeconds)}:${next.isPaused}:${next.isRunning}`;
    if (!force && signature === lastSaved.current) return;
    lastSaved.current = signature;
    void durableStorage.setItem(
      "prego-active-timer",
      JSON.stringify({
        version: 1,
        key: current.persistenceKey,
        signature: current.exercises
          .map(
            (ex) => `${ex.exerciseId}:${ex.durationSeconds}:${ex.restSeconds}`,
          )
          .join("|"),
        state: { ...next, isPaused: next.phase !== "complete" },
      }),
    );
  }, []);
  const commit = useCallback(
    (next: TimerState) => {
      stateRef.current = next;
      setState(next);
      persist(next);
    },
    [persist],
  );
  useEffect(() => {
    configRef.current = config;
  });
  useEffect(() => {
    if (!config.persistenceKey) return;
    let canceled = false;
    const restore = async () => {
      try {
        const text = await durableStorage.getItem("prego-active-timer");
        if (!text || canceled) return;
        const saved = JSON.parse(text);
        const candidate: TimerState = saved.state;
        const signature = config.exercises
          .map(
            (ex) => `${ex.exerciseId}:${ex.durationSeconds}:${ex.restSeconds}`,
          )
          .join("|");
        const validPhase = [
          "countdown",
          "exercise",
          "rest",
          "complete",
        ].includes(candidate?.phase);
        const index = candidate?.currentExerciseIndex;
        const exercise = config.exercises[index];
        const expectedDuration =
          candidate?.phase === "countdown"
            ? config.countdownSeconds
            : candidate?.phase === "rest"
              ? exercise?.restSeconds
              : candidate?.phase === "exercise"
                ? exercise?.durationSeconds
                : candidate?.totalSeconds;
        if (
          saved.version === 1 &&
          saved.key === config.persistenceKey &&
          saved.signature === signature &&
          validPhase &&
          Number.isInteger(index) &&
          index >= 0 &&
          index < config.exercises.length &&
          candidate.totalExercises === config.exercises.length &&
          candidate.totalSeconds === expectedDuration &&
          Number.isFinite(candidate.remainingSeconds) &&
          candidate.remainingSeconds >= 0 &&
          candidate.remainingSeconds <= candidate.totalSeconds
        ) {
          commit({
            ...candidate,
            isRunning: false,
            isPaused: candidate.phase !== "complete",
          });
        }
      } catch {
        /* Storage reports failures; preserve current timer state. */
      } finally {
        if (!canceled) {
          restoredKey.current = config.persistenceKey;
          setIsRestoring(false);
        }
      }
    };
    void restore();
    return () => {
      canceled = true;
    };
    // The identity changes only when a new session starts, never on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.persistenceKey, commit]);
  const advance = useCallback(
    (skipped = false) => {
      const current = stateRef.current;
      const cfg = configRef.current;
      if (current.phase === "complete") return;
      const exercise = cfg.exercises[current.currentExerciseIndex];
      let next = current;
      if (!exercise)
        next = {
          ...current,
          phase: "complete",
          isRunning: false,
          isPaused: false,
          remainingSeconds: 0,
        };
      else if (current.phase === "countdown")
        next = {
          ...current,
          phase: "exercise",
          totalSeconds: exercise.durationSeconds,
          remainingSeconds: exercise.durationSeconds,
        };
      else if (current.phase === "exercise" && exercise.restSeconds > 0)
        next = {
          ...current,
          phase: "rest",
          totalSeconds: exercise.restSeconds,
          remainingSeconds: exercise.restSeconds,
        };
      else {
        const nextIndex = current.currentExerciseIndex + 1;
        const nextExercise = cfg.exercises[nextIndex];
        next = nextExercise
          ? {
              ...current,
              phase: "exercise",
              currentExerciseIndex: nextIndex,
              totalSeconds: nextExercise.durationSeconds,
              remainingSeconds: nextExercise.durationSeconds,
            }
          : {
              ...current,
              phase: "complete",
              isRunning: false,
              isPaused: false,
              remainingSeconds: 0,
            };
      }
      lastTick.current = performance.now();
      commit(next);
      // Effects happen after the committed transition, never in a React updater.
      if (current.phase === "exercise" && exercise)
        cfg.onExerciseComplete?.(
          current.currentExerciseIndex,
          skipped,
          skipped
            ? Math.max(0, exercise.durationSeconds - current.remainingSeconds)
            : exercise.durationSeconds,
        );
      if (
        next.phase !== current.phase ||
        next.currentExerciseIndex !== current.currentExerciseIndex
      )
        cfg.onPhaseChange?.(next.phase);
      if (next.phase === "complete") cfg.onWorkoutComplete?.();
    },
    [commit],
  );
  const pause = useCallback(() => {
    commit({ ...stateRef.current, isPaused: true });
  }, [commit]);
  useEffect(() => {
    const pauseIfHidden = () => {
      if (document.visibilityState === "hidden" && stateRef.current.isRunning)
        pause();
    };
    document.addEventListener("visibilitychange", pauseIfHidden);
    window.addEventListener("pagehide", pause);
    let disposed = false;
    let remove: (() => Promise<void>) | undefined;
    if (Capacitor.isNativePlatform())
      void App.addListener("appStateChange", ({ isActive }) => {
        if (!isActive && stateRef.current.isRunning) pause();
      }).then((listener) => {
        if (disposed) void listener.remove();
        else remove = () => listener.remove();
      });
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", pauseIfHidden);
      window.removeEventListener("pagehide", pause);
      void remove?.();
      persist(stateRef.current, true);
    };
  }, [pause, persist]);
  useEffect(() => {
    if (!state.isRunning || state.isPaused || isRestoring) return;
    lastTick.current = performance.now();
    const id = window.setInterval(() => {
      const current = stateRef.current;
      if (!current.isRunning || current.isPaused) return;
      const now = performance.now();
      const elapsed = (now - lastTick.current) / 1000;
      lastTick.current = now;
      // A stalled JS thread/background must never consume a whole movement.
      if (document.visibilityState === "hidden" || elapsed > 2) {
        pause();
        return;
      }
      const remainingSeconds = Math.max(0, current.remainingSeconds - elapsed);
      if (remainingSeconds === 0) advance();
      else commit({ ...current, remainingSeconds });
    }, 100);
    return () => clearInterval(id);
  }, [state.isRunning, state.isPaused, isRestoring, advance, pause, commit]);
  const start = useCallback(() => {
    if (
      isRestoring ||
      (configRef.current.persistenceKey &&
        restoredKey.current !== configRef.current.persistenceKey) ||
      stateRef.current.phase === "complete"
    )
      return;
    if (!configRef.current.exercises.length) {
      advance();
      return;
    }
    lastTick.current = performance.now();
    commit({ ...stateRef.current, isRunning: true, isPaused: false });
  }, [isRestoring, advance, commit]);
  const reset = useCallback(() => {
    commit(initial(configRef.current));
  }, [commit]);
  const goToExercise = useCallback(
    (index: number) => {
      const exercise = configRef.current.exercises[index];
      if (!Number.isInteger(index) || !exercise) return;
      lastTick.current = performance.now();
      commit({
        ...stateRef.current,
        phase: "exercise",
        currentExerciseIndex: index,
        totalSeconds: exercise.durationSeconds,
        remainingSeconds: exercise.durationSeconds,
      });
    },
    [commit],
  );
  return {
    state,
    isRestoring,
    start,
    pause,
    resume: start,
    skip: () => advance(true),
    reset,
    goToExercise,
  };
}
