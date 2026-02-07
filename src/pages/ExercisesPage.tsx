import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronRight, Clock, X } from 'lucide-react';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, CardContent } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { IntensityBadge, Badge } from '../shared/components/ui/Badge';
import { Modal } from '../shared/components/ui/Modal';
import { filterExercises } from '../data/exercises';
import { useUserStore } from '../stores';
import type { ExerciseCategory, IntensityLevel, Trimester } from '../types';

const categories: { value: ExerciseCategory; label: string }[] = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'pelvic-floor', label: 'Pelvic Floor' },
  { value: 'breathing', label: 'Breathing' },
  { value: 'balance', label: 'Balance' }
];

const intensities: { value: IntensityLevel; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' }
];

function ExercisesPage() {
  const profile = useUserStore((state) => state.profile);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrimester, setSelectedTrimester] = useState<Trimester | undefined>(
    profile?.currentTrimester
  );
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | undefined>();
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel | undefined>();

  const filteredExercises = useMemo(() => {
    return filterExercises({
      trimester: selectedTrimester,
      category: selectedCategory,
      intensity: selectedIntensity,
      searchQuery: searchQuery.trim()
    });
  }, [searchQuery, selectedTrimester, selectedCategory, selectedIntensity]);

  const activeFiltersCount = [selectedTrimester, selectedCategory, selectedIntensity].filter(
    Boolean
  ).length;

  const clearFilters = () => {
    setSelectedTrimester(undefined);
    setSelectedCategory(undefined);
    setSelectedIntensity(undefined);
  };

  return (
    <PageLayout title="Exercise Library" subtitle="Pregnancy-safe exercises for every stage">
      {/* Search and Filter Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
        <Button
          variant={activeFiltersCount > 0 ? 'primary' : 'secondary'}
          onClick={() => setShowFilters(true)}
          className="relative"
        >
          <Filter className="w-5 h-5" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTrimester && (
            <Badge variant="primary" className="gap-1">
              Trimester {selectedTrimester}
              <button onClick={() => setSelectedTrimester(undefined)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="primary" className="gap-1 capitalize">
              {selectedCategory.replace('-', ' ')}
              <button onClick={() => setSelectedCategory(undefined)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedIntensity && (
            <Badge variant="primary" className="gap-1 capitalize">
              {selectedIntensity}
              <button onClick={() => setSelectedIntensity(undefined)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
      </p>

      {/* Exercise List */}
      <div className="space-y-3">
        {filteredExercises.map((exercise) => (
          <Link key={exercise.id} to={`/exercises/${exercise.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">
                    {getCategoryEmoji(exercise.category)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {exercise.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {exercise.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.round(exercise.defaultDurationSeconds / 60)} min
                    </span>
                    <IntensityBadge intensity={exercise.intensity} />
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No exercises found matching your filters.</p>
            <Button variant="ghost" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Exercises"
      >
        <div className="space-y-6">
          {/* Trimester Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Safe for Trimester
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    setSelectedTrimester(
                      selectedTrimester === t ? undefined : (t as Trimester)
                    )
                  }
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    selectedTrimester === t
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t === 1 ? '1st' : t === 2 ? '2nd' : '3rd'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === value ? undefined : value
                    )
                  }
                  className={`py-2.5 px-4 rounded-xl font-medium text-sm transition-colors ${
                    selectedCategory === value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Intensity
            </label>
            <div className="flex gap-2">
              {intensities.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() =>
                    setSelectedIntensity(
                      selectedIntensity === value ? undefined : value
                    )
                  }
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    selectedIntensity === value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={clearFilters} fullWidth>
              Clear All
            </Button>
            <Button onClick={() => setShowFilters(false)} fullWidth>
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}

function getCategoryEmoji(category: ExerciseCategory): string {
  const emojis: Record<ExerciseCategory, string> = {
    strength: '💪',
    cardio: '❤️',
    flexibility: '🧘',
    'pelvic-floor': '🌸',
    breathing: '🌬️',
    balance: '⚖️'
  };
  return emojis[category];
}

export { ExercisesPage };
