import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore, createUserProfile, calculatePregnancyInfo } from '../stores/userStore';

describe('userStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      profile: null,
      isOnboarded: false
    });
  });

  describe('createUserProfile', () => {
    it('creates a profile with correct fields', () => {
      const dueDate = new Date(Date.now() + 20 * 7 * 24 * 60 * 60 * 1000);
      const profile = createUserProfile({
        displayName: 'Jane',
        dueDate,
        doctorApproved: true
      });

      expect(profile.id).toBeDefined();
      expect(profile.displayName).toBe('Jane');
      expect(profile.dueDate).toBe(dueDate);
      expect(profile.doctorApproved).toBe(true);
      expect(profile.healthConditions).toEqual([]);
      expect(profile.preferences.soundEnabled).toBe(true);
      expect(profile.currentWeek).toBeGreaterThanOrEqual(1);
      expect(profile.currentWeek).toBeLessThanOrEqual(40);
    });

    it('uses default values for optional fields', () => {
      const dueDate = new Date(Date.now() + 30 * 7 * 24 * 60 * 60 * 1000);
      const profile = createUserProfile({
        displayName: 'Test',
        dueDate
      });

      expect(profile.doctorApproved).toBe(false);
      expect(profile.healthConditions).toEqual([]);
    });
  });

  describe('setProfile', () => {
    it('stores a profile', () => {
      const dueDate = new Date(Date.now() + 20 * 7 * 24 * 60 * 60 * 1000);
      const profile = createUserProfile({ displayName: 'Jane', dueDate });

      useUserStore.getState().setProfile(profile);
      expect(useUserStore.getState().profile?.displayName).toBe('Jane');
    });
  });

  describe('completeOnboarding', () => {
    it('sets isOnboarded to true', () => {
      expect(useUserStore.getState().isOnboarded).toBe(false);
      useUserStore.getState().completeOnboarding();
      expect(useUserStore.getState().isOnboarded).toBe(true);
    });
  });

  describe('updatePreferences', () => {
    it('merges preferences into existing profile', () => {
      const dueDate = new Date(Date.now() + 20 * 7 * 24 * 60 * 60 * 1000);
      const profile = createUserProfile({ displayName: 'Jane', dueDate });
      useUserStore.getState().setProfile(profile);

      useUserStore.getState().updatePreferences({ soundEnabled: false });

      const updated = useUserStore.getState().profile;
      expect(updated?.preferences.soundEnabled).toBe(false);
      expect(updated?.preferences.vibrationEnabled).toBe(true); // unchanged
    });

    it('does nothing when no profile exists', () => {
      useUserStore.getState().updatePreferences({ soundEnabled: false });
      expect(useUserStore.getState().profile).toBeNull();
    });
  });

  describe('updateDueDate', () => {
    it('updates due date and recalculates week/trimester', () => {
      const originalDueDate = new Date(Date.now() + 30 * 7 * 24 * 60 * 60 * 1000);
      const profile = createUserProfile({ displayName: 'Jane', dueDate: originalDueDate });
      useUserStore.getState().setProfile(profile);

      const newDueDate = new Date(Date.now() + 5 * 7 * 24 * 60 * 60 * 1000);
      useUserStore.getState().updateDueDate(newDueDate);

      const updated = useUserStore.getState().profile;
      const expected = calculatePregnancyInfo(newDueDate);
      expect(updated?.currentWeek).toBe(expected.currentWeek);
      expect(updated?.currentTrimester).toBe(expected.currentTrimester);
    });
  });

  describe('clearProfile', () => {
    it('resets profile and onboarding state', () => {
      const dueDate = new Date(Date.now() + 20 * 7 * 24 * 60 * 60 * 1000);
      const profile = createUserProfile({ displayName: 'Jane', dueDate });
      useUserStore.getState().setProfile(profile);
      useUserStore.getState().completeOnboarding();

      useUserStore.getState().clearProfile();

      expect(useUserStore.getState().profile).toBeNull();
      expect(useUserStore.getState().isOnboarded).toBe(false);
    });
  });
});
