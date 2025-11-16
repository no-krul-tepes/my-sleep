/**
 * Validation schemas using Zod
 * Input validation for sleep-related operations
 */

import { z } from 'zod';
import { SLEEP_CONSTRAINTS, ERROR_MESSAGES } from '../constants';
import { isValidTimeFormat } from '../utils';

/**
 * Time string validation (HH:MM format)
 */
const timeSchema = z
  .string()
  .refine(isValidTimeFormat, {
    message: ERROR_MESSAGES.INVALID_TIME_FORMAT,
  });

/**
 * Quality rating validation (1-10)
 */
const qualityRatingSchema = z
  .number()
  .int()
  .min(SLEEP_CONSTRAINTS.MIN_QUALITY_RATING)
  .max(SLEEP_CONSTRAINTS.MAX_QUALITY_RATING)
  .optional();

/**
 * Notes validation
 */
const notesSchema = z
  .string()
  .max(SLEEP_CONSTRAINTS.MAX_NOTES_LENGTH, {
    message: ERROR_MESSAGES.NOTES_TOO_LONG,
  })
  .optional();

/**
 * Date validation
 */
const dateSchema = z.coerce.date({
  errorMap: () => ({ message: ERROR_MESSAGES.INVALID_DATE }),
});

/**
 * Create Sleep Log DTO validation
 */
export const createSleepLogSchema = z
  .object({
    sleepDate: dateSchema,
    sleptAt: timeSchema,
    wokeAt: timeSchema,
    notes: notesSchema,
    qualityRating: qualityRatingSchema,
  })
  .strict();

/**
 * Update Sleep Log DTO validation (all fields optional)
 */
export const updateSleepLogSchema = z
  .object({
    sleepDate: dateSchema.optional(),
    sleptAt: timeSchema.optional(),
    wokeAt: timeSchema.optional(),
    notes: notesSchema,
    qualityRating: qualityRatingSchema,
  })
  .strict()
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.values(data).some((value) => value !== undefined);
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

/**
 * Sleep log filters validation
 */
export const sleepLogFiltersSchema = z
  .object({
    dateFrom: dateSchema.optional(),
    dateTo: dateSchema.optional(),
    limit: z
      .number()
      .int()
      .positive()
      .max(500)
      .optional(),
    userId: z.number().int().positive().optional(),
  })
  .strict();

/**
 * UUID validation
 */
export const uuidSchema = z.string().uuid({
  message: 'Invalid ID format',
});

/**
 * Query parameters validation
 */
export const queryParamsSchema = z.object({
  date_from: z.string().nullable().optional(),
  date_to: z.string().nullable().optional(),
  limit: z.string().nullable().optional(),
});

/**
 * Type exports
 */
export type CreateSleepLogInput = z.infer<typeof createSleepLogSchema>;
export type UpdateSleepLogInput = z.infer<typeof updateSleepLogSchema>;
export type SleepLogFiltersInput = z.infer<typeof sleepLogFiltersSchema>;
export type QueryParamsInput = z.infer<typeof queryParamsSchema>;
