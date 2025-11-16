/**
 * Statistics Page
 * Sleep analytics and insights
 */

'use client';

import { useState } from 'react';
import { SleepStatistics } from '@/components/sleep/SleepStatistics';
import { Button } from '@/components/ui/Button';
import { useStatistics } from '@/hooks/useStatistics';

type Period = 'week' | 'month' | 'all';

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>('week');

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setDate(start.getDate() - 30);
        break;
      case 'all':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }

    return { start, end };
  };

  const { statistics, isLoading } = useStatistics(getDateRange());

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          📊 Статистика сна
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Анализируйте свои паттерны и тренды сна
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2">
        <Button
          variant={period === 'week' ? 'primary' : 'ghost'}
          onClick={() => setPeriod('week')}
          className="whitespace-nowrap"
        >
          📅 Неделя
        </Button>
        <Button
          variant={period === 'month' ? 'primary' : 'ghost'}
          onClick={() => setPeriod('month')}
          className="whitespace-nowrap"
        >
          🗓️ Месяц
        </Button>
        <Button
          variant={period === 'all' ? 'primary' : 'ghost'}
          onClick={() => setPeriod('all')}
          className="whitespace-nowrap"
        >
          ⏳ Всё время
        </Button>
      </div>

      {/* Statistics */}
      {statistics ? (
        <SleepStatistics statistics={statistics} isLoading={isLoading} />
      ) : (
        <div className="text-center py-12 md:py-16 px-4">
          <div className="text-5xl md:text-6xl mb-3 md:mb-4">📊</div>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            Нет данных
          </h3>
          <p className="text-sm md:text-base text-gray-600">
            Начните записывать свой сон, чтобы увидеть статистику
          </p>
        </div>
      )}
    </div>
  );
}
