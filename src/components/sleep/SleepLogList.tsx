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
  emptyMessage = 'Записей о сне не найдено. Создайте первую!',
}: SleepLogListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 md:space-y-4 p-3 md:p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 md:h-40 bg-gray-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 md:py-16 px-4">
        <div className="text-5xl md:text-6xl mb-3 md:mb-4">😴</div>
        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
          Пока нет записей о сне
        </h3>
        <p className="text-sm md:text-base text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4 p-3 md:p-4">
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
