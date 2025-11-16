/**
 * Database migrations
 * Schema initialization and updates
 */

import { db } from './client';
import { DatabaseError, logError } from '../errors';

/**
 * Create sleep_logs table with all constraints
 */
const CREATE_SLEEP_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS sleep_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL DEFAULT 1,
    sleep_date DATE NOT NULL,
    slept_at TIME NOT NULL,
    woke_at TIME NOT NULL,
    duration_minutes INTEGER GENERATED ALWAYS AS (
      CASE 
        WHEN woke_at >= slept_at THEN
          EXTRACT(EPOCH FROM (woke_at - slept_at))::INTEGER / 60
        ELSE
          (1440 - EXTRACT(EPOCH FROM slept_at - '00:00:00'::TIME)::INTEGER / 60) +
          (EXTRACT(EPOCH FROM woke_at - '00:00:00'::TIME)::INTEGER / 60)
      END
    ) STORED,
    notes TEXT,
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, sleep_date, slept_at)
  );
`;

/**
 * Create indexes for performance
 */
const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_date 
    ON sleep_logs(user_id, sleep_date DESC);
  
  CREATE INDEX IF NOT EXISTS idx_sleep_logs_created_at 
    ON sleep_logs(created_at DESC);
  
  CREATE INDEX IF NOT EXISTS idx_sleep_logs_quality 
    ON sleep_logs(quality_rating) 
    WHERE quality_rating IS NOT NULL;
`;

/**
 * Create updated_at trigger function
 */
const CREATE_UPDATED_AT_TRIGGER = `
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS update_sleep_logs_updated_at ON sleep_logs;
  
  CREATE TRIGGER update_sleep_logs_updated_at
    BEFORE UPDATE ON sleep_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;

/**
 * Insert sample data for testing (development only)
 */
const INSERT_SAMPLE_DATA = `
  INSERT INTO sleep_logs (user_id, sleep_date, slept_at, woke_at, notes, quality_rating)
  VALUES 
    (1, CURRENT_DATE - INTERVAL '1 day', '23:00', '07:00', 'Good night sleep', 8),
    (1, CURRENT_DATE - INTERVAL '2 days', '23:30', '06:30', 'Woke up a few times', 6),
    (1, CURRENT_DATE - INTERVAL '3 days', '22:00', '06:00', 'Perfect sleep', 9)
  ON CONFLICT (user_id, sleep_date, slept_at) DO NOTHING;
`;

/**
 * Check if migrations have been run
 */
async function checkMigrationStatus(): Promise<boolean> {
  try {
    const result = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'sleep_logs'
      ) as table_exists
    `);
    
    return result.rows[0]?.table_exists ?? false;
  } catch (error) {
    logError(error, 'MigrationCheck');
    return false;
  }
}

/**
 * Run all migrations
 */
export async function runMigrations(
  includeSampleData: boolean = false
): Promise<void> {
  console.log('Starting database migrations...');

  try {
    // Check if already migrated
    const alreadyMigrated = await checkMigrationStatus();
    
    if (alreadyMigrated) {
      console.log('Database already migrated. Skipping...');
      return;
    }

    // Run migrations in transaction
    await db.transaction(async (client) => {
      console.log('Creating sleep_logs table...');
      await client.query(CREATE_SLEEP_LOGS_TABLE);

      console.log('Creating indexes...');
      await client.query(CREATE_INDEXES);

      console.log('Creating triggers...');
      await client.query(CREATE_UPDATED_AT_TRIGGER);

      if (includeSampleData && process.env.NODE_ENV !== 'production') {
        console.log('Inserting sample data...');
        await client.query(INSERT_SAMPLE_DATA);
      }
    });

    console.log('✅ Migrations completed successfully');
  } catch (error) {
    logError(error, 'Migrations');
    throw new DatabaseError('Failed to run database migrations');
  }
}

/**
 * Drop all tables (use with caution!)
 */
export async function rollbackMigrations(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot rollback migrations in production');
  }

  console.log('Rolling back migrations...');

  try {
    await db.query('DROP TABLE IF EXISTS sleep_logs CASCADE');
    console.log('✅ Rollback completed');
  } catch (error) {
    logError(error, 'Rollback');
    throw new DatabaseError('Failed to rollback migrations');
  }
}

/**
 * Verify database schema
 */
export async function verifySchema(): Promise<boolean> {
  try {
    const result = await db.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns
      WHERE table_name = 'sleep_logs'
      ORDER BY ordinal_position
    `);

    const requiredColumns = [
      'id',
      'user_id',
      'sleep_date',
      'slept_at',
      'woke_at',
      'duration_minutes',
      'notes',
      'quality_rating',
      'created_at',
      'updated_at',
    ];

    const actualColumns = result.rows.map(row => row.column_name);
    const hasAllColumns = requiredColumns.every(col => 
      actualColumns.includes(col)
    );

    if (!hasAllColumns) {
      console.error('Schema verification failed: Missing columns');
      return false;
    }

    console.log('✅ Schema verification passed');
    return true;
  } catch (error) {
    logError(error, 'SchemaVerification');
    return false;
  }
}
