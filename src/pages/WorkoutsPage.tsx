import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Dumbbell, Play } from 'lucide-react';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, CardContent } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { TrimesterBadge, IntensityBadge } from '../shared/components/ui/Badge';
import { workoutPlans, filterWorkouts } from '../data/workouts';
import { useUserStore } from '../stores';
import type { Trimester } from '../types';
import { cn } from '../shared/utils/cn';

function WorkoutsPage() {
  const profile = useUserStore((state) => state.profile);
  const [selectedTrimester, setSelectedTrimester] = useState<Trimester | 'all'>(
    profile?.currentTrimester || 'all'
  );

  const filteredWorkouts = useMemo(() => {
    if (selectedTrimester === 'all') {
      return workoutPlans;
    }
    return filterWorkouts({ trimester: selectedTrimester });
  }, [selectedTrimester]);

  return (
    <PageLayout title="Workout Plans" subtitle="Structured programs for every stage">
      {/* Trimester Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        <FilterButton
          active={selectedTrimester === 'all'}
          onClick={() => setSelectedTrimester('all')}
        >
          All
        </FilterButton>
        <FilterButton
          active={selectedTrimester === 1}
          onClick={() => setSelectedTrimester(1)}
          color="emerald"
        >
          1st Trimester
        </FilterButton>
        <FilterButton
          active={selectedTrimester === 2}
          onClick={() => setSelectedTrimester(2)}
          color="amber"
        >
          2nd Trimester
        </FilterButton>
        <FilterButton
          active={selectedTrimester === 3}
          onClick={() => setSelectedTrimester(3)}
          color="violet"
        >
          3rd Trimester
        </FilterButton>
      </div>

      {/* Current Trimester Recommendation */}
      {profile && selectedTrimester === 'all' && (
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">
            Recommended for Week {profile.currentWeek} (Trimester {profile.currentTrimester})
          </p>
        </div>
      )}

      {/* Workout Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No workouts found for this filter.</p>
        </div>
      )}
    </PageLayout>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: 'emerald' | 'amber' | 'violet';
}

function FilterButton({ active, onClick, children, color }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
        active
          ? color === 'emerald'
            ? 'bg-emerald-600 text-white'
            : color === 'amber'
            ? 'bg-amber-600 text-white'
            : color === 'violet'
            ? 'bg-violet-600 text-white'
            : 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      )}
    >
      {children}
    </button>
  );
}

interface WorkoutCardProps {
  workout: (typeof workoutPlans)[0];
}

function WorkoutCard({ workout }: WorkoutCardProps) {
  const isQuickWorkout = workout.totalDurationMinutes <= 7;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow" padding="none">
      {/* Colored header based on trimester */}
      <div
        className={cn(
          'h-24 relative',
          workout.trimester === 1
            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
            : workout.trimester === 2
            ? 'bg-gradient-to-r from-amber-400 to-amber-500'
            : 'bg-gradient-to-r from-violet-400 to-violet-500'
        )}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white font-bold text-lg truncate">{workout.name}</h3>
        </div>
        {isQuickWorkout && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
              Quick
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {workout.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {workout.totalDurationMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4" />
            {workout.exercises.length} exercises
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrimesterBadge trimester={workout.trimester} />
            <IntensityBadge intensity={workout.intensity} />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Link to={`/workouts/${workout.id}`} className="flex-1">
            <Button variant="secondary" fullWidth size="sm">
              Details
            </Button>
          </Link>
          <Link to={`/workout/${workout.id}/active`} className="flex-1">
            <Button fullWidth size="sm" className="gap-1">
              <Play className="w-4 h-4" />
              Start
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export { WorkoutsPage };
