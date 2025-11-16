/**
 * Individual Sleep Log API Routes
 * GET /api/sleep-logs/[id] - Get sleep log by ID
 * PATCH /api/sleep-logs/[id] - Update sleep log
 * DELETE /api/sleep-logs/[id] - Delete sleep log
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { sleepService } from '@/services/sleep-service';
import { updateSleepLogSchema, uuidSchema } from '@/lib/validation';
import {
  AppError,
  NotFoundError,
  logError,
  getErrorMessage,
} from '@/lib/errors';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/sleep-logs/[id]
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: {
            message: 'Необходима авторизация',
            code: 'UNAUTHORIZED',
            status: 401,
          },
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = uuidSchema.safeParse(id);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            message: 'Invalid ID format',
            code: 'VALIDATION_ERROR',
            status: 400,
          },
        },
        { status: 400 }
      );
    }

    // Fetch sleep log
    const sleepLog = await sleepService.getSleepLogById(id);

    if (!sleepLog) {
      throw new NotFoundError('Sleep log');
    }

    return NextResponse.json({ data: sleepLog });
  } catch (error) {
    logError(error, 'GET /api/sleep-logs/[id]');

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
 * PATCH /api/sleep-logs/[id]
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: {
            message: 'Необходима авторизация',
            code: 'UNAUTHORIZED',
            status: 401,
          },
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Validate UUID
    const idValidation = uuidSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json(
        {
          error: {
            message: 'Invalid ID format',
            code: 'VALIDATION_ERROR',
            status: 400,
          },
        },
        { status: 400 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validation = updateSleepLogSchema.safeParse(body);

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

    // Update sleep log
    const updatedLog = await sleepService.updateSleepLog(id, validation.data);

    return NextResponse.json({ data: updatedLog });
  } catch (error) {
    logError(error, 'PATCH /api/sleep-logs/[id]');

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
 * DELETE /api/sleep-logs/[id]
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: {
            message: 'Необходима авторизация',
            code: 'UNAUTHORIZED',
            status: 401,
          },
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = uuidSchema.safeParse(id);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            message: 'Invalid ID format',
            code: 'VALIDATION_ERROR',
            status: 400,
          },
        },
        { status: 400 }
      );
    }

    // Delete sleep log
    await sleepService.deleteSleepLog(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logError(error, 'DELETE /api/sleep-logs/[id]');

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
