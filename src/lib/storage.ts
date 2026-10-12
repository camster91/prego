import { Capacitor } from "@capacitor/core";
import {
  SecureStorage,
  KeychainAccess,
} from "@aparajita/capacitor-secure-storage";
import { Preferences } from "@capacitor/preferences";
import type { StateStorage } from "zustand/middleware";

const listeners = new Set<() => void>();
let message: string | null = null;
export const storageHealth = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => message,
  report: (value: string | null) => {
    message = value;
    listeners.forEach((listener) => listener());
  },
};
const read = async (key: string) => {
  if (!Capacitor.isNativePlatform()) return localStorage.getItem(key);
  const secure = await SecureStorage.get(key, false, false);
  if (secure !== null && typeof secure !== "string")
    throw new Error("Invalid secure record");
  // Both prior native preferences and the old webview store are migrated only after validation.
  return (
    secure ??
    (await Preferences.get({ key })).value ??
    localStorage.getItem(key)
  );
};
export function validateStoredRecord(key: string, text: string) {
  const parsed = JSON.parse(text);
  if (key === "prego-user-storage") {
    const state = parsed?.state;
    if (!state || typeof state.isOnboarded !== "boolean")
      throw new Error("Invalid profile storage");
    if (state.profile !== null) {
      const profile = state.profile;
      if (
        !profile ||
        typeof profile.id !== "string" ||
        typeof profile.displayName !== "string" ||
        !Number.isFinite(Date.parse(profile.dueDate)) ||
        !profile.preferences ||
        !Array.isArray(profile.healthConditions) ||
        typeof profile.preferences.soundEnabled !== "boolean" ||
        !Array.isArray(profile.preferences.reminderDays)
      )
        throw new Error("Invalid profile storage");
    }
  }
  if (key === "prego-workout-session-storage") {
    const state = parsed?.state;
    if (
      !state ||
      !Array.isArray(state.completedSessions) ||
      !Number.isInteger(state.currentExerciseIndex) ||
      typeof state.isPaused !== "boolean"
    )
      throw new Error("Invalid session storage");
    for (const session of [
      ...state.completedSessions,
      ...(state.currentSession ? [state.currentSession] : []),
    ]) {
      if (
        !session ||
        typeof session.id !== "string" ||
        typeof session.workoutPlanId !== "string" ||
        !Array.isArray(session.exercisesCompleted) ||
        !Number.isFinite(Date.parse(session.startedAt)) ||
        !Number.isFinite(session.totalDurationSeconds) ||
        session.totalDurationSeconds < 0
      )
        throw new Error("Invalid session storage");
      for (const exercise of session.exercisesCompleted)
        if (
          !exercise ||
          !Number.isFinite(Date.parse(exercise.completedAt)) ||
          typeof exercise.exerciseId !== "string" ||
          !Number.isFinite(exercise.actualDurationSeconds)
        )
          throw new Error("Invalid exercise storage");
    }
  }
}
const put = async (key: string, value: string) => {
  if (Capacitor.isNativePlatform())
    await SecureStorage.set(
      key,
      value,
      false,
      false,
      KeychainAccess.whenUnlockedThisDeviceOnly,
    );
  else localStorage.setItem(key, value);
};
const remove = async (key: string) => {
  if (Capacitor.isNativePlatform()) {
    await SecureStorage.remove(key, false);
    await Preferences.remove({ key });
  } else localStorage.removeItem(key);
};
const failedWrites = new Set<string>();
const queues = new Map<string, Promise<void>>();
function serial(key: string, operation: () => Promise<void>) {
  const task = (queues.get(key) ?? Promise.resolve())
    .catch(() => {})
    .then(operation);
  queues.set(key, task);
  return task;
}
export const durableStorage: StateStorage = {
  async getItem(key) {
    await queues.get(key)?.catch(() => {});
    try {
      const primary = await read(key);
      if (primary !== null) {
        validateStoredRecord(key, primary);
        if (Capacitor.isNativePlatform()) {
          if ((await SecureStorage.get(key, false, false)) === null) {
            await put(key, primary);
            await put(`${key}::shadow`, primary);
            if ((await SecureStorage.get(key, false, false)) !== primary)
              throw new Error("Migration verification failed");
          }
          await Preferences.remove({ key });
          await Preferences.remove({ key: `${key}::shadow` });
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}::shadow`);
        }
        return primary;
      }
      const backup = await read(`${key}::shadow`);
      if (backup !== null) {
        validateStoredRecord(key, backup);
        await put(key, backup);
        storageHealth.report(
          "Recovered a local data copy. Export a backup in You.",
        );
      }
      return backup;
    } catch {
      try {
        const backup = await read(`${key}::shadow`);
        if (backup !== null) {
          validateStoredRecord(key, backup);
          await put(key, backup);
          storageHealth.report(
            "Recovered a local data copy. Export a backup in You.",
          );
          return backup;
        }
      } catch {
        /* Report below; preserve corrupt values for explicit recovery. */
      }
      storageHealth.report(
        "Unable to read saved data. Your stored copy has been preserved. Try restoring an exported backup.",
      );
      throw new Error("Saved data unavailable");
    }
  },
  setItem(key, value) {
    return serial(key, async () => {
      try {
        await put(key, value);
        await put(`${key}::shadow`, value);
        failedWrites.delete(key);
      } catch {
        failedWrites.add(key);
        storageHealth.report(
          "Changes could not be saved. Keep the app open and export a backup in You.",
        );
      }
    });
  },
  removeItem(key) {
    return serial(key, async () => {
      await remove(key);
      await remove(`${key}::shadow`);
      if (Capacitor.isNativePlatform()) {
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}::shadow`);
      }
      failedWrites.delete(key);
    });
  },
};
export async function flushStorage() {
  await Promise.all([...queues.values()]);
  if (failedWrites.size)
    throw new Error(
      "Some changes could not be saved. Export your data and try again.",
    );
}

// Used by the journalled data-control transaction. Unlike normal background
// saves, these writes reject and verify before reporting success.
export const transactionStorage = {
  get: read,
  async set(key: string, value: string) {
    await put(key, value);
    if ((await read(key)) !== value) throw new Error("Saved copy verification failed");
  },
  async remove(key: string) {
    await remove(key);
    localStorage.removeItem(key);
    if ((await read(key)) !== null) throw new Error("Deletion verification failed");
  },
};
