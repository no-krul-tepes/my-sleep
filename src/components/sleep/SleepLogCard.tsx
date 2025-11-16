/**
 * SleepLogCard Component
 * Displays individual sleep log entry
 */

'use client';

import { format } from 'date-fns';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import type { SleepLog } from '@/lib/types';

interface SleepLogCardProps {
  log: SleepLog;
  onEdit?: (log: SleepLog) => void;
  onDelete?: (id: string) => void;
}

export function SleepLogCard({ log, onEdit, onDelete }: SleepLogCardProps) {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getQualityColor = (rating: number | null): string => {
    if (!rating) return 'text-gray-400';
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityEmoji = (rating: number | null): string => {
    if (!rating) return '😴';
    if (rating >= 9) return '😊';
    if (rating >= 7) return '🙂';
    if (rating >= 5) return '😐';
    return '😞';
  };

  return (
    <Card variant="outlined" className="hover:shadow-md transition-shadow">
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {format(new Date(log.sleepDate), 'MMM d, yyyy')}
              </h3>
              {log.qualityRating && (
                <span className="text-2xl" title={`Quality: ${log.qualityRating}/10`}>
                  {getQualityEmoji(log.qualityRating)}
                </span>
              )}
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Sleep:</span>
                <span>{log.sleptAt}</span>
                <span>→</span>
                <span>{log.wokeAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Duration:</span>
                <span className="text-indigo-600 font-semibold">
                  {formatDuration(log.durationMinutes)}
                </span>
              </div>

              {log.qualityRating && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Quality:</span>
                  <span
                    className={`font-semibold ${getQualityColor(log.qualityRating)}`}
                  >
                    {log.qualityRating}/10
                  </span>
                </div>
              )}
            </div>

            {log.notes && (
              <p className="mt-3 text-sm text-gray-700 italic bg-gray-50 p-2 rounded">
                {log.notes}
              </p>
            )}

            <div className="mt-3 text-xs text-gray-400">
              Created: {format(new Date(log.createdAt), 'MMM d, h:mm a')}
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(log)}
                className="text-indigo-600"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(log.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
