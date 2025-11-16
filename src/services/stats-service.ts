/**
 * Statistics Service
 * Calculates sleep analytics and trends
 */

import { db } from '../lib/db/client';
import { QUERIES } from '../lib/db/queries';
import type { SleepStatistics, DateRange } from '../lib/types';
import { DatabaseError, logError } from '../lib/errors';
import { API_DEFAULTS, STATISTICS_PERIODS } from '../lib/constants';
import { toSQLDate, roundTo } from '../lib/utils';

interface DayStats {
  sleep_date: Date;
  duration_minutes: number;
  quality_rating: number | null;
}

interface WeeklyStats {
  week_start: Date;
  avg_duration: string;
  avg_quality: string | null;
  session_count: string;
}

export class StatsService {
  /**
   * Get comprehensive statistics for a date range
   */
  async getStatistics(
    dateRange: DateRange,
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<SleepStatistics> {
    try {
      const { start, end } = dateRange;
      const startDate = toSQLDate(start);
      const endDate = toSQLDate(end);

      // Run all queries in parallel for performance
      const [
        avgDurationResult,
        avgQualityResult,
        bestDayResult,
        worstDayResult,
        weeklyResult,
        totalSessionsResult,
      ] = await Promise.all([
        db.query<{ avg_duration: string | null }>(
          QUERIES.GET_AVERAGE_DURATION,
          [userId, startDate, endDate]
        ),
        db.query<{ avg_quality: string | null }>(
          QUERIES.GET_AVERAGE_QUALITY,
          [userId, startDate, endDate]
        ),
        db.query<DayStats>(QUERIES.GET_BEST_DAY, [userId, startDate, endDate]),
        db.query<DayStats>(QUERIES.GET_WORST_DAY, [userId, startDate, endDate]),
        db.query<WeeklyStats>(QUERIES.GET_WEEKLY_BREAKDOWN, [
          userId,
          startDate,
          endDate,
        ]),
        db.query<{ total: string }>(QUERIES.GET_TOTAL_SESSIONS, [
          userId,
          startDate,
          endDate,
        ]),
      ]);

      // Parse results
      const averageDuration = parseFloat(
        avgDurationResult.rows[0]?.avg_duration ?? '0'
      );
      const averageQuality = avgQualityResult.rows[0]?.avg_quality
        ? parseFloat(avgQualityResult.rows[0].avg_quality)
        : null;
      const totalSessions = parseInt(
        totalSessionsResult.rows[0]?.total ?? '0',
        10
      );

      const bestDay = bestDayResult.rows[0]
        ? {
            date: bestDayResult.rows[0].sleep_date,
            duration: bestDayResult.rows[0].duration_minutes,
            quality: bestDayResult.rows[0].quality_rating,
          }
        : null;

      const worstDay = worstDayResult.rows[0]
        ? {
            date: worstDayResult.rows[0].sleep_date,
            duration: worstDayResult.rows[0].duration_minutes,
            quality: worstDayResult.rows[0].quality_rating,
          }
        : null;

      const weeklyBreakdown = weeklyResult.rows.map((row) => ({
        weekStart: row.week_start,
        avgDuration: roundTo(parseFloat(row.avg_duration), 2),
        avgQuality: row.avg_quality ? roundTo(parseFloat(row.avg_quality), 2) : null,
        sessionCount: parseInt(row.session_count, 10),
      }));

      return {
        averageDuration: roundTo(averageDuration, 2),
        averageQuality: averageQuality ? roundTo(averageQuality, 2) : null,
        totalSessions,
        bestDay,
        worstDay,
        weeklyBreakdown,
      };
    } catch (error) {
      logError(error, 'StatsService.getStatistics');
      throw new DatabaseError('Failed to calculate statistics');
    }
  }

  /**
   * Get week statistics
   */
  async getWeekStats(
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<SleepStatistics> {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - STATISTICS_PERIODS.WEEK);

    return this.getStatistics({ start, end }, userId);
  }

  /**
   * Get month statistics
   */
  async getMonthStats(
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<SleepStatistics> {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - STATISTICS_PERIODS.MONTH);

    return this.getStatistics({ start, end }, userId);
  }

  /**
   * Get quality trend data for charts
   */
  async getQualityTrend(
    dateRange: DateRange,
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<Array<{ date: Date; quality: number; duration: number }>> {
    try {
      const { start, end } = dateRange;
      const result = await db.query<{
        sleep_date: Date;
        quality_rating: number;
        duration_minutes: number;
      }>(QUERIES.GET_SLEEP_QUALITY_TREND, [
        userId,
        toSQLDate(start),
        toSQLDate(end),
      ]);

      return result.rows.map((row) => ({
        date: row.sleep_date,
        quality: row.quality_rating,
        duration: row.duration_minutes,
      }));
    } catch (error) {
      logError(error, 'StatsService.getQualityTrend');
      throw new DatabaseError('Failed to fetch quality trend');
    }
  }

  /**
   * Calculate sleep consistency score (0-100)
   * Based on standard deviation of sleep/wake times
   */
  async getConsistencyScore(
    dateRange: DateRange,
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<number> {
    try {
      const { start, end } = dateRange;
      const result = await db.query<{
        slept_at: string;
        woke_at: string;
      }>(
        `
        SELECT slept_at, woke_at
        FROM sleep_logs
        WHERE user_id = $1
          AND sleep_date >= $2
          AND sleep_date <= $3
        ORDER BY sleep_date ASC
      `,
        [userId, toSQLDate(start), toSQLDate(end)]
      );

      if (result.rows.length < 2) {
        return 0; // Not enough data
      }

      // Convert times to minutes for calculation
      const sleepTimes = result.rows.map((row) => {
        const [hours, minutes] = row.slept_at.split(':').map(Number);
        return hours * 60 + minutes;
      });

      const wakeTimes = result.rows.map((row) => {
        const [hours, minutes] = row.woke_at.split(':').map(Number);
        return hours * 60 + minutes;
      });

      // Calculate standard deviation
      const sleepStdDev = this.calculateStandardDeviation(sleepTimes);
      const wakeStdDev = this.calculateStandardDeviation(wakeTimes);

      // Lower std dev = higher consistency
      // Max expected std dev is ~120 minutes (2 hours)
      const avgStdDev = (sleepStdDev + wakeStdDev) / 2;
      const consistencyScore = Math.max(0, 100 - (avgStdDev / 120) * 100);

      return roundTo(consistencyScore, 0);
    } catch (error) {
      logError(error, 'StatsService.getConsistencyScore');
      return 0;
    }
  }

  /**
   * Calculate standard deviation
   */
  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    const variance =
      squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

    return Math.sqrt(variance);
  }

  /**
   * Get sleep debt (hours behind optimal 8 hours)
   */
  async getSleepDebt(
    days: number = 7,
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<number> {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    const stats = await this.getStatistics({ start, end }, userId);
    const optimalMinutesPerDay = 8 * 60; // 8 hours
    const actualMinutesPerDay = stats.averageDuration;
    const debtPerDay = Math.max(0, optimalMinutesPerDay - actualMinutesPerDay);
    const totalDebtHours = (debtPerDay * days) / 60;

    return roundTo(totalDebtHours, 1);
  }

  /**
   * Get insights and recommendations
   */
  async getInsights(
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<string[]> {
    const insights: string[] = [];

    try {
      const weekStats = await this.getWeekStats(userId);
      const consistencyScore = await this.getConsistencyScore(
        {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date(),
        },
        userId
      );
      const sleepDebt = await this.getSleepDebt(7, userId);

      // Average duration insights
      if (weekStats.averageDuration < 360) {
        insights.push('⚠️ Your average sleep is below 6 hours. Consider going to bed earlier.');
      } else if (weekStats.averageDuration >= 480) {
        insights.push('✨ Great! You\'re getting 8+ hours of sleep on average.');
      }

      // Quality insights
      if (weekStats.averageQuality && weekStats.averageQuality < 5) {
        insights.push('💤 Your sleep quality is low. Consider improving your sleep environment.');
      } else if (weekStats.averageQuality && weekStats.averageQuality >= 8) {
        insights.push('⭐ Excellent sleep quality this week!');
      }

      // Consistency insights
      if (consistencyScore < 50) {
        insights.push('📊 Your sleep schedule is inconsistent. Try maintaining regular sleep times.');
      } else if (consistencyScore >= 80) {
        insights.push('🎯 Great sleep consistency! Keep it up.');
      }

      // Sleep debt insights
      if (sleepDebt > 10) {
        insights.push(`⏰ You have ${sleepDebt} hours of sleep debt. Prioritize rest this week.`);
      }

      return insights;
    } catch (error) {
      logError(error, 'StatsService.getInsights');
      return ['Unable to generate insights at this time.'];
    }
  }
}

// Singleton instance
export const statsService = new StatsService();
