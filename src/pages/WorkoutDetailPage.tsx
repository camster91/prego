import { Link, useParams } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";
import { getWorkoutById } from "../data/workouts";
import { getExerciseById } from "../data/exercises";
import { workoutAvailability } from "../lib/contentReview";
import { useUserStore } from "../stores";
import { PageLayout } from "../shared/components/layout/PageLayout";
export function WorkoutDetailPage() {
  const { workoutId } = useParams();
  const workout = getWorkoutById(workoutId ?? "");
  const profile = useUserStore((state) => state.profile);
  if (!workout)
    return (
      <PageLayout title="Session not found">
        <Link
          to="/workouts"
          className="inline-flex min-h-12 items-center text-primary-800 underline"
        >
          Back to Move
        </Link>
      </PageLayout>
    );
  const availability = workoutAvailability(workout, profile);
  return (
    <PageLayout>
      <Link
        to="/workouts"
        className="mb-5 inline-flex min-h-12 items-center gap-2 text-primary-800"
      >
        <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        Back to Move
      </Link>
      <img
        src="/media/studio-poster.webp"
        alt="A softly lit studio with a yoga mat and chair"
        className="mb-6 aspect-video w-full rounded-2xl object-cover"
      />
      <span className="text-xs tracking-widest text-accent-700">
        SESSION IN PREPARATION
      </span>
      <h1 className="mt-3 text-3xl font-semibold text-primary-900">
        {workout.name}
      </h1>
      <p className="my-4 flex items-center gap-2 text-gray-600">
        <Clock aria-hidden="true" className="h-5 w-5" />
        {workout.totalDurationMinutes} min · {workout.exercises.length}{" "}
        movements
      </p>
      <p className="mb-6 rounded-xl bg-sage-100 p-5 text-gray-700">
        {availability.reason} This preview is not an exercise prescription.
      </p>
      <h2 className="mb-4 text-xl font-semibold text-primary-900">
        Proposed movement sequence
      </h2>
      <ol className="mb-6 divide-y divide-sage-200 rounded-xl border border-sage-200 bg-white px-4">
        {workout.exercises.map((exercise, index) => (
          <li
            key={`${index}-${exercise.exerciseId}`}
            className="flex min-h-16 items-center gap-4 py-3"
          >
            <span className="text-sm text-gray-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-gray-800">
              {getExerciseById(exercise.exerciseId)?.name ??
                "Movement under review"}
            </span>
          </li>
        ))}
      </ol>
      <button
        disabled
        className="min-h-14 w-full rounded-xl bg-sage-100 px-5 font-medium text-gray-600"
      >
        Available after professional review
      </button>
      <Link
        to="/learn#safety"
        className="mt-4 inline-flex min-h-12 items-center text-primary-800 underline"
      >
        Read safety & care
      </Link>
    </PageLayout>
  );
}
