import { Link, useNavigate } from 'react-router-dom';
import { Play, Dumbbell, Clock, Flame, ChevronRight, Sparkles, RotateCcw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, CardContent } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { TrimesterBadge, IntensityBadge } from '../shared/components/ui/Badge';
import { useUserStore, useWorkoutSessionStore, selectCompletedWorkoutsCount, selectTotalMinutesExercised } from '../stores';
import { workoutPlans, getWorkoutById } from '../data/workouts';

function HomePage() {
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);
  const isOnboarded = useUserStore((state) => state.isOnboarded);
  const completedWorkouts = useWorkoutSessionStore(selectCompletedWorkoutsCount);
  const totalMinutes = useWorkoutSessionStore(selectTotalMinutesExercised);
  const currentSession = useWorkoutSessionStore((state) => state.currentSession);
  const clearCurrentSession = useWorkoutSessionStore((state) => state.clearCurrentSession);
  const [dismissedResume, setDismissedResume] = useState(false);

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!isOnboarded) {
      navigate('/onboarding');
    }
  }, [isOnboarded, navigate]);

  if (!profile) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-gray-500">Loading your profile...</p>
        </div>
      </PageLayout>
    );
  }

  const interruptedWorkout = currentSession && !dismissedResume
    ? getWorkoutById(currentSession.workoutPlanId)
    : null;

  // Get recommended workouts for current trimester
  const recommendedWorkouts = workoutPlans
    .filter(w => {
      const isAllTrimester = w.weekRange.start === 1 && w.weekRange.end === 40;
      return isAllTrimester || w.trimester === profile.currentTrimester;
    })
    .slice(0, 3);

  const greeting = getGreeting();

  return (
    <PageLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {profile.displayName.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 mt-1">
          Week {profile.currentWeek} of your pregnancy journey
        </p>
      </div>

      {/* Resume interrupted workout */}
      {interruptedWorkout && (
        <Card className="mb-6 bg-amber-50 border-amber-200">
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-amber-900">Resume workout?</p>
              <p className="text-sm text-amber-700 truncate">
                {interruptedWorkout.name} — {currentSession!.exercisesCompleted.length} exercise{currentSession!.exercisesCompleted.length !== 1 ? 's' : ''} done
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                onClick={() => navigate(`/workout/${interruptedWorkout.id}/active`)}
                className="gap-1"
              >
                <Play className="w-3 h-3" />
                Resume
              </Button>
              <button
                onClick={() => {
                  clearCurrentSession();
                  setDismissedResume(true);
                }}
                className="p-1.5 text-amber-500 hover:text-amber-700 rounded-lg hover:bg-amber-100"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedWorkouts}</p>
              <p className="text-sm text-white/80">Workouts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent-500 to-accent-600 text-white">
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalMinutes}</p>
              <p className="text-sm text-white/80">Minutes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Recommendation */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Recommended for You
          </h2>
        </div>

        {recommendedWorkouts.length > 0 && (
          <Card className="overflow-hidden" padding="none">
            <div className="relative h-32 bg-gradient-to-r from-primary-400 to-accent-400">
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg">
                  {recommendedWorkouts[0].name}
                </h3>
                <p className="text-white/80 text-sm">
                  {recommendedWorkouts[0].totalDurationMinutes} min
                </p>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrimesterBadge trimester={recommendedWorkouts[0].trimester} />
                  <IntensityBadge intensity={recommendedWorkouts[0].intensity} />
                </div>
                <Link to={`/workout/${recommendedWorkouts[0].id}/active`}>
                  <Button size="sm" className="gap-2">
                    <Play className="w-4 h-4" />
                    Start
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* More Workouts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            More Workouts
          </h2>
          <Link
            to="/workouts"
            className="text-primary-600 text-sm font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {recommendedWorkouts.slice(1).map((workout) => (
            <Link key={workout.id} to={`/workouts/${workout.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Flame className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {workout.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {workout.totalDurationMinutes} min • {workout.exercises.length} exercises
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export { HomePage };
