/**
 * SleepLogCard Component
 * Displays individual sleep log entry
 */

'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
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
    return `${hours}ч ${mins}м`;
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
    <Card variant="outlined" className="hover:shadow-lg transition-all hover:scale-[1.01]">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              {log.qualityRating && (
                <span className="text-xl md:text-2xl flex-shrink-0" title={`Качество: ${log.qualityRating}/10`}>
                  {getQualityEmoji(log.qualityRating)}
                </span>
              )}
              <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                {format(new Date(log.sleepDate), 'd MMMM yyyy', { locale: ru })}
              </h3>
            </div>

            {/* Time and Duration */}
            <div className="space-y-1.5 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium min-w-[70px]">⏰ Время:</span>
                <span className="font-mono">{log.sleptAt}</span>
                <span className="text-gray-400">→</span>
                <span className="font-mono">{log.wokeAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium min-w-[70px]">⏱️ Длит.:</span>
                <span className="text-indigo-600 font-semibold font-mono">
                  {formatDuration(log.durationMinutes)}
                </span>
              </div>

              {log.qualityRating && (
                <div className="flex items-center gap-2">
                  <span className="font-medium min-w-[70px]">⭐ Качество:</span>
                  <span
                    className={`font-semibold ${getQualityColor(log.qualityRating)}`}
                  >
                    {log.qualityRating}/10
                  </span>
                </div>
              )}
            </div>

            {/* Notes */}
            {log.notes && (
              <p className="mt-3 text-xs md:text-sm text-gray-700 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 line-clamp-2">
                💭 {log.notes}
              </p>
            )}

            {/* Created time */}
            <div className="mt-2.5 text-xs text-gray-400">
              Создано: {format(new Date(log.createdAt), 'd MMM, HH:mm', { locale: ru })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex md:flex-col gap-1.5 md:gap-2 flex-shrink-0">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(log)}
                className="text-indigo-600 hover:bg-indigo-50 px-2 md:px-3"
                title="Редактировать"
              >
                <span className="hidden md:inline">✏️ Изменить</span>
                <span className="md:hidden">✏️</span>
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(log.id)}
                className="px-2 md:px-3"
                title="Удалить"
              >
                <span className="hidden md:inline">🗑️ Удалить</span>
                <span className="md:hidden">🗑️</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
