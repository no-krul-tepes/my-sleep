/**
 * SleepLogList Component
 * Displays list of sleep log entries
 */

'use client';

import { SleepLogCard } from './SleepLogCard';
import type { SleepLog } from '@/lib/types';

interface SleepLogListProps {
  logs: SleepLog[];
  onEdit?: (log: SleepLog) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function SleepLogList({
  logs,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = 'No sleep logs found. Create your first one!',
}: SleepLogListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😴</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Sleep Logs Yet
        </h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <SleepLogCard
          key={log.id}
          log={log}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
