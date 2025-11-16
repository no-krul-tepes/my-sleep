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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Sleep Statistics
        </h1>
        <p className="text-gray-600 mt-1">
          Analyze your sleep patterns and trends
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-8">
        <Button
          variant={period === 'week' ? 'primary' : 'ghost'}
          onClick={() => setPeriod('week')}
        >
          Last Week
        </Button>
        <Button
          variant={period === 'month' ? 'primary' : 'ghost'}
          onClick={() => setPeriod('month')}
        >
          Last Month
        </Button>
        <Button
          variant={period === 'all' ? 'primary' : 'ghost'}
          onClick={() => setPeriod('all')}
        >
          All Time
        </Button>
      </div>

      {/* Statistics */}
      {statistics ? (
        <SleepStatistics statistics={statistics} isLoading={isLoading} />
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600">
            Start logging your sleep to see statistics
          </p>
        </div>
      )}
    </div>
  );
}
