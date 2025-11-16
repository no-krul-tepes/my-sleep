/**
 * Sleep Logs API Routes
 * GET /api/sleep-logs - List sleep logs with filters
 * POST /api/sleep-logs - Create new sleep log
 */

import { NextRequest, NextResponse } from 'next/server';
import { sleepService } from '@/services/sleep-service';
import {
  createSleepLogSchema,
  queryParamsSchema,
} from '@/lib/validation';
import {
  AppError,
  ValidationError,
  logError,
  getErrorMessage,
} from '@/lib/errors';
import { parseSafeDate, parseIntSafe } from '@/lib/utils';
import { API_DEFAULTS } from '@/lib/constants';

/**
 * GET /api/sleep-logs
 * Query params: date_from, date_to, limit
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse and validate query parameters
    const queryValidation = queryParamsSchema.safeParse({
      date_from: searchParams.get('date_from'),
      date_to: searchParams.get('date_to'),
      limit: searchParams.get('limit'),
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        {
          error: {
            message: 'Invalid query parameters',
            code: 'VALIDATION_ERROR',
            status: 400,
            details: queryValidation.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { date_from, date_to, limit } = queryValidation.data;

    // Parse dates
    const dateFrom = date_from ? parseSafeDate(date_from) : undefined;
    const dateTo = date_to ? parseSafeDate(date_to) : undefined;

    if (date_from && !dateFrom) {
      throw new ValidationError('Invalid date_from format. Use ISO 8601');
    }

    if (date_to && !dateTo) {
      throw new ValidationError('Invalid date_to format. Use ISO 8601');
    }

    // Parse limit
    const parsedLimit = limit
      ? parseIntSafe(limit, API_DEFAULTS.DEFAULT_LIMIT)
      : API_DEFAULTS.DEFAULT_LIMIT;

    // Fetch sleep logs
    const result = await sleepService.getSleepLogs({
      dateFrom,
      dateTo,
      limit: parsedLimit,
    });

    return NextResponse.json({
      data: result.data,
      count: result.count,
    });
  } catch (error) {
    logError(error, 'GET /api/sleep-logs');

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: {
            message: error.message,
            code: error.code,
            status: error.statusCode,
          },
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: {
          message: getErrorMessage(error),
          code: 'INTERNAL_ERROR',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sleep-logs
 * Body: CreateSleepLogDTO
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = createSleepLogSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            status: 400,
            details: validation.error.format(),
          },
        },
        { status: 400 }
      );
    }

    // Create sleep log
    const sleepLog = await sleepService.createSleepLog(validation.data);

    return NextResponse.json(
      { data: sleepLog },
      { status: 201 }
    );
  } catch (error) {
    logError(error, 'POST /api/sleep-logs');

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: {
            message: error.message,
            code: error.code,
            status: error.statusCode,
          },
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: {
          message: getErrorMessage(error),
          code: 'INTERNAL_ERROR',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}
