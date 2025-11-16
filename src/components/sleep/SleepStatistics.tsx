/**
 * SleepStatistics Component
 * Displays sleep analytics and insights
 */

'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { SleepStatistics as SleepStats } from '@/lib/types';

interface SleepStatisticsProps {
  statistics: SleepStats;
  isLoading?: boolean;
}

export function SleepStatistics({
  statistics,
  isLoading = false,
}: SleepStatisticsProps) {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-indigo-600">
              {formatDuration(statistics.averageDuration)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Average Duration
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-purple-600">
              {statistics.averageQuality
                ? `${statistics.averageQuality}/10`
                : 'N/A'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Average Quality
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600">
              {statistics.totalSessions}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Total Sessions
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-amber-600">
              {statistics.bestDay
                ? formatDuration(statistics.bestDay.duration)
                : 'N/A'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Best Sleep
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best & Worst Days */}
      {(statistics.bestDay || statistics.worstDay) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statistics.bestDay && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">
                  🌟 Best Sleep Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {format(new Date(statistics.bestDay.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold text-green-600">
                      {formatDuration(statistics.bestDay.duration)}
                    </span>
                  </div>
                  {statistics.bestDay.quality && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quality:</span>
                      <span className="font-semibold text-green-600">
                        {statistics.bestDay.quality}/10
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {statistics.worstDay && (
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-700">
                  ⚠️ Shortest Sleep Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {format(new Date(statistics.worstDay.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold text-amber-600">
                      {formatDuration(statistics.worstDay.duration)}
                    </span>
                  </div>
                  {statistics.worstDay.quality && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quality:</span>
                      <span className="font-semibold text-amber-600">
                        {statistics.worstDay.quality}/10
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Weekly Breakdown */}
      {statistics.weeklyBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📅 Weekly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.weeklyBreakdown.map((week, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      Week of {format(new Date(week.weekStart), 'MMM d')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {week.sessionCount} session{week.sessionCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-indigo-600">
                      {formatDuration(week.avgDuration)}
                    </div>
                    {week.avgQuality && (
                      <div className="text-sm text-gray-600">
                        Quality: {week.avgQuality}/10
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
