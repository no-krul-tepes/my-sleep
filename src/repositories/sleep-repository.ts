/**
 * Sleep Repository
 * Data access layer for sleep logs
 */

import { db } from '../lib/db/client';
import { QUERIES } from '../lib/db/queries';
import type {
  SleepLog,
  CreateSleepLogDTO,
  UpdateSleepLogDTO,
  SleepLogFilters,
} from '../lib/types';
import {
  DatabaseError,
  NotFoundError,
  ConflictError,
  logError,
} from '../lib/errors';
import { API_DEFAULTS } from '../lib/constants';
import { toSQLDate } from '../lib/utils';

/**
 * Database row type
 */
interface SleepLogRow {
  id: string;
  user_id: number;
  sleep_date: Date;
  slept_at: string;
  woke_at: string;
  duration_minutes: number;
  notes: string | null;
  quality_rating: number | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Map database row to domain model
 */
function mapRowToSleepLog(row: SleepLogRow): SleepLog {
  return {
    id: row.id,
    userId: row.user_id,
    sleepDate: row.sleep_date,
    sleptAt: row.slept_at,
    wokeAt: row.woke_at,
    durationMinutes: row.duration_minutes,
    notes: row.notes,
    qualityRating: row.quality_rating,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SleepRepository {
  /**
   * Create a new sleep log
   */
  async create(
    data: CreateSleepLogDTO,
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<SleepLog> {
    try {
      // Check for duplicate entry
      const duplicateCheck = await db.query(QUERIES.CHECK_DUPLICATE, [
        userId,
        toSQLDate(data.sleepDate),
        data.sleptAt,
      ]);

      if (duplicateCheck.rows.length > 0) {
        throw new ConflictError(
          'A sleep log already exists for this date and time'
        );
      }

      // Insert new record
      const result = await db.query<SleepLogRow>(QUERIES.CREATE_SLEEP_LOG, [
        userId,
        toSQLDate(data.sleepDate),
        data.sleptAt,
        data.wokeAt,
        data.notes ?? null,
        data.qualityRating ?? null,
      ]);

      if (result.rows.length === 0) {
        throw new DatabaseError('Failed to create sleep log');
      }

      return mapRowToSleepLog(result.rows[0]);
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      
      logError(error, 'SleepRepository.create');
      throw new DatabaseError('Failed to create sleep log');
    }
  }

  /**
   * Find sleep log by ID
   */
  async findById(
    id: string,
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<SleepLog | null> {
    try {
      const result = await db.query<SleepLogRow>(
        QUERIES.GET_SLEEP_LOG_BY_ID,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return mapRowToSleepLog(result.rows[0]);
    } catch (error) {
      logError(error, 'SleepRepository.findById');
      throw new DatabaseError('Failed to fetch sleep log');
    }
  }

  /**
   * Find all sleep logs with filters
   */
  async findAll(
    filters: SleepLogFilters = {}
  ): Promise<{ data: SleepLog[]; count: number }> {
    try {
      const {
        dateFrom,
        dateTo,
        limit = API_DEFAULTS.DEFAULT_LIMIT,
        userId = API_DEFAULTS.DEFAULT_USER_ID,
      } = filters;

      // Get logs
      const logsResult = await db.query<SleepLogRow>(
        QUERIES.GET_SLEEP_LOGS_LIST,
        [
          userId,
          dateFrom ? toSQLDate(dateFrom) : null,
          dateTo ? toSQLDate(dateTo) : null,
          limit,
        ]
      );

      // Get count
      const countResult = await db.query<{ count: string }>(
        QUERIES.COUNT_SLEEP_LOGS,
        [
          userId,
          dateFrom ? toSQLDate(dateFrom) : null,
          dateTo ? toSQLDate(dateTo) : null,
        ]
      );

      const data = logsResult.rows.map(mapRowToSleepLog);
      const count = parseInt(countResult.rows[0]?.count ?? '0', 10);

      return { data, count };
    } catch (error) {
      logError(error, 'SleepRepository.findAll');
      throw new DatabaseError('Failed to fetch sleep logs');
    }
  }

  /**
   * Update sleep log
   */
  async update(
    id: string,
    data: UpdateSleepLogDTO,
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<SleepLog> {
    try {
      // Check if exists
      const existing = await this.findById(id, userId);
      
      if (!existing) {
        throw new NotFoundError('Sleep log');
      }

      // Update record
      const result = await db.query<SleepLogRow>(QUERIES.UPDATE_SLEEP_LOG, [
        id,
        data.sleepDate ? toSQLDate(data.sleepDate) : null,
        data.sleptAt ?? null,
        data.wokeAt ?? null,
        data.notes !== undefined ? data.notes : null,
        data.qualityRating !== undefined ? data.qualityRating : null,
        userId,
      ]);

      if (result.rows.length === 0) {
        throw new DatabaseError('Failed to update sleep log');
      }

      return mapRowToSleepLog(result.rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      logError(error, 'SleepRepository.update');
      throw new DatabaseError('Failed to update sleep log');
    }
  }

  /**
   * Delete sleep log
   */
  async delete(
    id: string,
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<void> {
    try {
      const result = await db.query(QUERIES.DELETE_SLEEP_LOG, [id, userId]);

      if (result.rowCount === 0) {
        throw new NotFoundError('Sleep log');
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      logError(error, 'SleepRepository.delete');
      throw new DatabaseError('Failed to delete sleep log');
    }
  }

  /**
   * Get latest sleep log
   */
  async getLatest(
    userId: number = API_DEFAULTS.DEFAULT_USER_ID
  ): Promise<SleepLog | null> {
    try {
      const result = await db.query<SleepLogRow>(
        QUERIES.GET_LATEST_SLEEP_LOG,
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return mapRowToSleepLog(result.rows[0]);
    } catch (error) {
      logError(error, 'SleepRepository.getLatest');
      throw new DatabaseError('Failed to fetch latest sleep log');
    }
  }

  /**
   * Count total sleep logs
   */
  async count(userId: number = API_DEFAULTS.DEFAULT_USER_ID): Promise<number> {
    try {
      const result = await db.query<{ count: string }>(
        QUERIES.COUNT_SLEEP_LOGS,
        [userId, null, null]
      );

      return parseInt(result.rows[0]?.count ?? '0', 10);
    } catch (error) {
      logError(error, 'SleepRepository.count');
      throw new DatabaseError('Failed to count sleep logs');
    }
  }
}

// Singleton instance
export const sleepRepository = new SleepRepository();
