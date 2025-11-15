import { closePool } from '../src/db';

process.env.DATABASE_URL ??= 'postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev';
process.env.TEST_DATABASE_URL ??= 'postgresql://aitracker:devpassword@localhost:5433/ai_tracker_test';
process.env.JWT_SECRET ??= 'test-secret';
process.env.JWT_EXPIRES_IN ??= '7d';
process.env.BCRYPT_ROUNDS ??= '4';
process.env.NODE_ENV = 'test';

declare global {
  var __poolCleanupRegistered: boolean | undefined;
}

if (!global.__poolCleanupRegistered) {
  afterAll(async () => {
    await closePool();
  });
  global.__poolCleanupRegistered = true;
}

export {};

