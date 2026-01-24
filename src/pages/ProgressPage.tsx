import { useMemo } from 'react';
import { Trophy, Flame, Clock, Calendar, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../shared/components/ui/Card';
import { Badge } from '../shared/components/ui/Badge';
import {
  useWorkoutSessionStore,
  selectCompletedWorkoutsCount,
  selectTotalMinutesExercised,
  selectRecentSessions
} from '../stores';
import { getWorkoutById } from '../data/workouts';
import { format, startOfWeek, subWeeks, isWithinInterval, endOfWeek } from 'date-fns';

const achievements = [
  {
    id: 'first-workout',
    title: 'First Steps',
    description: 'Complete your first workout',
    icon: '👶',
    threshold: 1
  },
  {
    id: 'workout-5',
    title: 'Getting Started',
    description: 'Complete 5 workouts',
    icon: '🌱',
    threshold: 5
  },
  {
    id: 'workout-10',
    title: 'Building Momentum',
    description: 'Complete 10 workouts',
    icon: '💪',
    threshold: 10
  },
  {
    id: 'workout-25',
    title: 'Dedicated',
    description: 'Complete 25 workouts',
    icon: '⭐',
    threshold: 25
  },
  {
    id: 'workout-50',
    title: 'Champion',
    description: 'Complete 50 workouts',
    icon: '🏆',
    threshold: 50
  }
];

function ProgressPage() {
  const completedWorkouts = useWorkoutSessionStore(selectCompletedWorkoutsCount);
  const totalMinutes = useWorkoutSessionStore(selectTotalMinutesExercised);
  const recentSessions = useWorkoutSessionStore((state) => selectRecentSessions(state, 10));
  const allSessions = useWorkoutSessionStore((state) => state.completedSessions);

  // Calculate weekly data for chart
  const weeklyData = useMemo(() => {
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(weekStart);

      const weekSessions = allSessions.filter(
        (session) =>
          session.status === 'completed' &&
          session.completedAt &&
          isWithinInterval(new Date(session.completedAt), {
            start: weekStart,
            end: weekEnd
          })
      );

      weeks.push({
        week: format(weekStart, 'MMM d'),
        workouts: weekSessions.length,
        minutes: Math.round(
          weekSessions.reduce((acc, s) => acc + s.totalDurationSeconds, 0) / 60
        )
      });
    }
    return weeks;
  }, [allSessions]);

  // Calculate streak
  const currentStreak = useMemo(() => {
    // Simplified streak calculation - count consecutive days with workouts
    const sortedSessions = [...allSessions]
      .filter((s) => s.status === 'completed' && s.completedAt)
      .sort(
        (a, b) =>
          new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
      );

    if (sortedSessions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uniqueDays = new Set<string>();
    sortedSessions.forEach((session) => {
      const date = new Date(session.completedAt!);
      date.setHours(0, 0, 0, 0);
      uniqueDays.add(date.toISOString());
    });

    const sortedDays = Array.from(uniqueDays)
      .map((d) => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    for (let i = 0; i < sortedDays.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (sortedDays[i].getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [allSessions]);

  // Check earned achievements
  const earnedAchievements = achievements.filter(
    (a) => completedWorkouts >= a.threshold
  );

  return (
    <PageLayout title="Your Progress" subtitle="Track your pregnancy fitness journey">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <CardContent>
            <Trophy className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{completedWorkouts}</p>
            <p className="text-sm text-white/80">Workouts</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent-500 to-accent-600 text-white">
          <CardContent>
            <Clock className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{totalMinutes}</p>
            <p className="text-sm text-white/80">Minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Flame className="w-8 h-8 mb-2 text-orange-500" />
            <p className="text-3xl font-bold text-gray-900">{currentStreak}</p>
            <p className="text-sm text-gray-500">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <TrendingUp className="w-8 h-8 mb-2 text-emerald-500" />
            <p className="text-3xl font-bold text-gray-900">
              {weeklyData[weeklyData.length - 1]?.workouts || 0}
            </p>
            <p className="text-sm text-gray-500">This Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyData.some((d) => d.workouts > 0) ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorWorkouts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="workouts"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorWorkouts)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              <p>Complete workouts to see your activity chart</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {achievements.map((achievement) => {
              const isEarned = completedWorkouts >= achievement.threshold;
              return (
                <div
                  key={achievement.id}
                  className={`text-center ${isEarned ? '' : 'opacity-40'}`}
                >
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl ${
                      isEarned ? 'bg-amber-100' : 'bg-gray-100'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <p className="text-xs font-medium text-gray-700 truncate">
                    {achievement.title}
                  </p>
                </div>
              );
            })}
          </div>

          {earnedAchievements.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">Recently earned</p>
              <div className="space-y-2">
                {earnedAchievements.slice(-3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{achievement.title}</p>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => {
                const workout = getWorkoutById(session.workoutPlanId);
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {workout?.name || 'Unknown Workout'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.completedAt
                            ? format(new Date(session.completedAt), 'MMM d, yyyy')
                            : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {Math.round(session.totalDurationSeconds / 60)} min
                      </p>
                      {session.perceivedDifficulty && (
                        <Badge variant="default" size="sm">
                          Difficulty: {session.perceivedDifficulty}/5
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No workouts completed yet</p>
              <p className="text-sm">Start exercising to see your history</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}

export { ProgressPage };
