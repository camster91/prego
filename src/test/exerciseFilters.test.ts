import { describe, it, expect } from 'vitest';
import { filterExercises, exercises, getExerciseById } from '../data/exercises';

describe('filterExercises', () => {
  it('returns all exercises when no filters applied', () => {
    const result = filterExercises({});
    expect(result.length).toBe(exercises.length);
  });

  it('filters by trimester correctly', () => {
    const trimester1 = filterExercises({ trimester: 1 });
    const trimester2 = filterExercises({ trimester: 2 });
    const trimester3 = filterExercises({ trimester: 3 });

    // All results should be safe for the given trimester
    trimester1.forEach((ex) => {
      expect(ex.safeTrmesters).toContain(1);
    });
    trimester2.forEach((ex) => {
      expect(ex.safeTrmesters).toContain(2);
    });
    trimester3.forEach((ex) => {
      expect(ex.safeTrmesters).toContain(3);
    });
  });

  it('filters by category correctly', () => {
    const strengthExercises = filterExercises({ category: 'strength' });
    strengthExercises.forEach((ex) => {
      expect(ex.category).toBe('strength');
    });
    expect(strengthExercises.length).toBeGreaterThan(0);
  });

  it('filters by intensity correctly', () => {
    const lowIntensity = filterExercises({ intensity: 'low' });
    lowIntensity.forEach((ex) => {
      expect(ex.intensity).toBe('low');
    });
    expect(lowIntensity.length).toBeGreaterThan(0);
  });

  it('filters by search query (name)', () => {
    const result = filterExercises({ searchQuery: 'Kegel' });
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toContain('Kegel');
  });

  it('filters by search query (description)', () => {
    const result = filterExercises({ searchQuery: 'pelvic floor' });
    expect(result.length).toBeGreaterThan(0);
  });

  it('search is case-insensitive', () => {
    const upper = filterExercises({ searchQuery: 'SQUAT' });
    const lower = filterExercises({ searchQuery: 'squat' });
    expect(upper.length).toBe(lower.length);
  });

  it('combines multiple filters (AND logic)', () => {
    const result = filterExercises({
      trimester: 3,
      intensity: 'low'
    });
    result.forEach((ex) => {
      expect(ex.safeTrmesters).toContain(3);
      expect(ex.intensity).toBe('low');
    });
  });

  it('returns empty array when no exercises match', () => {
    const result = filterExercises({ searchQuery: 'nonexistent_exercise_xyz' });
    expect(result.length).toBe(0);
  });

  it('excludes exercises not safe for trimester 3', () => {
    // Bird Dog is only safe for trimesters 1 and 2
    const trimester3 = filterExercises({ trimester: 3 });
    const birdDogInResults = trimester3.find((ex) => ex.id === 'bird-dog');
    expect(birdDogInResults).toBeUndefined();
  });
});

describe('getExerciseById', () => {
  it('returns the correct exercise by ID', () => {
    const exercise = getExerciseById('kegel-basic');
    expect(exercise).toBeDefined();
    expect(exercise?.name).toBe('Basic Kegels');
  });

  it('returns undefined for invalid ID', () => {
    const exercise = getExerciseById('nonexistent');
    expect(exercise).toBeUndefined();
  });

  it('all exercises have required safety fields', () => {
    exercises.forEach((ex) => {
      expect(ex.safeTrmesters.length).toBeGreaterThan(0);
      expect(ex.contraindications).toBeDefined();
      expect(ex.modifications).toBeDefined();
      expect(ex.intensity).toBeDefined();
      expect(['low', 'moderate', 'high']).toContain(ex.intensity);
    });
  });
});
