/**
 * Database Migration Script
 * Run migrations to initialize database schema
 * Usage: bun run src/scripts/migrate.ts
 */

import { runMigrations, verifySchema } from '../lib/db/migrations';
import { runAuthMigrations, verifyAuthSchema } from '../lib/db/auth-migrations';
import { db } from '../lib/db/client';

async function main() {
  console.log('🚀 Starting database migration...\n');

  try {
    // Check database connection
    console.log('📡 Checking database connection...');
    const isHealthy = await db.healthCheck();

    if (!isHealthy) {
      console.error('❌ Database connection failed');
      console.error('Please check your DATABASE_URL in .env file');
      process.exit(1);
    }

    console.log('✅ Database connection successful\n');

    // Run app migrations
    console.log('📝 Running app migrations...');
    await runMigrations(process.env.NODE_ENV !== 'production');
    console.log('✅ App migrations completed\n');

    // Run auth migrations
    console.log('🔐 Running auth migrations...');
    await runAuthMigrations();
    console.log('✅ Auth migrations completed\n');

    // Verify schemas
    console.log('🔍 Verifying app schema...');
    const isValid = await verifySchema();

    if (!isValid) {
      console.error('❌ App schema verification failed');
      process.exit(1);
    }

    console.log('✅ App schema verification passed\n');

    console.log('🔍 Verifying auth schema...');
    const isAuthValid = await verifyAuthSchema();

    if (!isAuthValid) {
      console.error('❌ Auth schema verification failed');
      process.exit(1);
    }

    console.log('✅ Auth schema verification passed\n');

    // Show pool stats
    const stats = db.getStats();
    if (stats) {
      console.log('📊 Connection pool stats:');
      console.log(`   Total connections: ${stats.total}`);
      console.log(`   Idle connections: ${stats.idle}`);
      console.log(`   Waiting connections: ${stats.waiting}\n`);
    }

    console.log('🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('  1. Run "bun run src/scripts/seed.ts" to add sample data (optional)');
    console.log('  2. Run "bun dev" to start the application');

    // Graceful shutdown
    await db.shutdown();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error);
    
    // Try to shutdown gracefully
    try {
      await db.shutdown();
    } catch (shutdownError) {
      console.error('Failed to close database connection:', shutdownError);
    }

    process.exit(1);
  }
}

// Run the script
main();
