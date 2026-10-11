import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { durableStorage } from '../lib/storage';
import type { UserProfile, UserPreferences, Trimester } from '../types';

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;

  // Actions
  setProfile: (profile: UserProfile) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateDueDate: (dueDate: Date) => void;
  updateDoctorApproved: (approved: boolean) => void;
  completeOnboarding: () => void;
  clearProfile: () => void;
}

// Calendar-day arithmetic avoids DST and time-of-day drift. Legacy display fields
// are retained for migration; eligibility uses the explicit stage status below.
export function calculatePregnancyInfo(dueDate: Date, today = new Date()): {
  currentWeek: number; currentTrimester: Trimester; status: 'pregnancy' | 'date-passed' | 'out-of-range' | 'unknown';
} {
  const date = new Date(dueDate);
  const day = (value: Date) => Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()) / 86400000;
  if (!Number.isFinite(date.getTime()) || !Number.isFinite(today.getTime())) {
    return { currentWeek: 0, currentTrimester: 1, status: 'unknown' };
  }
  const daysUntilDue = day(date) - day(today);
  const currentWeek = Math.max(1, Math.min(40, Math.floor((280 - daysUntilDue) / 7)));
  return {
    currentWeek,
    currentTrimester: currentWeek >= 28 ? 3 : currentWeek >= 14 ? 2 : 1,
    status: daysUntilDue < 0 ? 'date-passed' : daysUntilDue > 280 ? 'out-of-range' : 'pregnancy'
  };
}

export function parseCalendarDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(NaN);
  const [year, month, date] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, date);
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === date ? parsed : new Date(NaN);
}

const defaultPreferences: UserPreferences = {
  soundEnabled: true,
  vibrationEnabled: true,
  reminderDays: [1, 3, 5], // Mon, Wed, Fri
  preferredIntensity: 'low',
  preferredDuration: 15
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isOnboarded: false,

      setProfile: (profile) => set({ profile }),

      updatePreferences: (preferences) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              preferences: { ...currentProfile.preferences, ...preferences }
            }
          });
        }
      },

      updateDueDate: (dueDate) => {
        if (!Number.isFinite(dueDate.getTime())) return;
        const currentProfile = get().profile;
        if (currentProfile) {
          const { currentWeek, currentTrimester } = calculatePregnancyInfo(dueDate);
          set({
            profile: {
              ...currentProfile,
              dueDate,
              currentWeek,
              currentTrimester
            }
          });
        }
      },

      updateDoctorApproved: (approved) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: { ...currentProfile, doctorApproved: approved }
          });
        }
      },

      completeOnboarding: () => set({ isOnboarded: true }),

      clearProfile: () => set({ profile: null, isOnboarded: false })
    }),
    {
      skipHydration: true,
      storage: createJSONStorage(() => durableStorage),
      version: 1,
      migrate: (state) => state,
      name: 'prego-user-storage',
      partialize: (state) => ({
        profile: state.profile,
        isOnboarded: state.isOnboarded
      }),
      // Rehydrate dates that were serialized as strings in localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.profile?.dueDate && typeof state.profile.dueDate === 'string') {
          state.profile.dueDate = new Date(state.profile.dueDate);
        }
      }
    }
  )
);

// Helper hook to create a new profile
export function createUserProfile(data: {
  displayName: string;
  dueDate: Date;
  healthConditions?: string[];
  doctorApproved?: boolean;
}): UserProfile {
  const { currentWeek, currentTrimester } = calculatePregnancyInfo(data.dueDate);

  return {
    id: crypto.randomUUID(),
    displayName: data.displayName,
    dueDate: data.dueDate,
    currentWeek,
    currentTrimester,
    healthConditions: data.healthConditions || [],
    doctorApproved: data.doctorApproved || false,
    preferences: { ...defaultPreferences, reminderDays: [] }
  };
}
