import { describe, it, expect } from 'vitest';
import { calculatePregnancyInfo } from '../stores/userStore';

describe('calculatePregnancyInfo', () => {
  it('returns trimester 1 for early pregnancy (weeks 1-13)', () => {
    // Due date 35 weeks from now => current week = 40 - 35 = 5
    const dueDate = new Date(Date.now() + 35 * 7 * 24 * 60 * 60 * 1000);
    const result = calculatePregnancyInfo(dueDate);
    expect(result.currentWeek).toBe(5);
    expect(result.currentTrimester).toBe(1);
  });

  it('returns trimester 2 for mid pregnancy (weeks 14-27)', () => {
    // Due date 20 weeks from now => current week = 40 - 20 = 20
    const dueDate = new Date(Date.now() + 20 * 7 * 24 * 60 * 60 * 1000);
    const result = calculatePregnancyInfo(dueDate);
    expect(result.currentWeek).toBe(20);
    expect(result.currentTrimester).toBe(2);
  });

  it('returns trimester 3 for late pregnancy (weeks 28-40)', () => {
    // Due date 5 weeks from now => current week = 40 - 5 = 35
    const dueDate = new Date(Date.now() + 5 * 7 * 24 * 60 * 60 * 1000);
    const result = calculatePregnancyInfo(dueDate);
    expect(result.currentWeek).toBe(35);
    expect(result.currentTrimester).toBe(3);
  });

  it('clamps week to minimum of 1', () => {
    // Due date 50 weeks from now => would be week -10, clamped to 1
    const dueDate = new Date(Date.now() + 50 * 7 * 24 * 60 * 60 * 1000);
    const result = calculatePregnancyInfo(dueDate);
    expect(result.currentWeek).toBe(1);
    expect(result.currentTrimester).toBe(1);
  });

  it('clamps week to maximum of 40', () => {
    // Due date in the past => would be > 40, clamped to 40
    const dueDate = new Date(Date.now() - 5 * 7 * 24 * 60 * 60 * 1000);
    const result = calculatePregnancyInfo(dueDate);
    expect(result.currentWeek).toBe(40);
    expect(result.currentTrimester).toBe(3);
  });

  it('correctly identifies boundary between trimester 1 and 2 (week 13 vs 14)', () => {
    // Week 13 = trimester 1
    const dueDate13 = new Date(Date.now() + 27 * 7 * 24 * 60 * 60 * 1000);
    const result13 = calculatePregnancyInfo(dueDate13);
    expect(result13.currentWeek).toBe(13);
    expect(result13.currentTrimester).toBe(1);

    // Week 14 = trimester 2
    const dueDate14 = new Date(Date.now() + 26 * 7 * 24 * 60 * 60 * 1000);
    const result14 = calculatePregnancyInfo(dueDate14);
    expect(result14.currentWeek).toBe(14);
    expect(result14.currentTrimester).toBe(2);
  });

  it('correctly identifies boundary between trimester 2 and 3 (week 27 vs 28)', () => {
    // Week 27 = trimester 2
    const dueDate27 = new Date(Date.now() + 13 * 7 * 24 * 60 * 60 * 1000);
    const result27 = calculatePregnancyInfo(dueDate27);
    expect(result27.currentWeek).toBe(27);
    expect(result27.currentTrimester).toBe(2);

    // Week 28 = trimester 3
    const dueDate28 = new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000);
    const result28 = calculatePregnancyInfo(dueDate28);
    expect(result28.currentWeek).toBe(28);
    expect(result28.currentTrimester).toBe(3);
  });
});
