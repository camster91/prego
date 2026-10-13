import { useParams, Link } from "react-router-dom";
import { getExerciseById } from "../data/exercises";
import { PageLayout } from "../shared/components/layout/PageLayout";
export function ExerciseDetailPage() {
  const { exerciseId } = useParams();
  const exercise = getExerciseById(exerciseId ?? "");
  return (
    <PageLayout
      title={exercise?.name ?? "Movement not found"}
      subtitle="Professional review pending"
    >
      <p className="mb-6 text-gray-700">
        Instructions, modifications and demonstrations will be available after
        qualified review. An illustration or a listed trimester does not
        establish exercise suitability.
      </p>
      <Link
        to="/learn#safety"
        className="inline-flex min-h-12 items-center text-primary-800 underline"
      >
        Safety & care
      </Link>
    </PageLayout>
  );
}
