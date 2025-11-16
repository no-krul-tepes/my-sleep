/**
 * Database Seed Script
 * Populates database with sample sleep log data
 * Usage: bun run src/scripts/seed.ts
 */

import { db } from '../lib/db/client';
import { sleepService } from '../services/sleep-service';
import type { CreateSleepLogDTO } from '../lib/types';

// Sample sleep logs for different patterns
const sampleLogs: CreateSleepLogDTO[] = [
  // Last 7 days - Good sleep pattern
  {
    sleepDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    sleptAt: '23:00',
    wokeAt: '07:00',
    qualityRating: 8,
    notes: 'Felt refreshed and energized',
  },
  {
    sleepDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    sleptAt: '23:30',
    wokeAt: '07:30',
    qualityRating: 9,
    notes: 'Perfect sleep, no interruptions',
  },
  {
    sleepDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    sleptAt: '22:45',
    wokeAt: '06:45',
    qualityRating: 7,
    notes: 'Good overall, woke up once',
  },
  {
    sleepDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    sleptAt: '00:00',
    wokeAt: '08:00',
    qualityRating: 8,
    notes: 'Solid 8 hours',
  },
  {
    sleepDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    sleptAt: '22:30',
    wokeAt: '06:30',
    qualityRating: 9,
    notes: 'Early to bed, early to rise',
  },
  {
    sleepDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    sleptAt: '23:15',
    wokeAt: '07:15',
    qualityRating: 7,
    notes: 'Decent sleep, felt a bit tired',
  },
  {
    sleepDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    sleptAt: '01:00',
    wokeAt: '09:00',
    qualityRating: 6,
    notes: 'Late night, slept in',
  },

  // Last 2 weeks - Mixed pattern
  {
    sleepDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    sleptAt: '23:00',
    wokeAt: '06:00',
    qualityRating: 5,
    notes: 'Woke up too early, could not fall back asleep',
  },
  {
    sleepDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    sleptAt: '22:00',
    wokeAt: '06:00',
    qualityRating: 8,
    notes: 'Full 8 hours, good quality',
  },
  {
    sleepDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    sleptAt: '00:30',
    wokeAt: '07:30',
    qualityRating: 6,
    notes: 'Went to bed late, felt groggy',
  },
  {
    sleepDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    sleptAt: '23:00',
    wokeAt: '08:00',
    qualityRating: 9,
    notes: 'Weekend sleep - very restful',
  },
  {
    sleepDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    sleptAt: '01:30',
    wokeAt: '09:30',
    qualityRating: 7,
    notes: 'Late Friday night, slept in Saturday',
  },
  {
    sleepDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    sleptAt: '23:30',
    wokeAt: '06:30',
    qualityRating: 6,
    notes: 'Work stress, restless sleep',
  },
  {
    sleepDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    sleptAt: '22:30',
    wokeAt: '06:00',
    qualityRating: 7,
    notes: 'Good start to the week',
  },

  // Last month - More variety
  {
    sleepDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    sleptAt: '23:00',
    wokeAt: '05:30',
    qualityRating: 4,
    notes: 'Poor sleep, many interruptions',
  },
  {
    sleepDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    sleptAt: '22:00',
    wokeAt: '07:00',
    qualityRating: 9,
    notes: 'Perfect sleep routine',
  },
  {
    sleepDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    sleptAt: '00:00',
    wokeAt: '06:00',
    qualityRating: 5,
    notes: 'Only 6 hours, felt tired',
  },
  {
    sleepDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    sleptAt: '23:30',
    wokeAt: '08:30',
    qualityRating: 8,
    notes: 'Good long sleep',
  },
];

// Sample naps (multiple sessions per day)
const sampleNaps: CreateSleepLogDTO[] = [
  {
    sleepDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    sleptAt: '14:00',
    wokeAt: '14:30',
    qualityRating: 7,
    notes: 'Power nap after lunch',
  },
  {
    sleepDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    sleptAt: '15:00',
    wokeAt: '16:00',
    qualityRating: 6,
    notes: 'Afternoon nap',
  },
];

async function main() {
  console.log('🌱 Starting database seeding...\n');

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

    // Check if data already exists
    const existingCount = await sleepService.getTotalCount();
    
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing sleep logs`);
      console.log('Do you want to add more sample data? (y/n)');
      
      // For non-interactive, skip confirmation
      if (process.env.CI || process.env.SKIP_CONFIRMATION) {
        console.log('Skipping confirmation in non-interactive mode\n');
      }
    }

    // Insert night sleep logs
    console.log('💤 Inserting sample sleep logs...');
    let successCount = 0;
    let skipCount = 0;

    for (const log of sampleLogs) {
      try {
        await sleepService.createSleepLog(log);
        successCount++;
        process.stdout.write('.');
      } catch (error) {
        // Skip duplicates
        skipCount++;
        process.stdout.write('s');
      }
    }

    console.log(`\n✅ Inserted ${successCount} sleep logs (${skipCount} skipped as duplicates)`);

    // Insert naps
    console.log('\n😴 Inserting sample naps...');
    let napSuccessCount = 0;
    let napSkipCount = 0;

    for (const nap of sampleNaps) {
      try {
        await sleepService.createSleepLog(nap);
        napSuccessCount++;
        process.stdout.write('.');
      } catch (error) {
        napSkipCount++;
        process.stdout.write('s');
      }
    }

    console.log(`\n✅ Inserted ${napSuccessCount} naps (${napSkipCount} skipped as duplicates)`);

    // Show summary
    const totalCount = await sleepService.getTotalCount();
    console.log('\n📊 Database summary:');
    console.log(`   Total sleep logs: ${totalCount}`);
    console.log(`   Newly added: ${successCount + napSuccessCount}`);
    console.log(`   Skipped: ${skipCount + napSkipCount}\n`);

    console.log('🎉 Seeding completed successfully!');
    console.log('\nNext steps:');
    console.log('  1. Run "bun dev" to start the application');
    console.log('  2. Visit http://localhost:3000 to see your data');

    // Graceful shutdown
    await db.shutdown();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:');
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
