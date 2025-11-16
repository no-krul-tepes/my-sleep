/**
 * Application constants
 * Centralized configuration values and enums
 */

export const DATABASE_CONFIG = {
  MAX_POOL_SIZE: 20,
  IDLE_TIMEOUT_MS: 30000,
  CONNECTION_TIMEOUT_MS: 5000,
} as const;

export const SLEEP_CONSTRAINTS = {
  MIN_QUALITY_RATING: 1,
  MAX_QUALITY_RATING: 10,
  MAX_NOTES_LENGTH: 2000,
  MIN_DURATION_MINUTES: 1,
  MAX_DURATION_MINUTES: 1440, // 24 hours
} as const;

export const API_DEFAULTS = {
  DEFAULT_LIMIT: 100,
  MAX_LIMIT: 500,
  DEFAULT_USER_ID: 1,
} as const;

export const TIME_FORMAT = {
  TIME_INPUT: 'HH:mm',
  DATE_INPUT: 'yyyy-MM-dd',
  DISPLAY_DATE: 'MMM d, yyyy',
  DISPLAY_TIME: 'h:mm a',
  ISO_DATE: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

export const ERROR_MESSAGES = {
  INVALID_TIME_FORMAT: 'Time must be in HH:MM format',
  INVALID_DATE: 'Invalid date provided',
  INVALID_QUALITY_RATING: `Quality rating must be between ${SLEEP_CONSTRAINTS.MIN_QUALITY_RATING} and ${SLEEP_CONSTRAINTS.MAX_QUALITY_RATING}`,
  WAKE_TIME_BEFORE_SLEEP: 'Wake time cannot be before sleep time on the same day',
  NOTES_TOO_LONG: `Notes cannot exceed ${SLEEP_CONSTRAINTS.MAX_NOTES_LENGTH} characters`,
  DATABASE_CONNECTION_FAILED: 'Failed to connect to database',
  SLEEP_LOG_NOT_FOUND: 'Sleep log not found',
  DUPLICATE_ENTRY: 'A sleep log already exists for this date and time',
} as const;

export const STATISTICS_PERIODS = {
  WEEK: 7,
  MONTH: 30,
  QUARTER: 90,
  YEAR: 365,
} as const;

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum DateShortcut {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
}
