/**
 * PostgreSQL database client
 * Manages connection pool with graceful shutdown
 */

import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { DATABASE_CONFIG } from '../constants';
import { DatabaseError, logError } from '../errors';

class DatabaseClient {
  private pool: Pool | null = null;
  private isShuttingDown = false;

  /**
   * Initialize connection pool
   */
  private initializePool(): Pool {
    if (this.pool) {
      return this.pool;
    }

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    this.pool = new Pool({
      connectionString: databaseUrl,
      max: DATABASE_CONFIG.MAX_POOL_SIZE,
      idleTimeoutMillis: DATABASE_CONFIG.IDLE_TIMEOUT_MS,
      connectionTimeoutMillis: DATABASE_CONFIG.CONNECTION_TIMEOUT_MS,
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false }
        : undefined,
    });

    // Error handling for pool
    this.pool.on('error', (err) => {
      logError(err, 'DatabasePool');
      console.error('Unexpected error on idle client', err);
    });

    // Connection event logging
    this.pool.on('connect', () => {
      console.log('New database connection established');
    });

    this.pool.on('remove', () => {
      console.log('Database connection removed from pool');
    });

    return this.pool;
  }

  /**
   * Get connection pool instance
   */
  public getPool(): Pool {
    return this.initializePool();
  }

  /**
   * Execute a query with automatic error handling
   */
  public async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    if (this.isShuttingDown) {
      throw new DatabaseError('Database is shutting down');
    }

    const pool = this.getPool();

    try {
      const start = Date.now();
      const result = await pool.query<T>(text, params);
      const duration = Date.now() - start;

      if (process.env.NODE_ENV === 'development') {
        console.log('Query executed:', {
          text: text.substring(0, 100),
          duration: `${duration}ms`,
          rows: result.rowCount,
        });
      }

      return result;
    } catch (error) {
      logError(error, 'DatabaseQuery');
      
      if (error instanceof Error) {
        throw new DatabaseError(
          `Database query failed: ${error.message}`,
          error
        );
      }
      
      throw new DatabaseError('Unknown database error occurred');
    }
  }

  /**
   * Execute a transaction
   */
  public async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    if (this.isShuttingDown) {
      throw new DatabaseError('Database is shutting down');
    }

    const pool = this.getPool();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      logError(error, 'DatabaseTransaction');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check database connection health
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW()');
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logError(error, 'DatabaseHealthCheck');
      return false;
    }
  }

  /**
   * Get pool statistics
   */
  public getStats() {
    const pool = this.pool;
    
    if (!pool) {
      return null;
    }

    return {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
    };
  }

  /**
   * Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    if (this.isShuttingDown || !this.pool) {
      return;
    }

    this.isShuttingDown = true;
    console.log('Shutting down database connection pool...');

    try {
      await this.pool.end();
      console.log('Database pool closed successfully');
    } catch (error) {
      logError(error, 'DatabaseShutdown');
      throw new DatabaseError('Failed to close database pool');
    } finally {
      this.pool = null;
      this.isShuttingDown = false;
    }
  }
}

// Singleton instance
export const db = new DatabaseClient();

// Graceful shutdown handlers
if (typeof process !== 'undefined') {
  const shutdownHandler = async () => {
    await db.shutdown();
    process.exit(0);
  };

  process.on('SIGINT', shutdownHandler);
  process.on('SIGTERM', shutdownHandler);
}
