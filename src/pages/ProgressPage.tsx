import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, ArrowUpRight } from "lucide-react";
import { PageLayout } from "../shared/components/layout/PageLayout";
import {
  useWorkoutSessionStore,
  selectCompletedWorkoutsCount,
  selectTotalMinutesExercised,
} from "../stores";
import { getWorkoutById } from "../data/workouts";
export function ProgressPage() {
  const sessions = useWorkoutSessionStore((state) => state.completedSessions);
  const count = useWorkoutSessionStore(selectCompletedWorkoutsCount);
  const minutes = useWorkoutSessionStore(selectTotalMinutesExercised);
  const recent = useMemo(
    () =>
      sessions
        .filter((session) => session.status === "completed")
        .sort(
          (a, b) =>
            new Date(b.completedAt ?? b.startedAt).getTime() -
            new Date(a.completedAt ?? a.startedAt).getTime(),
        )
        .slice(0, 10),
    [sessions],
  );
  return (
    <PageLayout
      title="Progress, at your pace."
      subtitle="A record of your movement. No streaks to keep up."
    >
      <div className="grid grid-cols-2 gap-4">
        <section className="rounded-2xl bg-sage-100 p-5">
          <CheckCircle
            className="mb-4 h-6 w-6 text-primary-700"
            aria-hidden="true"
          />
          <h2 className="text-3xl font-semibold text-primary-900">{count}</h2>
          <p className="mt-2 text-sm text-gray-600">Completed sessions</p>
        </section>
        <section className="rounded-2xl border border-sage-200 bg-white p-5">
          <Clock className="mb-4 h-6 w-6 text-accent-700" aria-hidden="true" />
          <h2 className="text-3xl font-semibold text-primary-900">{minutes}</h2>
          <p className="mt-2 text-sm text-gray-600">Active minutes</p>
        </section>
      </div>
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-primary-900">
          Your recent movement
        </h2>
        {recent.length ? (
          <ol className="divide-y divide-sage-200 rounded-xl border border-sage-200 bg-white px-5">
            {recent.map((session) => (
              <li
                key={session.id}
                className="flex flex-wrap items-center justify-between gap-2 py-5"
              >
                <div>
                  <h3 className="font-medium text-primary-900">
                    {getWorkoutById(session.workoutPlanId)?.name ??
                      "Saved session"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(
                      session.completedAt ?? session.startedAt,
                    ).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-sm text-gray-600">
                  {Math.round(session.totalDurationSeconds / 60)} active min
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-2xl border border-sage-200 p-6">
            <h3 className="text-lg font-semibold text-primary-900">
              A fresh page, whenever you’re ready.
            </h3>
            <p className="my-3 text-gray-600">
              Completed sessions will appear here once the reviewed library is
              available. Rest days belong in your routine, too.
            </p>
            <Link
              to="/workouts"
              className="inline-flex min-h-12 items-center gap-2 text-primary-800"
            >
              Explore Move{" "}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>
      <p className="mt-6 text-sm text-gray-600">
        Session time is a personal record, not a measure of exercise suitability
        or medical progress.
      </p>
    </PageLayout>
  );
}
