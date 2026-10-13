import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Clock,
  Leaf,
  ChevronRight,
  Check,
  Sparkles,
} from "lucide-react";
import { PageLayout } from "../shared/components/layout/PageLayout";
import {
  useUserStore,
  useWorkoutSessionStore,
  selectCompletedWorkoutsCount,
  selectTotalMinutesExercised,
} from "../stores";
import { usePregnancyStage } from "../hooks/usePregnancyStage";
import { workoutPlans } from "../data/workouts";
import { StudioMotion } from "../shared/components/ui/StudioMotion";

function HomePage() {
  const profile = useUserStore((state) => state.profile);
  const count = useWorkoutSessionStore(selectCompletedWorkoutsCount);
  const minutes = useWorkoutSessionStore(selectTotalMinutesExercised);
  const stage = usePregnancyStage();
  const [duration, setDuration] = useState(10);
  const session =
    workoutPlans.find(
      (workout) =>
        workout.totalDurationMinutes <= duration &&
        (workout.trimester === stage.currentTrimester ||
          workout.weekRange.end === 40),
    ) ?? workoutPlans[0];
  return (
    <PageLayout>
      <div className="mb-6 flex items-center justify-between gap-3 text-sm">
        <span className="text-gray-600">YOUR DAILY MOMENT</span>
        <span className="rounded-full bg-sage-100 px-3 py-2 text-primary-800">
          {profile && stage.status === "pregnancy"
            ? `Week ${stage.currentWeek} · Trimester ${stage.currentTrimester}`
            : "At your own pace"}
        </span>
      </div>
      <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
        <div>
          <p className="mb-3 text-primary-700">
            {profile
              ? `Hello, ${profile.displayName.split(" ")[0]}.`
              : "Movement for every stage."}
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-primary-900 sm:text-5xl">
            A little movement.
            <br />
            <span className="font-normal italic text-accent-700">
              A moment for you.
            </span>
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-gray-600">
            Make room for movement that fits your day. Clear guidance, small
            steps, and no pressure to keep up.
          </p>
          {!profile && (
            <Link
              className="mt-6 inline-flex min-h-14 items-center gap-4 rounded-xl bg-primary-900 px-6 font-medium text-white"
              to="/onboarding"
            >
              Make it yours{" "}
              <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          )}
          {profile && stage.status !== "pregnancy" && (
            <div className="mt-5 rounded-xl border border-sage-300 p-4">
              <p>
                Would you like to update your information? Prego never assumes
                what happens when a due date passes.
              </p>
              <Link
                to="/settings"
                className="inline-flex min-h-12 items-center font-medium text-primary-800 underline"
              >
                Review your preferences
              </Link>
            </div>
          )}
        </div>
        <figure className="overflow-hidden rounded-3xl bg-sage-100">
          <img
            src="/media/prego-studio.webp"
            width="1200"
            height="800"
            alt="A pregnant woman resting on a yoga mat in a softly lit studio"
            className="aspect-[4/3] w-full object-cover"
            fetchPriority="high"
          />
          <figcaption className="px-5 py-3 text-xs text-gray-600">
            A space to slow down. A little time for yourself.
          </figcaption>
        </figure>
      </div>
      <section aria-labelledby="session-heading" className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs tracking-widest text-gray-600">
              LET’S KEEP IT SIMPLE
            </p>
            <h2
              id="session-heading"
              className="text-2xl font-semibold text-primary-900"
            >
              How much time do you have?
            </h2>
          </div>
          <Leaf className="h-6 w-6 text-primary-700" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[5, 10, 20].map((value) => (
            <button
              key={value}
              aria-pressed={duration === value}
              onClick={() => setDuration(value)}
              className={`min-h-20 rounded-xl border p-3 text-left transition-colors ${duration === value ? "border-primary-800 bg-primary-900 text-white" : "border-sage-200 bg-white text-primary-900"}`}
            >
              <span className="block text-xl font-semibold">{value} min</span>
              <span
                className={`mt-1 block text-xs ${duration === value ? "text-white" : "text-gray-600"}`}
              >
                {value === 5
                  ? "A small pause"
                  : value === 10
                    ? "A little balance"
                    : "Time to unwind"}
              </span>
            </button>
          ))}
        </div>
        <Link
          to={`/workouts/${session.id}`}
          className="mt-4 flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-sage-200 bg-white p-5"
        >
          <div>
            <span className="text-xs text-accent-700">
              SESSION IN PREPARATION
            </span>
            <h3 className="mt-1 text-lg font-semibold text-primary-900">
              {session.name}
            </h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {session.totalDurationMinutes} min · Professional review pending
            </p>
          </div>
          <ArrowUpRight
            className="h-6 w-6 shrink-0 text-primary-800"
            aria-hidden="true"
          />
        </Link>
        <p className="mt-3 text-sm text-gray-600">
          Guided workouts open after professional review. This preview is not an
          exercise prescription.
        </p>
      </section>
      <section
        className="mt-8 grid gap-5 md:grid-cols-2"
        aria-label="Your progress and resources"
      >
        <div className="rounded-2xl bg-sage-100 p-6">
          <Check className="mb-4 h-6 w-6 text-primary-800" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-primary-900">
            Every small step counts.
          </h2>
          <p className="my-3 text-gray-600">
            {count
              ? `${count} completed sessions · ${minutes} active minutes`
              : "Your progress belongs to you. Start whenever you’re ready."}
          </p>
          <Link
            to="/progress"
            className="inline-flex min-h-12 items-center gap-2 text-primary-800"
          >
            Your progress{" "}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="rounded-2xl border border-sage-200 bg-white p-6">
          <Sparkles
            className="mb-4 h-6 w-6 text-accent-700"
            aria-hidden="true"
          />
          <h2 className="text-xl font-semibold text-primary-900">
            A little more confidence.
          </h2>
          <p className="my-3 text-gray-600">
            Understand how Prego works, where to find trusted resources, and
            what comes next.
          </p>
          <Link
            to="/learn"
            className="inline-flex min-h-12 items-center gap-2 text-primary-800"
          >
            Explore Learn{" "}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className="mt-8" aria-label="A calm studio moment">
        <StudioMotion />
      </section>
    </PageLayout>
  );
}
export { HomePage };
