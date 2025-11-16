/**
 * Sleep domain types
 * Core entities for the sleep logging application
 */

export interface SleepLog {
  id: string;
  userId: number;
  sleepDate: Date;
  sleptAt: string; // HH:MM format
  wokeAt: string; // HH:MM format
  durationMinutes: number; // Auto-calculated by DB
  notes: string | null;
  qualityRating: number | null; // 1-10
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSleepLogDTO {
  sleepDate: Date;
  sleptAt: string; // HH:MM
  wokeAt: string; // HH:MM
  notes?: string;
  qualityRating?: number; // 1-10
}

export interface UpdateSleepLogDTO {
  sleepDate?: Date;
  sleptAt?: string;
  wokeAt?: string;
  notes?: string;
  qualityRating?: number;
}

export interface SleepLogFilters {
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  userId?: number;
}

export interface SleepStatistics {
  averageDuration: number; // minutes
  averageQuality: number | null;
  totalSessions: number;
  bestDay: {
    date: Date;
    duration: number;
    quality: number | null;
  } | null;
  worstDay: {
    date: Date;
    duration: number;
    quality: number | null;
  } | null;
  weeklyBreakdown: Array<{
    weekStart: Date;
    avgDuration: number;
    avgQuality: number | null;
    sessionCount: number;
  }>;
}

export interface DateRange {
  start: Date;
  end: Date;
}
