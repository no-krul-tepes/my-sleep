/**
 * useSleepForm Hook
 * Manages form state for creating/updating sleep logs
 */

'use client';

import { useState, useCallback } from 'react';
import type { SleepLog, CreateSleepLogDTO } from '@/lib/types';

interface UseSleepFormOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseSleepFormResult {
  createSleepLog: (data: CreateSleepLogDTO) => Promise<void>;
  updateSleepLog: (id: string, data: Partial<CreateSleepLogDTO>) => Promise<void>;
  deleteSleepLog: (id: string) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function useSleepForm(options?: UseSleepFormOptions): UseSleepFormResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSleepLog = useCallback(
    async (data: CreateSleepLogDTO) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch('/api/sleep-logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to create sleep log');
        }

        options?.onSuccess?.();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        options?.onError?.(err instanceof Error ? err : new Error(message));
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [options]
  );

  const updateSleepLog = useCallback(
    async (id: string, data: Partial<CreateSleepLogDTO>) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch(`/api/sleep-logs/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to update sleep log');
        }

        options?.onSuccess?.();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        options?.onError?.(err instanceof Error ? err : new Error(message));
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [options]
  );

  const deleteSleepLog = useCallback(
    async (id: string) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch(`/api/sleep-logs/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to delete sleep log');
        }

        options?.onSuccess?.();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        options?.onError?.(err instanceof Error ? err : new Error(message));
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [options]
  );

  return {
    createSleepLog,
    updateSleepLog,
    deleteSleepLog,
    isSubmitting,
    error,
  };
}
