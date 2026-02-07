import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Dumbbell, Play, ChevronRight } from 'lucide-react';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, CardContent } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { TrimesterBadge, IntensityBadge, Badge } from '../shared/components/ui/Badge';
import { getWorkoutById } from '../data/workouts';
import { getExerciseById } from '../data/exercises';
import { cn } from '../shared/utils/cn';

function WorkoutDetailPage() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();

  const workout = workoutId ? getWorkoutById(workoutId) : null;

  if (!workout) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Workout not found.</p>
          <Button variant="ghost" onClick={() => navigate('/workouts')} className="mt-4">
            Back to Workouts
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Calculate total rest time
  const totalRestSeconds = workout.exercises.reduce((acc, ex) => acc + ex.restSeconds, 0);
  return (
    <PageLayout noPadding noBottomPadding={false}>
      {/* Back button */}
      <div className="px-4 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Hero */}
      <div
        className={cn(
          'mx-4 mt-4 rounded-2xl p-6 text-white',
          workout.trimester === 1
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
            : workout.trimester === 2
            ? 'bg-gradient-to-br from-amber-500 to-amber-600'
            : 'bg-gradient-to-br from-violet-500 to-violet-600'
        )}
      >
        <TrimesterBadge trimester={workout.trimester} className="bg-white/20 text-white" />
        <h1 className="text-2xl font-bold mt-3">{workout.name}</h1>
        <p className="text-white/80 mt-2">{workout.description}</p>

        <div className="flex items-center gap-6 mt-4 text-white/90">
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {workout.totalDurationMinutes} min
          </span>
          <span className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            {workout.exercises.length} exercises
          </span>
        </div>

        <Link to={`/workout/${workout.id}/active`} className="block mt-6">
          <Button
            size="lg"
            fullWidth
            className="bg-white text-gray-900 hover:bg-gray-100 gap-2"
          >
            <Play className="w-5 h-5" />
            Start Workout
          </Button>
        </Link>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Workout Info */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="text-center py-4">
              <p className="text-2xl font-bold text-gray-900">{workout.exercises.length}</p>
              <p className="text-xs text-gray-500">Exercises</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(totalRestSeconds / 60)}
              </p>
              <p className="text-xs text-gray-500">Rest (min)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <p className="text-2xl font-bold text-gray-900">
                {workout.recommendedFrequency}x
              </p>
              <p className="text-xs text-gray-500">Per Week</p>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500">Intensity</span>
              <IntensityBadge intensity={workout.intensity} />
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <span className="text-gray-500">Category</span>
              <Badge variant="default" className="capitalize">
                {workout.category.replace('-', ' ')}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <span className="text-gray-500">Weeks</span>
              <span className="font-medium text-gray-900">
                {workout.weekRange.start}-{workout.weekRange.end}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Exercises</h2>
          <div className="space-y-3">
            {workout.exercises.map((workoutExercise, index) => {
              const exercise = getExerciseById(workoutExercise.exerciseId);
              if (!exercise) return null;

              return (
                <Link
                  key={`${workoutExercise.exerciseId}-${index}`}
                  to={`/exercises/${exercise.id}`}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-500">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {exercise.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {workoutExercise.durationSeconds
                            ? `${Math.round(workoutExercise.durationSeconds / 60)} min`
                            : workoutExercise.reps
                            ? `${workoutExercise.reps} reps`
                            : ''}
                          {workoutExercise.restSeconds > 0 &&
                            ` • ${workoutExercise.restSeconds}s rest`}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export { WorkoutDetailPage };
