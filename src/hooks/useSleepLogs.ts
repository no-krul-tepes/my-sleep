/**
 * useSleepLogs Hook
 * Fetches and manages sleep logs data
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SleepLog, SleepLogFilters } from '@/lib/types';

interface UseSleepLogsResult {
  logs: SleepLog[];
  count: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSleepLogs(filters?: SleepLogFilters): UseSleepLogsResult {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters?.dateFrom) {
        params.set('date_from', filters.dateFrom.toISOString());
      }
      if (filters?.dateTo) {
        params.set('date_to', filters.dateTo.toISOString());
      }
      if (filters?.limit) {
        params.set('limit', filters.limit.toString());
      }

      const url = `/api/sleep-logs${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch sleep logs');
      }

      const data = await response.json();
      setLogs(data.data || []);
      setCount(data.count || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching sleep logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.dateFrom, filters?.dateTo, filters?.limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    count,
    isLoading,
    error,
    refetch: fetchLogs,
  };
}
