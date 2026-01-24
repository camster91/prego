import type { Exercise } from '../types';

export const exercises: Exercise[] = [
  // Pelvic Floor Exercises
  {
    id: 'kegel-basic',
    name: 'Basic Kegels',
    description: 'Strengthen your pelvic floor muscles with controlled contractions. Essential for pregnancy and postpartum recovery.',
    instructions: [
      'Find a comfortable seated or lying position',
      'Identify your pelvic floor muscles (imagine stopping urine flow)',
      'Squeeze and lift your pelvic floor muscles',
      'Hold for 5-10 seconds while breathing normally',
      'Release slowly and rest for 5-10 seconds',
      'Repeat 10-15 times'
    ],
    thumbnailUrl: '/images/exercises/kegel.jpg',
    videoUrl: 'https://www.youtube.com/embed/rsTdplBob5I',
    safeTrmesters: [1, 2, 3],
    contraindications: ['Active pelvic pain', 'Recent pelvic surgery'],
    modifications: [],
    category: 'pelvic-floor',
    targetMuscles: ['pelvic-floor'],
    intensity: 'low',
    defaultDurationSeconds: 60,
    equipmentRequired: []
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    description: 'Gentle spinal mobility exercise that helps relieve back tension and improves posture.',
    instructions: [
      'Start on hands and knees in tabletop position',
      'Inhale: Drop belly, lift chest and tailbone (Cow)',
      'Exhale: Round spine, tuck chin and tailbone (Cat)',
      'Move slowly and smoothly between positions',
      'Follow your breath throughout the movement'
    ],
    thumbnailUrl: '/images/exercises/cat-cow.jpg',
    videoUrl: 'https://www.youtube.com/embed/kqnua4rHVVA',
    safeTrmesters: [1, 2, 3],
    contraindications: ['Wrist injury', 'Severe back pain'],
    modifications: [
      {
        trimester: 3,
        description: 'Keep movements smaller and avoid deep backbends'
      }
    ],
    category: 'flexibility',
    targetMuscles: ['back', 'core'],
    intensity: 'low',
    defaultDurationSeconds: 60,
    equipmentRequired: ['yoga mat']
  },
  {
    id: 'prenatal-squat',
    name: 'Prenatal Squat',
    description: 'Build leg strength and prepare your body for labor with this modified squat.',
    instructions: [
      'Stand with feet wider than hip-width apart',
      'Turn toes slightly outward',
      'Hold onto a chair or wall for balance if needed',
      'Lower into a squat, keeping knees over toes',
      'Go only as low as comfortable',
      'Press through heels to stand back up'
    ],
    thumbnailUrl: '/images/exercises/squat.jpg',
    videoUrl: 'https://www.youtube.com/embed/xqvCmoLULNY',
    safeTrmesters: [1, 2, 3],
    contraindications: ['Placenta previa', 'Cervical insufficiency', 'Preterm labor risk'],
    modifications: [
      {
        trimester: 2,
        description: 'Use chair support for balance'
      },
      {
        trimester: 3,
        description: 'Reduce depth and always use support'
      }
    ],
    category: 'strength',
    targetMuscles: ['legs', 'glutes'],
    intensity: 'moderate',
    defaultDurationSeconds: 45,
    defaultReps: 10,
    defaultSets: 2,
    equipmentRequired: []
  },
  {
    id: 'wall-pushup',
    name: 'Wall Push-Up',
    description: 'Safe upper body strengthening exercise that avoids pressure on your belly.',
    instructions: [
      'Stand facing a wall, arm\'s length away',
      'Place palms flat on wall at shoulder height',
      'Bend elbows to lower chest toward wall',
      'Keep body in a straight line',
      'Push back to starting position',
      'Repeat 10-15 times'
    ],
    thumbnailUrl: '/images/exercises/wall-pushup.jpg',
    videoUrl: 'https://www.youtube.com/embed/a6YHbXD2XlU',
    safeTrmesters: [1, 2, 3],
    contraindications: ['Carpal tunnel syndrome', 'Shoulder injury'],
    modifications: [],
    category: 'strength',
    targetMuscles: ['arms', 'core'],
    intensity: 'low',
    defaultDurationSeconds: 45,
    defaultReps: 12,
    defaultSets: 2,
    equipmentRequired: []
  },
  {
    id: 'side-lying-leg-lift',
    name: 'Side-Lying Leg Lift',
    description: 'Strengthen hip and outer thigh muscles while lying comfortably on your side.',
    instructions: [
      'Lie on your side with bottom arm under head',
      'Keep hips stacked and body in a straight line',
      'Place top hand on floor in front for stability',
      'Slowly lift top leg toward ceiling',
      'Lower with control',
      'Complete reps, then switch sides'
    ],
    thumbnailUrl: '/images/exercises/leg-lift.jpg',
    videoUrl: 'https://www.youtube.com/embed/jgh6sGwtTwk',
    safeTrmesters: [1, 2, 3],
    contraindications: ['Hip pain', 'Symphysis pubis dysfunction'],
    modifications: [
      {
        trimester: 3,
        description: 'Place pillow between knees if uncomfortable'
      }
    ],
    category: 'strength',
    targetMuscles: ['glutes', 'legs'],
    intensity: 'low',
    defaultDurationSeconds: 60,
    defaultReps: 15,
    defaultSets: 2,
    equipmentRequired: ['yoga mat']
  },
  {
    id: 'prenatal-breathing',
    name: 'Deep Belly Breathing',
    description: 'Calming breathing exercise that reduces stress and promotes relaxation.',
    instructions: [
      'Sit comfortably or lie on your side',
      'Place one hand on chest, one on belly',
      'Inhale slowly through nose for 4 counts',
      'Feel belly rise while chest stays still',
      'Exhale slowly through mouth for 6 counts',
      'Feel belly gently fall',
      'Continue for 5-10 breaths'
    ],
    thumbnailUrl: '/images/exercises/breathing.jpg',
    videoUrl: 'https://www.youtube.com/embed/8VwufJrUhic',
    safeTrmesters: [1, 2, 3],
    contraindications: [],
    modifications: [],
    category: 'breathing',
    targetMuscles: ['core'],
    intensity: 'low',
    defaultDurationSeconds: 120,
    equipmentRequired: []
  },
  {
    id: 'seated-march',
    name: 'Seated Marching',
    description: 'Low-impact cardio exercise that gets your heart pumping while seated.',
    instructions: [
      'Sit on edge of sturdy chair, feet flat on floor',
      'Keep back straight and core engaged',
      'Lift right knee toward chest',
      'Lower and lift left knee',
      'Continue alternating in a marching motion',
      'Swing arms naturally with the movement'
    ],
    thumbnailUrl: '/images/exercises/seated-march.jpg',
    videoUrl: 'https://www.youtube.com/embed/3hVvmFxqpFI',
    safeTrmesters: [1, 2, 3],
    contraindications: ['Severe hip pain'],
    modifications: [],
    category: 'cardio',
    targetMuscles: ['legs', 'core'],
    intensity: 'low',
    defaultDurationSeconds: 60,
    equipmentRequired: ['chair']
  },
  {
    id: 'bird-dog',
    name: 'Bird Dog',
    description: 'Core stabilization exercise that strengthens back and improves balance.',
    instructions: [
      'Start on hands and knees in tabletop position',
      'Keep spine neutral and core engaged',
      'Slowly extend right arm forward and left leg back',
      'Hold for 3-5 seconds while balancing',
      'Return to start with control',
      'Repeat on opposite side'
    ],
    thumbnailUrl: '/images/exercises/bird-dog.jpg',
    videoUrl: 'https://www.youtube.com/embed/wiFNA3sqjCA',
    safeTrmesters: [1, 2],
    contraindications: ['Wrist pain', 'Balance issues'],
    modifications: [
      {
        trimester: 2,
        description: 'Keep range of motion smaller and move slowly'
      }
    ],
    category: 'balance',
    targetMuscles: ['core', 'back', 'glutes'],
    intensity: 'moderate',
    defaultDurationSeconds: 60,
    defaultReps: 10,
    equipmentRequired: ['yoga mat']
  },
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raises',
    description: 'Strengthen calf muscles and improve circulation in your legs.',
    instructions: [
      'Stand behind a chair, holding it for support',
      'Keep feet hip-width apart',
      'Slowly rise up onto balls of feet',
      'Hold at the top for 2 seconds',
      'Lower heels back down with control',
      'Repeat 15-20 times'
    ],
    thumbnailUrl: '/images/exercises/calf-raise.jpg',
    videoUrl: 'https://www.youtube.com/embed/gwLzBJYoWlI',
    safeTrmesters: [1, 2, 3],
    contraindications: ['Severe varicose veins', 'Balance issues without support'],
    modifications: [],
    category: 'strength',
    targetMuscles: ['legs'],
    intensity: 'low',
    defaultDurationSeconds: 45,
    defaultReps: 15,
    equipmentRequired: ['chair']
  },
  {
    id: 'shoulder-circles',
    name: 'Shoulder Circles',
    description: 'Release tension in shoulders and upper back with gentle circular movements.',
    instructions: [
      'Stand or sit with arms relaxed at sides',
      'Slowly roll shoulders forward in circles',
      'Complete 10 circles forward',
      'Reverse direction for 10 circles backward',
      'Keep movements smooth and controlled',
      'Breathe naturally throughout'
    ],
    thumbnailUrl: '/images/exercises/shoulder-circles.jpg',
    videoUrl: 'https://www.youtube.com/embed/QxM00W-hP4c',
    safeTrmesters: [1, 2, 3],
    contraindications: ['Shoulder injury'],
    modifications: [],
    category: 'flexibility',
    targetMuscles: ['back', 'arms'],
    intensity: 'low',
    defaultDurationSeconds: 45,
    equipmentRequired: []
  },
  {
    id: 'hip-circles',
    name: 'Hip Circles',
    description: 'Loosen hip joints and relieve lower back tension with gentle hip rotations.',
    instructions: [
      'Stand with feet hip-width apart',
      'Hold onto wall or chair for balance',
      'Place hands on hips',
      'Make slow circles with your hips',
      'Complete 10 circles in each direction',
      'Keep upper body stable'
    ],
    thumbnailUrl: '/images/exercises/hip-circles.jpg',
    videoUrl: 'https://www.youtube.com/embed/ea05VxDT3Pw',
    safeTrmesters: [1, 2, 3],
    contraindications: ['Severe pelvic pain', 'Symphysis pubis dysfunction'],
    modifications: [],
    category: 'flexibility',
    targetMuscles: ['glutes', 'core'],
    intensity: 'low',
    defaultDurationSeconds: 45,
    equipmentRequired: []
  },
  {
    id: 'prenatal-yoga-warrior',
    name: 'Modified Warrior II',
    description: 'Build leg strength and open hips with this standing yoga pose.',
    instructions: [
      'Stand with feet wide apart (about 4 feet)',
      'Turn right foot out 90 degrees, left foot slightly in',
      'Extend arms parallel to floor, palms down',
      'Bend right knee over ankle (not past toes)',
      'Gaze over right fingertips',
      'Hold for 30 seconds, then switch sides'
    ],
    thumbnailUrl: '/images/exercises/warrior.jpg',
    videoUrl: 'https://www.youtube.com/embed/Mnf6Np1_PPI',
    safeTrmesters: [1, 2, 3],
    contraindications: ['High blood pressure', 'Balance issues'],
    modifications: [
      {
        trimester: 3,
        description: 'Use wall for support, reduce stance width'
      }
    ],
    category: 'strength',
    targetMuscles: ['legs', 'glutes', 'core'],
    intensity: 'moderate',
    defaultDurationSeconds: 60,
    equipmentRequired: ['yoga mat']
  }
];

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(ex => ex.id === id);
}

export function filterExercises(filters: {
  trimester?: 1 | 2 | 3;
  category?: string;
  intensity?: string;
  searchQuery?: string;
}): Exercise[] {
  return exercises.filter(exercise => {
    // Filter by trimester
    if (filters.trimester && !exercise.safeTrmesters.includes(filters.trimester)) {
      return false;
    }

    // Filter by category
    if (filters.category && exercise.category !== filters.category) {
      return false;
    }

    // Filter by intensity
    if (filters.intensity && exercise.intensity !== filters.intensity) {
      return false;
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        exercise.name.toLowerCase().includes(query) ||
        exercise.description.toLowerCase().includes(query)
      );
    }

    return true;
  });
}
