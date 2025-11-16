/**
 * Auth Database Migrations
 * NextAuth.js required tables
 */

import { db } from './client';
import { DatabaseError, logError } from '../errors';

/**
 * Create NextAuth tables
 * Based on @auth/pg-adapter schema
 */
const CREATE_AUTH_TABLES = `
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified TIMESTAMPTZ,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

  -- Accounts table (OAuth providers)
  CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    UNIQUE(provider, provider_account_id)
  );

  -- Sessions table
  CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL
  );

  -- Verification tokens table
  CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (identifier, token)
  );
`;

/**
 * Create indexes for auth tables
 */
const CREATE_AUTH_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON sessions(session_token);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;

/**
 * Update sleep_logs table to use proper foreign key
 */
const UPDATE_SLEEP_LOGS_FK = `
  -- Drop existing default constraint
  ALTER TABLE sleep_logs
    ALTER COLUMN user_id DROP DEFAULT;

  -- Add foreign key constraint if not exists
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'fk_sleep_logs_user_id'
    ) THEN
      ALTER TABLE sleep_logs
        ADD CONSTRAINT fk_sleep_logs_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE;
    END IF;
  END $$;
`;

/**
 * Create updated_at trigger for users table
 */
const CREATE_USERS_TRIGGER = `
  DROP TRIGGER IF EXISTS update_users_updated_at ON users;

  CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;

/**
 * Check if auth migrations have been run
 */
async function checkAuthMigrationStatus(): Promise<boolean> {
  try {
    const result = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'users'
      ) as table_exists
    `);

    return result.rows[0]?.table_exists ?? false;
  } catch (error) {
    logError(error, 'AuthMigrationCheck');
    return false;
  }
}

/**
 * Run auth migrations
 */
export async function runAuthMigrations(): Promise<void> {
  console.log('Starting auth database migrations...');

  try {
    // Check if already migrated
    const alreadyMigrated = await checkAuthMigrationStatus();

    if (alreadyMigrated) {
      console.log('Auth tables already exist. Skipping...');
      return;
    }

    // Run migrations in transaction
    await db.transaction(async (client) => {
      console.log('Creating auth tables...');
      await client.query(CREATE_AUTH_TABLES);

      console.log('Creating auth indexes...');
      await client.query(CREATE_AUTH_INDEXES);

      console.log('Creating users trigger...');
      await client.query(CREATE_USERS_TRIGGER);

      console.log('Updating sleep_logs foreign key...');
      await client.query(UPDATE_SLEEP_LOGS_FK);
    });

    console.log('✅ Auth migrations completed successfully');
  } catch (error) {
    logError(error, 'AuthMigrations');
    throw new DatabaseError('Failed to run auth migrations');
  }
}

/**
 * Verify auth schema
 */
export async function verifyAuthSchema(): Promise<boolean> {
  try {
    const requiredTables = ['users', 'accounts', 'sessions', 'verification_tokens'];

    for (const tableName of requiredTables) {
      const result = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = $1
        ) as table_exists
      `, [tableName]);

      if (!result.rows[0]?.table_exists) {
        console.error(`Auth schema verification failed: Missing table ${tableName}`);
        return false;
      }
    }

    console.log('✅ Auth schema verification passed');
    return true;
  } catch (error) {
    logError(error, 'AuthSchemaVerification');
    return false;
  }
}
