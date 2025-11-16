/**
 * Sleep Service
 * Business logic for sleep log operations
 */

import { sleepRepository } from '../repositories/sleep-repository';
import type {
  SleepLog,
  CreateSleepLogDTO,
  UpdateSleepLogDTO,
  SleepLogFilters,
} from '../lib/types';
import { ValidationError } from '../lib/errors';
import { calculateDuration } from '../lib/utils';
import { SLEEP_CONSTRAINTS } from '../lib/constants';

export class SleepService {
  constructor(private repository: typeof sleepRepository) {}

  /**
   * Validate sleep log data
   */
  private validateSleepData(data: CreateSleepLogDTO | UpdateSleepLogDTO): void {
    // Validate quality rating if provided
    if (data.qualityRating !== undefined && data.qualityRating !== null) {
      if (
        data.qualityRating < SLEEP_CONSTRAINTS.MIN_QUALITY_RATING ||
        data.qualityRating > SLEEP_CONSTRAINTS.MAX_QUALITY_RATING
      ) {
        throw new ValidationError(
          `Quality rating must be between ${SLEEP_CONSTRAINTS.MIN_QUALITY_RATING} and ${SLEEP_CONSTRAINTS.MAX_QUALITY_RATING}`
        );
      }
    }

    // Validate notes length if provided
    if (data.notes && data.notes.length > SLEEP_CONSTRAINTS.MAX_NOTES_LENGTH) {
      throw new ValidationError(
        `Notes cannot exceed ${SLEEP_CONSTRAINTS.MAX_NOTES_LENGTH} characters`
      );
    }

    // Validate duration if both times are provided
    if ('sleptAt' in data && 'wokeAt' in data && data.sleptAt && data.wokeAt) {
      const duration = calculateDuration(data.sleptAt, data.wokeAt);

      if (duration < SLEEP_CONSTRAINTS.MIN_DURATION_MINUTES) {
        throw new ValidationError(
          `Sleep duration must be at least ${SLEEP_CONSTRAINTS.MIN_DURATION_MINUTES} minute`
        );
      }

      if (duration > SLEEP_CONSTRAINTS.MAX_DURATION_MINUTES) {
        throw new ValidationError(
          `Sleep duration cannot exceed ${SLEEP_CONSTRAINTS.MAX_DURATION_MINUTES} minutes (24 hours)`
        );
      }
    }
  }

  /**
   * Create a new sleep log
   */
  async createSleepLog(data: CreateSleepLogDTO): Promise<SleepLog> {
    this.validateSleepData(data);
    const userId = data.userId || 1; // Fallback to default user
    return this.repository.create(data, userId);
  }

  /**
   * Get sleep log by ID
   */
  async getSleepLogById(id: string, userId?: number): Promise<SleepLog | null> {
    return this.repository.findById(id, userId);
  }

  /**
   * Get all sleep logs with filters
   */
  async getSleepLogs(
    filters: SleepLogFilters = {}
  ): Promise<{ data: SleepLog[]; count: number }> {
    // Validate date range
    if (filters.dateFrom && filters.dateTo) {
      if (filters.dateFrom > filters.dateTo) {
        throw new ValidationError('dateFrom cannot be after dateTo');
      }
    }

    // Validate limit
    if (filters.limit !== undefined) {
      if (filters.limit < 1) {
        throw new ValidationError('Limit must be at least 1');
      }
      if (filters.limit > 500) {
        throw new ValidationError('Limit cannot exceed 500');
      }
    }

    return this.repository.findAll(filters);
  }

  /**
   * Update sleep log
   */
  async updateSleepLog(
    id: string,
    data: UpdateSleepLogDTO,
    userId?: number
  ): Promise<SleepLog> {
    this.validateSleepData(data);
    return this.repository.update(id, data, userId);
  }

  /**
   * Delete sleep log
   */
  async deleteSleepLog(id: string, userId?: number): Promise<void> {
    return this.repository.delete(id, userId);
  }

  /**
   * Get latest sleep log
   */
  async getLatestSleepLog(userId?: number): Promise<SleepLog | null> {
    return this.repository.getLatest(userId);
  }

  /**
   * Get total count of sleep logs
   */
  async getTotalCount(userId?: number): Promise<number> {
    return this.repository.count(userId);
  }

  /**
   * Check if sleep log exists
   */
  async exists(id: string, userId?: number): Promise<boolean> {
    const log = await this.repository.findById(id, userId);
    return log !== null;
  }

  /**
   * Bulk delete sleep logs by IDs
   */
  async bulkDelete(ids: string[], userId?: number): Promise<number> {
    let deletedCount = 0;

    for (const id of ids) {
      try {
        await this.repository.delete(id, userId);
        deletedCount++;
      } catch (error) {
        // Continue deleting others even if one fails
        console.error(`Failed to delete sleep log ${id}:`, error);
      }
    }

    return deletedCount;
  }

  /**
   * Get sleep logs for a specific date
   */
  async getSleepLogsForDate(
    date: Date,
    userId?: number
  ): Promise<SleepLog[]> {
    const { data } = await this.repository.findAll({
      dateFrom: date,
      dateTo: date,
      userId,
    });

    return data;
  }

  /**
   * Get sleep logs for date range
   */
  async getSleepLogsInRange(
    startDate: Date,
    endDate: Date,
    userId?: number
  ): Promise<SleepLog[]> {
    if (startDate > endDate) {
      throw new ValidationError('Start date cannot be after end date');
    }

    const { data } = await this.repository.findAll({
      dateFrom: startDate,
      dateTo: endDate,
      userId,
    });

    return data;
  }
}

// Singleton instance
export const sleepService = new SleepService(sleepRepository);
