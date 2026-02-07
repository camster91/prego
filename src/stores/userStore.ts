import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, UserPreferences, Trimester } from '../types';

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;

  // Actions
  setProfile: (profile: UserProfile) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateDueDate: (dueDate: Date) => void;
  completeOnboarding: () => void;
  clearProfile: () => void;
}

// Calculate current week and trimester from due date
export function calculatePregnancyInfo(dueDate: Date): { currentWeek: number; currentTrimester: Trimester } {
  const today = new Date();
  const dueDateObj = new Date(dueDate);

  // Pregnancy is ~40 weeks from last menstrual period
  // Due date is 40 weeks from conception date
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksUntilDue = Math.ceil((dueDateObj.getTime() - today.getTime()) / msPerWeek);
  const currentWeek = Math.max(1, Math.min(40, 40 - weeksUntilDue));

  let currentTrimester: Trimester = 1;
  if (currentWeek > 27) {
    currentTrimester = 3;
  } else if (currentWeek > 13) {
    currentTrimester = 2;
  }

  return { currentWeek, currentTrimester };
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

      completeOnboarding: () => set({ isOnboarded: true }),

      clearProfile: () => set({ profile: null, isOnboarded: false })
    }),
    {
      name: 'prego-user-storage',
      partialize: (state) => ({
        profile: state.profile,
        isOnboarded: state.isOnboarded
      })
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
    preferences: defaultPreferences
  };
}
