import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { useUserStore, useWorkoutSessionStore } from "../stores";
import { flushStorage, storageHealth } from "./storage";
import type { UserProfile, WorkoutSession } from "../types";
import { replaceDataRecords } from "./storageTransaction";

export interface Backup {
  format: "prego-backup";
  version: 1;
  exportedAt: string;
  profile: UserProfile | null;
  isOnboarded: boolean;
  completedSessions: WorkoutSession[];
}
export function createBackup(): Backup {
  const user = useUserStore.getState();
  return {
    format: "prego-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: user.profile,
    isOnboarded: user.isOnboarded,
    completedSessions: useWorkoutSessionStore.getState().completedSessions,
  };
}
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const date = (value: unknown) =>
  typeof value === "string" && Number.isFinite(Date.parse(value));
const strings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");
export function parseBackup(text: string): Backup {
  if (text.length > 5_000_000)
    throw new Error("Backup is too large. Maximum size is 5 MB.");
  const data: unknown = JSON.parse(text);
  if (
    !record(data) ||
    data.format !== "prego-backup" ||
    data.version !== 1 ||
    typeof data.isOnboarded !== "boolean" ||
    !date(data.exportedAt) ||
    !Array.isArray(data.completedSessions)
  )
    throw new Error("This is not a supported Prego backup.");
  let profile: UserProfile | null = null;
  if (data.profile !== null) {
    const value = data.profile;
    if (
      !record(value) ||
      typeof value.id !== "string" ||
      typeof value.displayName !== "string" ||
      value.displayName.length > 100 ||
      !date(value.dueDate) ||
      !strings(value.healthConditions) ||
      typeof value.doctorApproved !== "boolean" ||
      !record(value.preferences)
    )
      throw new Error("The backup profile is invalid.");
    const prefs = value.preferences;
    if (
      typeof prefs.soundEnabled !== "boolean" ||
      typeof prefs.vibrationEnabled !== "boolean" ||
      !["low", "moderate", "high"].includes(String(prefs.preferredIntensity)) ||
      typeof prefs.preferredDuration !== "number" ||
      prefs.preferredDuration < 5 ||
      prefs.preferredDuration > 30 ||
      !Array.isArray(prefs.reminderDays) ||
      !prefs.reminderDays.every(
        (day) => Number.isInteger(day) && day >= 0 && day <= 6,
      )
    )
      throw new Error("The backup preferences are invalid.");
    profile = {
      id: value.id,
      displayName: value.displayName,
      dueDate: new Date(String(value.dueDate)),
      currentWeek: 0,
      currentTrimester: 1,
      healthConditions: value.healthConditions,
      doctorApproved: value.doctorApproved,
      preferences: {
        soundEnabled: prefs.soundEnabled,
        vibrationEnabled: prefs.vibrationEnabled,
        preferredIntensity:
          prefs.preferredIntensity as UserProfile["preferences"]["preferredIntensity"],
        preferredDuration: prefs.preferredDuration,
        reminderDays: prefs.reminderDays,
        ...(typeof prefs.reminderTime === "string" &&
        /^([01]\d|2[0-3]):[0-5]\d$/.test(prefs.reminderTime)
          ? { reminderTime: prefs.reminderTime }
          : {}),
      },
    };
  }
  if (data.isOnboarded && !profile)
    throw new Error("The backup is missing its profile.");
  const sessions = data.completedSessions.map(
    (value: unknown): WorkoutSession => {
      if (
        !record(value) ||
        typeof value.id !== "string" ||
        typeof value.workoutPlanId !== "string" ||
        !date(value.startedAt) ||
        !date(value.completedAt) ||
        !["completed", "abandoned"].includes(String(value.status)) ||
        typeof value.totalDurationSeconds !== "number" ||
        !Number.isFinite(value.totalDurationSeconds) ||
        value.totalDurationSeconds < 0 ||
        !Array.isArray(value.exercisesCompleted)
      )
        throw new Error("The backup history is invalid.");
      const exercisesCompleted = value.exercisesCompleted.map((ex: unknown) => {
        if (
          !record(ex) ||
          typeof ex.exerciseId !== "string" ||
          !date(ex.completedAt) ||
          typeof ex.actualDurationSeconds !== "number" ||
          !Number.isFinite(ex.actualDurationSeconds) ||
          ex.actualDurationSeconds < 0 ||
          typeof ex.skipped !== "boolean"
        )
          throw new Error("An exercise record is invalid.");
        return {
          exerciseId: ex.exerciseId,
          completedAt: new Date(String(ex.completedAt)),
          actualDurationSeconds: ex.actualDurationSeconds,
          skipped: ex.skipped,
          ...(Number.isInteger(ex.sequenceIndex) &&
          Number(ex.sequenceIndex) >= 0
            ? { sequenceIndex: Number(ex.sequenceIndex) }
            : {}),
        };
      });
      return {
        id: value.id,
        workoutPlanId: value.workoutPlanId,
        startedAt: new Date(String(value.startedAt)),
        completedAt: new Date(String(value.completedAt)),
        totalDurationSeconds: value.totalDurationSeconds,
        status: value.status as WorkoutSession["status"],
        exercisesCompleted,
        ...(Number.isInteger(value.perceivedDifficulty) &&
        Number(value.perceivedDifficulty) >= 1 &&
        Number(value.perceivedDifficulty) <= 5
          ? {
              perceivedDifficulty: value.perceivedDifficulty as
                | 1
                | 2
                | 3
                | 4
                | 5,
            }
          : {}),
        ...(typeof value.notes === "string" && value.notes.length <= 10000
          ? { notes: value.notes }
          : {}),
      };
    },
  );
  if (new Set(sessions.map((session) => session.id)).size !== sessions.length)
    throw new Error("The backup contains duplicate session IDs.");
  return {
    format: "prego-backup",
    version: 1,
    exportedAt: String(data.exportedAt),
    profile,
    isOnboarded: data.isOnboarded,
    completedSessions: sessions,
  };
}
export async function exportBackup() {
  const data = JSON.stringify(createBackup(), null, 2);
  if (Capacitor.isNativePlatform()) {
    const result = await Filesystem.writeFile({
      path: "prego-backup.json",
      directory: Directory.Cache,
      data,
      encoding: Encoding.UTF8,
    });
    try {
      await Share.share({
        title: "Prego backup",
        url: result.uri,
        dialogTitle: "Save your private backup",
      });
    } finally {
      await Filesystem.deleteFile({
        path: "prego-backup.json",
        directory: Directory.Cache,
      });
    }
  } else {
    const url = URL.createObjectURL(
      new Blob([data], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "prego-backup.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
export async function restoreBackup(backup: Backup) {
  // Revalidate at the API boundary; callers cannot bypass file validation.
  const validated = parseBackup(JSON.stringify(backup));
  await flushStorage();
  const user = { profile: validated.profile, isOnboarded: validated.isOnboarded };
  const sessions = { currentSession: null, currentExerciseIndex: 0, isPaused: false, completedSessions: validated.completedSessions };
  await replaceDataRecords({
    "prego-user-storage": JSON.stringify({ state: user, version: 1 }),
    "prego-workout-session-storage": JSON.stringify({ state: sessions, version: 1 }),
    "prego-active-timer": null,
  });
  updateMemory(user, sessions);
}
function updateMemory(
  user: Pick<ReturnType<typeof useUserStore.getState>, 'profile' | 'isOnboarded'>,
  sessions: Pick<ReturnType<typeof useWorkoutSessionStore.getState>, 'currentSession' | 'currentExerciseIndex' | 'isPaused' | 'completedSessions'>,
) {
  // The transaction already wrote and verified these values. Avoid duplicate
  // background writes (especially recreating records after full deletion).
  const userStorage = useUserStore.persist.getOptions().storage;
  const sessionStorage = useWorkoutSessionStore.persist.getOptions().storage;
  const memoryOnly = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  useUserStore.persist.setOptions({ storage: memoryOnly });
  useWorkoutSessionStore.persist.setOptions({ storage: memoryOnly });
  try {
    useUserStore.setState(user);
    useWorkoutSessionStore.setState(sessions);
  } finally {
    useUserStore.persist.setOptions({ storage: userStorage });
    useWorkoutSessionStore.persist.setOptions({ storage: sessionStorage });
  }
}
export async function deleteLocalData() {
  await flushStorage();
  await replaceDataRecords({ "prego-user-storage": null, "prego-workout-session-storage": null, "prego-active-timer": null });
  updateMemory({ profile: null, isOnboarded: false }, { currentSession: null, currentExerciseIndex: 0, isPaused: false, completedSessions: [] });
  if (Capacitor.isNativePlatform()) {
    try {
      await Filesystem.deleteFile({
        path: "prego-backup.json",
        directory: Directory.Cache,
      });
    } catch {
      /* An export may not exist. */
    }
  }
  storageHealth.report(null);
}
