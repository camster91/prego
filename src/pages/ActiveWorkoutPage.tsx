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
  AlertCircle
} from 'lucide-react';
import { Button } from '../shared/components/ui/Button';
import { Card, CardContent } from '../shared/components/ui/Card';
import { Modal } from '../shared/components/ui/Modal';
import { Badge } from '../shared/components/ui/Badge';
import { useTimer } from '../hooks/useTimer';
import { getWorkoutById } from '../data/workouts';
import { getExerciseById } from '../data/exercises';
import { useWorkoutSessionStore, useUserStore } from '../stores';
import type { TimerConfig, TimerPhase } from '../types';
import { cn } from '../shared/utils/cn';

function ActiveWorkoutPage() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();

  const workout = workoutId ? getWorkoutById(workoutId) : null;
  const preferences = useUserStore((state) => state.profile?.preferences);

  const [soundEnabled, setSoundEnabled] = useState(preferences?.soundEnabled ?? true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
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

  const { state, start, pause, resume, skip, reset, goToExercise } = useTimer(timerConfig);

  // Play sounds (simplified - in production use use-sound library)
  const playSound = useCallback(
    (type: 'beep' | 'complete' | 'finish') => {
      if (!soundEnabled) return;

      // In a real app, use the use-sound library here
      // For now, we'll use the Web Audio API for simple beeps
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
      } catch (e) {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExit}
          className="text-white hover:bg-white/10"
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-400">{workout.name}</p>
          <p className="text-xs text-gray-500">
            {state.currentExerciseIndex + 1} of {state.totalExercises}
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
      <div className="h-1 bg-gray-800 mx-4 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Phase indicator */}
        <div className="mb-4">
          <Badge
            variant={
              state.phase === 'countdown'
                ? 'warning'
                : state.phase === 'rest'
                ? 'success'
                : state.phase === 'complete'
                ? 'primary'
                : 'default'
            }
            size="lg"
          >
            {state.phase === 'countdown'
              ? 'Get Ready'
              : state.phase === 'rest'
              ? 'Rest'
              : state.phase === 'complete'
              ? 'Complete!'
              : 'Exercise'}
          </Badge>
        </div>

        {/* Exercise name */}
        {currentExercise && (
          <h2 className="text-2xl font-bold text-center mb-2">
            {state.phase === 'rest' ? 'Rest' : currentExercise.name}
          </h2>
        )}

        {/* Timer circle */}
        <div className="relative w-64 h-64 my-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            {/* Progress circle */}
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
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${
                2 *
                Math.PI *
                45 *
                (1 - state.remainingSeconds / state.totalSeconds)
              }`}
              className="timer-circle"
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tabular-nums">
              {formatTime(state.remainingSeconds)}
            </span>
            <span className="text-sm text-gray-400 mt-1">
              {state.phase === 'countdown'
                ? 'Starting in...'
                : state.phase === 'rest'
                ? 'Rest time'
                : 'remaining'}
            </span>
          </div>
        </div>

        {/* Exercise instructions preview */}
        {exerciseDetails && state.phase === 'exercise' && (
          <div className="text-center max-w-sm mb-8">
            <p className="text-gray-400 text-sm line-clamp-2">
              {exerciseDetails.instructions[0]}
            </p>
          </div>
        )}

        {/* Controls */}
        {state.phase !== 'complete' && (
          <div className="flex items-center gap-4">
            {/* Previous */}
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() => goToExercise(state.currentExerciseIndex - 1)}
              disabled={state.currentExerciseIndex === 0 || state.phase === 'countdown'}
              className="text-white hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            {/* Play/Pause */}
            {!state.isRunning ? (
              <Button
                size="icon-lg"
                onClick={start}
                className="w-20 h-20 rounded-full bg-primary-600 hover:bg-primary-700"
              >
                <Play className="w-10 h-10" fill="white" />
              </Button>
            ) : state.isPaused ? (
              <Button
                size="icon-lg"
                onClick={resume}
                className="w-20 h-20 rounded-full bg-primary-600 hover:bg-primary-700"
              >
                <Play className="w-10 h-10" fill="white" />
              </Button>
            ) : (
              <Button
                size="icon-lg"
                onClick={pause}
                className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20"
              >
                <Pause className="w-10 h-10" />
              </Button>
            )}

            {/* Skip/Next */}
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={skip}
              disabled={state.phase === 'countdown'}
              className="text-white hover:bg-white/10 disabled:opacity-30"
            >
              <SkipForward className="w-8 h-8" />
            </Button>
          </div>
        )}

        {/* Complete state */}
        {state.phase === 'complete' && (
          <div className="text-center">
            <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Workout Complete!</h2>
            <p className="text-gray-400">Great job on finishing your workout!</p>
          </div>
        )}
      </div>

      {/* Exercise queue */}
      <div className="p-4 bg-gray-800/50">
        <p className="text-xs text-gray-500 mb-2">Coming up</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {timerConfig.exercises.map((ex, index) => (
            <button
              key={`${ex.exerciseId}-${index}`}
              onClick={() => {
                if (index !== state.currentExerciseIndex && state.phase !== 'countdown') {
                  goToExercise(index);
                }
              }}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                index === state.currentExerciseIndex
                  ? 'bg-primary-600 text-white'
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
