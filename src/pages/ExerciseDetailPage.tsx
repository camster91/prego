import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, CardContent } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { Badge, TrimesterBadge, IntensityBadge } from '../shared/components/ui/Badge';
import { getExerciseById } from '../data/exercises';
import { useUserStore } from '../stores';

function ExerciseDetailPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);

  const exercise = exerciseId ? getExerciseById(exerciseId) : null;

  if (!exercise) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Exercise not found.</p>
          <Button variant="ghost" onClick={() => navigate('/exercises')} className="mt-4">
            Back to Exercises
          </Button>
        </div>
      </PageLayout>
    );
  }

  const isSafeForCurrentTrimester = profile
    ? exercise.safeTrmesters.includes(profile.currentTrimester)
    : true;

  const currentTrimesterModification = profile
    ? exercise.modifications.find((m) => m.trimester === profile.currentTrimester)
    : null;

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

      {/* Hero section */}
      <div className="px-4 py-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">{getCategoryEmoji(exercise.category)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exercise.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <IntensityBadge intensity={exercise.intensity} />
              <Badge variant="default" className="capitalize">
                {exercise.category.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-gray-600">{exercise.description}</p>
      </div>

      {/* Safety warning if not safe for current trimester */}
      {!isSafeForCurrentTrimester && profile && (
        <div className="px-4 mb-6">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">
                  Not recommended for your trimester
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  This exercise may not be safe during trimester {profile.currentTrimester}.
                  Please consult your healthcare provider.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modification notice */}
      {currentTrimesterModification && (
        <div className="px-4 mb-6">
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-primary-800">
                  Modification for Trimester {profile?.currentTrimester}
                </p>
                <p className="text-sm text-primary-700 mt-1">
                  {currentTrimesterModification.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="px-4 space-y-6">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="text-center">
              <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(exercise.defaultDurationSeconds / 60)}
              </p>
              <p className="text-sm text-gray-500">minutes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500 mb-2">Safe for</p>
              <div className="flex justify-center gap-1">
                {exercise.safeTrmesters.map((t) => (
                  <TrimesterBadge key={t} trimester={t} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardContent>
            <h2 className="font-semibold text-gray-900 mb-4">How to do it</h2>
            <ol className="space-y-3">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-600">{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Target Muscles */}
        <Card>
          <CardContent>
            <h2 className="font-semibold text-gray-900 mb-3">Target Areas</h2>
            <div className="flex flex-wrap gap-2">
              {exercise.targetMuscles.map((muscle) => (
                <Badge key={muscle} variant="default" className="capitalize">
                  {muscle.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipment */}
        {exercise.equipmentRequired.length > 0 && (
          <Card>
            <CardContent>
              <h2 className="font-semibold text-gray-900 mb-3">Equipment Needed</h2>
              <div className="flex flex-wrap gap-2">
                {exercise.equipmentRequired.map((equipment) => (
                  <Badge key={equipment} variant="default" className="capitalize">
                    {equipment}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contraindications */}
        {exercise.contraindications.length > 0 && (
          <Card className="bg-red-50 border-red-100">
            <CardContent>
              <h2 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Avoid if you have
              </h2>
              <ul className="space-y-2">
                {exercise.contraindications.map((item, index) => (
                  <li key={index} className="text-red-700 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    strength: '💪',
    cardio: '❤️',
    flexibility: '🧘',
    'pelvic-floor': '🌸',
    breathing: '🌬️',
    balance: '⚖️'
  };
  return emojis[category] || '🏃';
}

export { ExerciseDetailPage };
