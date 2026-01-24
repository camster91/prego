import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Video
} from 'lucide-react';
import { Button } from '../shared/components/ui/Button';
import { Modal } from '../shared/components/ui/Modal';
import { Badge, IntensityBadge } from '../shared/components/ui/Badge';
import { useTimer } from '../hooks/useTimer';
import { getWorkoutById } from '../data/workouts';
import { getExerciseById } from '../data/exercises';
import { useWorkoutSessionStore, useUserStore } from '../stores';
import type { TimerConfig } from '../types';
import { cn } from '../shared/utils/cn';

function ActiveWorkoutPage() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();

  const workout = workoutId ? getWorkoutById(workoutId) : null;
  const preferences = useUserStore((state) => state.profile?.preferences);
  const userTrimester = useUserStore((state) => state.profile?.currentTrimester);

  const [soundEnabled, setSoundEnabled] = useState(preferences?.soundEnabled ?? true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5 | undefined>();

  const { startWorkout, completeExercise, endWorkout, abandonWorkout } =
    useWorkoutSessionStore();

  // Build timer config
  const timerConfig: TimerConfig = useMemo(() => {
    if (!workout) {
      return { countdownSeconds: 5, exercises: [] };
    }

    return {
      countdownSeconds: 5,
      exercises: workout.exercises.map((we) => {
        const exercise = getExerciseById(we.exerciseId);
        return {
          exerciseId: we.exerciseId,
          name: exercise?.name || 'Unknown',
          durationSeconds: we.durationSeconds || exercise?.defaultDurationSeconds || 30,
          restSeconds: we.restSeconds
        };
      }),
      onExerciseComplete: (index) => {
        const ex = workout.exercises[index];
        completeExercise(ex.exerciseId, ex.durationSeconds || 30);
        playSound('complete');
      },
      onWorkoutComplete: () => {
        setShowCompleteModal(true);
        playSound('finish');
      },
      onPhaseChange: (phase) => {
        if (phase === 'exercise' || phase === 'rest') {
          playSound('beep');
        }
      }
    };
  }, [workout, completeExercise]);

  const { state, start, pause, resume, skip, goToExercise } = useTimer(timerConfig);

  // Play sounds
  const playSound = useCallback(
    (type: 'beep' | 'complete' | 'finish') => {
      if (!soundEnabled) return;

      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value =
          type === 'beep' ? 440 : type === 'complete' ? 880 : 660;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + (type === 'finish' ? 0.5 : 0.2)
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + (type === 'finish' ? 0.5 : 0.2));
      } catch {
        // Audio not supported
      }
    },
    [soundEnabled]
  );

  // Start workout session when component mounts
  useEffect(() => {
    if (workout) {
      startWorkout(workout.id);
    }
  }, [workout?.id]);

  const handleExit = () => {
    setShowExitModal(true);
    if (state.isRunning && !state.isPaused) {
      pause();
    }
  };

  const handleConfirmExit = () => {
    abandonWorkout();
    navigate('/workouts');
  };

  const handleComplete = () => {
    endWorkout(difficulty);
    navigate('/progress');
  };

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage-50">
        <div className="text-center">
          <p className="text-gray-500">Workout not found.</p>
          <Button variant="ghost" onClick={() => navigate('/workouts')} className="mt-4">
            Back to Workouts
          </Button>
        </div>
      </div>
    );
  }

  const currentExercise =
    state.phase === 'complete'
      ? null
      : timerConfig.exercises[state.currentExerciseIndex];

  const exerciseDetails = currentExercise
    ? getExerciseById(currentExercise.exerciseId)
    : null;

  const progress = ((state.currentExerciseIndex + 1) / state.totalExercises) * 100;

  // Get modification for current trimester
  const currentModification = exerciseDetails?.modifications.find(
    (mod) => mod.trimester === userTrimester
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExit}
          className="text-white hover:bg-white/10"
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="text-center flex-1">
          <p className="font-semibold text-white">{workout.name}</p>
          <p className="text-xs text-gray-400">
            Exercise {state.currentExerciseIndex + 1} of {state.totalExercises}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-white hover:bg-white/10"
        >
          {soundEnabled ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
        </Button>
      </header>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {state.phase === 'complete' ? (
          /* Complete state */
          <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
            <CheckCircle className="w-24 h-24 text-emerald-500 mb-6" />
            <h2 className="text-3xl font-bold mb-3">Workout Complete!</h2>
            <p className="text-gray-400 text-lg mb-2">Amazing work! You've finished all exercises.</p>
            <p className="text-gray-500">Take a moment to cool down and hydrate.</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Phase indicator and Exercise name */}
            <div className="text-center">
              <Badge
                variant={
                  state.phase === 'countdown'
                    ? 'warning'
                    : state.phase === 'rest'
                    ? 'success'
                    : 'primary'
                }
                size="lg"
                className="mb-3"
              >
                {state.phase === 'countdown'
                  ? 'Get Ready'
                  : state.phase === 'rest'
                  ? 'Rest Time'
                  : 'Exercise'}
              </Badge>

              <h1 className="text-2xl font-bold">
                {state.phase === 'rest' ? 'Take a Break' : currentExercise?.name}
              </h1>

              {exerciseDetails && state.phase !== 'rest' && (
                <p className="text-gray-400 text-sm mt-1">
                  {exerciseDetails.category.charAt(0).toUpperCase() + exerciseDetails.category.slice(1)}
                  {' '}&bull;{' '}
                  <IntensityBadge intensity={exerciseDetails.intensity} className="inline-flex" />
                </p>
              )}
            </div>

            {/* Timer and Video Section */}
            <div className="flex flex-col items-center">
              {/* Timer circle */}
              <div className="relative w-48 h-48 my-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={
                      state.phase === 'rest'
                        ? '#10b981'
                        : state.phase === 'countdown'
                        ? '#f59e0b'
                        : '#0ea5e9'
                    }
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${
                      2 *
                      Math.PI *
                      45 *
                      (1 - state.remainingSeconds / state.totalSeconds)
                    }`}
                    className="transition-all duration-200"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold tabular-nums">
                    {formatTime(state.remainingSeconds)}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {state.phase === 'countdown'
                      ? 'starting soon'
                      : state.phase === 'rest'
                      ? 'until next exercise'
                      : 'remaining'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => goToExercise(state.currentExerciseIndex - 1)}
                  disabled={state.currentExerciseIndex === 0 || state.phase === 'countdown'}
                  className="text-white hover:bg-white/10 disabled:opacity-30 w-12 h-12"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                {!state.isRunning ? (
                  <Button
                    size="icon-lg"
                    onClick={start}
                    className="w-16 h-16 rounded-full bg-primary-600 hover:bg-primary-700"
                  >
                    <Play className="w-8 h-8" fill="white" />
                  </Button>
                ) : state.isPaused ? (
                  <Button
                    size="icon-lg"
                    onClick={resume}
                    className="w-16 h-16 rounded-full bg-primary-600 hover:bg-primary-700"
                  >
                    <Play className="w-8 h-8" fill="white" />
                  </Button>
                ) : (
                  <Button
                    size="icon-lg"
                    onClick={pause}
                    className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <Pause className="w-8 h-8" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skip}
                  disabled={state.phase === 'countdown'}
                  className="text-white hover:bg-white/10 disabled:opacity-30 w-12 h-12"
                >
                  <SkipForward className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Exercise Details Section */}
            {exerciseDetails && state.phase !== 'countdown' && (
              <div className="space-y-4">
                {/* Watch Video Button */}
                {exerciseDetails.videoUrl && state.phase === 'exercise' && (
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-colors",
                      showVideo
                        ? "bg-primary-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    )}
                  >
                    <Video className="w-5 h-5" />
                    <span className="font-medium">
                      {showVideo ? 'Hide Video' : 'Watch How To Do It'}
                    </span>
                  </button>
                )}

                {/* YouTube Video Player */}
                {showVideo && exerciseDetails.videoUrl && state.phase === 'exercise' && (
                  <div className="rounded-xl overflow-hidden bg-black aspect-video">
                    <iframe
                      src={`${exerciseDetails.videoUrl}?autoplay=0&rel=0&modestbranding=1`}
                      title={`How to do ${exerciseDetails.name}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Description */}
                {state.phase === 'exercise' && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      About This Exercise
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {exerciseDetails.description}
                    </p>
                  </div>
                )}

                {/* Instructions */}
                {state.phase === 'exercise' && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">
                      Step-by-Step Instructions
                    </h3>
                    <ol className="space-y-2">
                      {exerciseDetails.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3 text-sm">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-400">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Modification for current trimester */}
                {currentModification && state.phase === 'exercise' && (
                  <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Trimester {currentModification.trimester} Modification
                    </h3>
                    <p className="text-amber-200/80 text-sm">
                      {currentModification.description}
                    </p>
                  </div>
                )}

                {/* Target muscles and equipment */}
                {state.phase === 'exercise' && (
                  <div className="flex flex-wrap gap-2">
                    {exerciseDetails.targetMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400"
                      >
                        {muscle.replace('-', ' ')}
                      </span>
                    ))}
                    {exerciseDetails.equipmentRequired.map((equipment) => (
                      <span
                        key={equipment}
                        className="px-3 py-1 bg-primary-900/30 rounded-full text-xs text-primary-400"
                      >
                        {equipment}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rest phase - show next exercise preview */}
                {state.phase === 'rest' && state.currentExerciseIndex < state.totalExercises - 1 && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">
                      Up Next
                    </h3>
                    {(() => {
                      const nextExercise = timerConfig.exercises[state.currentExerciseIndex + 1];
                      const nextDetails = nextExercise ? getExerciseById(nextExercise.exerciseId) : null;
                      return nextDetails ? (
                        <div>
                          <p className="text-lg font-medium text-white mb-1">{nextDetails.name}</p>
                          <p className="text-gray-400 text-sm">{nextDetails.description}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exercise queue */}
      {state.phase !== 'complete' && (
        <div className="p-4 bg-gray-800/50 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-2 font-medium">Exercise Queue</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {timerConfig.exercises.map((ex, index) => (
              <button
                key={`${ex.exerciseId}-${index}`}
                onClick={() => {
                  if (index !== state.currentExerciseIndex && state.phase !== 'countdown') {
                    goToExercise(index);
                  }
                }}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  index === state.currentExerciseIndex
                    ? 'bg-primary-600 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-gray-900'
                    : index < state.currentExerciseIndex
                    ? 'bg-emerald-600/30 text-emerald-400'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                )}
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Exit Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => {
          setShowExitModal(false);
          if (state.isRunning) resume();
        }}
        title="End Workout?"
      >
        <div className="flex items-start gap-3 mb-6">
          <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
          <p className="text-gray-600">
            Your progress will be saved but the workout will be marked as incomplete.
            Are you sure you want to exit?
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              setShowExitModal(false);
              if (state.isRunning) resume();
            }}
          >
            Continue Workout
          </Button>
          <Button variant="danger" fullWidth onClick={handleConfirmExit}>
            End Workout
          </Button>
        </div>
      </Modal>

      {/* Complete Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => {}}
        title="How was your workout?"
        showCloseButton={false}
        closeOnOverlayClick={false}
      >
        <p className="text-gray-600 mb-4">Rate your perceived difficulty:</p>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setDifficulty(rating as 1 | 2 | 3 | 4 | 5)}
              className={cn(
                'w-12 h-12 rounded-full text-lg font-bold transition-colors',
                difficulty === rating
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {rating}
            </button>
          ))}
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-6">
          <span>Easy</span>
          <span>Hard</span>
        </div>

        <Button fullWidth onClick={handleComplete}>
          Finish
        </Button>
      </Modal>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export { ActiveWorkoutPage };
