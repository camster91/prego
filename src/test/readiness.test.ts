import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { calculatePregnancyInfo, parseCalendarDate, createUserProfile, useUserStore } from '../stores/userStore';
import { useWorkoutSessionStore } from '../stores';
import { parseBackup, createBackup, deleteLocalData, restoreBackup } from '../lib/dataControls';
import { durableStorage, flushStorage } from '../lib/storage';
import { workoutAvailability, exerciseApprovals, workoutApprovals } from '../lib/contentReview';
import { workoutPlans } from '../data/workouts';
describe('release correctness', () => {
  beforeEach(async () => { await deleteLocalData(); });
  afterEach(() => { vi.useRealTimers(); });
  it('uses calendar dates across daylight saving and leap days', () => {
    expect(calculatePregnancyInfo(parseCalendarDate('2027-03-14'), parseCalendarDate('2026-10-11')).currentWeek).toBe(18);
    const morning = new Date(2028, 1, 29, 1); const evening = new Date(2028, 1, 29, 23);
    expect(calculatePregnancyInfo(parseCalendarDate('2028-08-01'), morning)).toEqual(calculatePregnancyInfo(parseCalendarDate('2028-08-01'), evening));
    expect(Number.isNaN(parseCalendarDate('2027-02-29').getTime())).toBe(true);
  });
  it('does not infer pregnancy/postpartum or eligibility from invalid/passed dates', () => {
    expect(calculatePregnancyInfo(new Date(NaN)).status).toBe('unknown');
    expect(calculatePregnancyInfo(new Date(2020, 0, 1)).status).toBe('date-passed');
    expect(calculatePregnancyInfo(new Date(2040, 0, 1)).status).toBe('out-of-range');
    expect(workoutAvailability(workoutPlans[0], null).available).toBe(false);
  });
  it('fails closed even with content approvals until screening rules exist', () => {
    const approval = { status: 'approved' as const, reviewer: 'Test fixture', reviewedAt: '2026-10-11', evidence: ['Test fixture only'], version: 1 };
    const workout = workoutPlans[0];
    workoutApprovals[workout.id] = approval;
    workout.exercises.forEach(exercise => { exerciseApprovals[exercise.exerciseId] = approval; });
    const profile = createUserProfile({ displayName: 'Test', dueDate: new Date(Date.now() + 100 * 86400000), doctorApproved: true });
    expect(workoutAvailability(workout, profile)).toMatchObject({ available: false, reason: expect.stringContaining('screening') });
    delete workoutApprovals[workout.id]; workout.exercises.forEach(exercise => { delete exerciseApprovals[exercise.exerciseId]; });
  });
  it('exports and restores a versioned profile/history without duplicate IDs', async () => {
    useUserStore.getState().setProfile(createUserProfile({ displayName: 'Alex', dueDate: new Date(Date.now() + 100 * 86400000) }));
    useUserStore.getState().completeOnboarding();
    useWorkoutSessionStore.getState().startWorkout('quick-stretch');
    useWorkoutSessionStore.getState().completeExercise('cat-cow', 30);
    useWorkoutSessionStore.getState().endWorkout();
    const backup = parseBackup(JSON.stringify(createBackup()));
    await deleteLocalData(); await restoreBackup(backup); await restoreBackup(backup);
    expect(useUserStore.getState().profile?.displayName).toBe('Alex');
    expect(useWorkoutSessionStore.getState().completedSessions).toHaveLength(1);
    expect(useUserStore.getState().profile?.dueDate).toBeInstanceOf(Date);
  });
  it('rejects unsupported versions and corrupt records before mutation', () => {
    expect(() => parseBackup('{"format":"prego-backup","version":99}')).toThrow();
    const backup = createBackup();
    expect(() => parseBackup(JSON.stringify({ ...backup, completedSessions: [{ id: 'bad' }] }))).toThrow();
    expect(useWorkoutSessionStore.getState().completedSessions).toEqual([]);
  });
  it('reset clears profile, history, active session, timer and shadow copies', async () => {
    useWorkoutSessionStore.getState().startWorkout('quick-stretch');
    await durableStorage.setItem('prego-active-timer', JSON.stringify({ test: true }));
    await flushStorage(); await deleteLocalData();
    expect(useUserStore.getState().profile).toBeNull();
    expect(useWorkoutSessionStore.getState().currentSession).toBeNull();
    expect(useWorkoutSessionStore.getState().completedSessions).toEqual([]);
    expect(Object.keys(localStorage).filter(key => key.startsWith('prego-'))).toEqual([]);
  });
  it('recovers a corrupt primary record from a valid local copy', async () => {
    localStorage.setItem('test-recovery', 'bad-json');
    localStorage.setItem('test-recovery::shadow', '{"version":1}');
    expect(await durableStorage.getItem('test-recovery')).toBe('{"version":1}');
    await durableStorage.removeItem('test-recovery');
  });
});
