/**
 * useStatistics Hook
 * Fetches and manages sleep statistics
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SleepStatistics, DateRange } from '@/lib/types';

interface UseStatisticsResult {
  statistics: SleepStatistics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStatistics(dateRange?: DateRange): UseStatisticsResult {
  const [statistics, setStatistics] = useState<SleepStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, calculate client-side from logs
      // In production, this would be a dedicated API endpoint
      const params = new URLSearchParams();

      if (dateRange?.start) {
        params.set('date_from', dateRange.start.toISOString());
      }
      if (dateRange?.end) {
        params.set('date_to', dateRange.end.toISOString());
      }

      const url = `/api/sleep-logs${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch sleep logs for statistics');
      }

      const data = await response.json();
      const logs = data.data || [];

      // Calculate statistics from logs
      const stats = calculateStatistics(logs);
      setStatistics(stats);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching statistics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange?.start, dateRange?.end]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    isLoading,
    error,
    refetch: fetchStatistics,
  };
}

// Helper function to calculate statistics client-side
function calculateStatistics(logs: any[]): SleepStatistics {
  if (logs.length === 0) {
    return {
      averageDuration: 0,
      averageQuality: null,
      totalSessions: 0,
      bestDay: null,
      worstDay: null,
      weeklyBreakdown: [],
    };
  }

  const totalDuration = logs.reduce((sum, log) => sum + log.durationMinutes, 0);
  const averageDuration = totalDuration / logs.length;

  const logsWithQuality = logs.filter((log) => log.qualityRating !== null);
  const averageQuality =
    logsWithQuality.length > 0
      ? logsWithQuality.reduce((sum, log) => sum + log.qualityRating, 0) /
        logsWithQuality.length
      : null;

  const sortedByDuration = [...logs].sort(
    (a, b) => b.durationMinutes - a.durationMinutes
  );
  const bestDay = sortedByDuration[0]
    ? {
        date: new Date(sortedByDuration[0].sleepDate),
        duration: sortedByDuration[0].durationMinutes,
        quality: sortedByDuration[0].qualityRating,
      }
    : null;

  const worstDay = sortedByDuration[sortedByDuration.length - 1]
    ? {
        date: new Date(sortedByDuration[sortedByDuration.length - 1].sleepDate),
        duration: sortedByDuration[sortedByDuration.length - 1].durationMinutes,
        quality: sortedByDuration[sortedByDuration.length - 1].qualityRating,
      }
    : null;

  return {
    averageDuration: Math.round(averageDuration * 100) / 100,
    averageQuality: averageQuality
      ? Math.round(averageQuality * 100) / 100
      : null,
    totalSessions: logs.length,
    bestDay,
    worstDay,
    weeklyBreakdown: [], // Simplified for client-side
  };
}
