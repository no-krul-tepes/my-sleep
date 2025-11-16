/**
 * Utility functions
 * Helper functions for common operations
 */

import { format, parse, isValid, parseISO } from 'date-fns';
import { TIME_FORMAT } from './constants';

/**
 * Validate time format (HH:MM)
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Convert time string to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Calculate duration between two times (handles overnight)
 */
export function calculateDuration(sleptAt: string, wokeAt: string): number {
  const sleepMinutes = timeToMinutes(sleptAt);
  const wakeMinutes = timeToMinutes(wokeAt);
  
  if (wakeMinutes >= sleepMinutes) {
    return wakeMinutes - sleepMinutes;
  }
  
  // Overnight calculation
  return (24 * 60) - sleepMinutes + wakeMinutes;
}

/**
 * Format date for display
 */
export function formatDisplayDate(date: Date): string {
  return format(date, TIME_FORMAT.DISPLAY_DATE);
}

/**
 * Format time for display
 */
export function formatDisplayTime(time: string): string {
  const parsedTime = parse(time, TIME_FORMAT.TIME_INPUT, new Date());
  return format(parsedTime, TIME_FORMAT.DISPLAY_TIME);
}

/**
 * Parse ISO date string safely
 */
export function parseSafeDate(dateString: string): Date | null {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

/**
 * Convert date to SQL date format
 */
export function toSQLDate(date: Date): string {
  return format(date, TIME_FORMAT.DATE_INPUT);
}

/**
 * Get date range for statistics period
 */
export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return { start, end };
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Safe integer parsing
 */
export function parseIntSafe(value: unknown, defaultValue: number = 0): number {
  if (typeof value === 'number') {
    return Math.floor(value);
  }
  
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  
  return defaultValue;
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Check if value is non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
