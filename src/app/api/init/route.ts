/**
 * Database initialization endpoint
 * POST /api/init - Initialize database schema
 */

import { NextResponse } from 'next/server';
import { runMigrations, verifySchema } from '@/lib/db/migrations';
import { db } from '@/lib/db/client';
import { logError } from '@/lib/errors';

export async function GET() {
  try {
    // Health check first
    const isHealthy = await db.healthCheck();
    
    if (!isHealthy) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Run migrations
    await runMigrations(process.env.NODE_ENV !== 'production');

    // Verify schema
    const isValid = await verifySchema();

    if (!isValid) {
      return NextResponse.json(
        { error: 'Schema verification failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      stats: db.getStats(),
    });
  } catch (error) {
    logError(error, 'InitRoute');
    
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
