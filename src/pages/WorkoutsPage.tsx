import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Search, SlidersHorizontal } from "lucide-react";
import { PageLayout } from "../shared/components/layout/PageLayout";
import { workoutPlans } from "../data/workouts";
import { cn } from "../shared/utils/cn";
export function WorkoutsPage() {
  const [duration, setDuration] = useState<number | null>(null);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      workoutPlans.filter(
        (workout) =>
          (!duration || workout.totalDurationMinutes <= duration) &&
          (category === "all" || workout.category === category) &&
          workout.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [duration, category, query],
  );
  return (
    <PageLayout
      title="Find your kind of movement."
      subtitle="Small sessions. Space to choose."
    >
      <div className="relative mb-6">
        <Search
          aria-hidden="true"
          className="absolute left-4 top-4 h-5 w-5 text-gray-600"
        />
        <input
          type="search"
          aria-label="Search sessions"
          placeholder="Search a session"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="input pl-12"
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-2" aria-label="Session duration">
        {[null, 5, 10, 15, 20, 30].map((value) => (
          <button
            key={value ?? "all"}
            onClick={() => setDuration(value)}
            aria-pressed={duration === value}
            className={cn(
              "min-h-12 rounded-full px-4 text-sm font-medium",
              duration === value
                ? "bg-primary-600 text-white"
                : "bg-sage-100 text-primary-800",
            )}
          >
            {value ? `Up to ${value} min` : "Any length"}
          </button>
        ))}
      </div>
      <label className="mb-6 flex items-center gap-3 text-sm text-gray-700">
        <SlidersHorizontal aria-hidden="true" className="h-5 w-5" />
        Movement type
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="input w-auto flex-1"
        >
          <option value="all">All types</option>
          <option value="flexibility">Mobility</option>
          <option value="strength">Strength</option>
          <option value="cardio">Cardio</option>
          <option value="pelvic-floor">Pelvic floor</option>
        </select>
      </label>
      <div className="mb-6 rounded-xl border border-sage-200 p-4 text-sm text-gray-600">
        The guided library is in preparation. Session previews do not establish
        suitability for you. Professional review and screening are required
        before workouts open.
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((workout) => (
          <Link
            key={workout.id}
            to={`/workouts/${workout.id}`}
            className="group overflow-hidden rounded-2xl border border-sage-200 bg-white"
          >
            <img
              src="/media/studio-poster.webp"
              alt=""
              width="640"
              height="360"
              loading="lazy"
              className="aspect-[2/1] w-full object-cover"
            />
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-medium tracking-wide text-accent-700">
                  REVIEW PENDING
                </span>
                <ArrowUpRight
                  className="h-5 w-5 text-primary-700"
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-lg font-semibold text-primary-900">
                {workout.name}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <Clock aria-hidden="true" className="h-4 w-4" />
                {workout.totalDurationMinutes} min · {workout.exercises.length}{" "}
                movements
              </p>
            </div>
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <div role="status" className="py-12 text-center">
          <h2 className="text-xl font-semibold text-primary-900">
            A different kind of pause.
          </h2>
          <p className="my-3 text-gray-600">
            No sessions match these filters. Try a longer duration or another
            movement type.
          </p>
          <button
            className="min-h-12 px-4 text-primary-800 underline"
            onClick={() => {
              setDuration(null);
              setCategory("all");
              setQuery("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <Link
        to="/exercises"
        className="mt-6 inline-flex min-h-12 items-center gap-2 text-primary-800 underline"
      >
        Explore movement names{" "}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </PageLayout>
  );
}
