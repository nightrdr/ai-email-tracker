import { spawn } from 'node:child_process';
import path from 'node:path';

import { Pool } from 'pg';

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://aitracker:devpassword@localhost:5433/ai_tracker_test';
export async function resetTestDatabase(): Promise<void> {
  await dropPublicSchema();
  await runMigrations('up');
}

export async function runMigrations(direction: 'up' | 'down' | 'redo'): Promise<void> {
  await execNodePgMigrate(direction);
}

async function dropPublicSchema(): Promise<void> {
  const pool = new Pool({ connectionString: TEST_DATABASE_URL });
  try {
    await pool.query('DROP SCHEMA IF EXISTS public CASCADE');
    await pool.query('CREATE SCHEMA public');
  } finally {
    await pool.end();
  }
}

function execNodePgMigrate(direction: 'up' | 'down' | 'redo'): Promise<void> {
  return new Promise((resolve, reject) => {
    const cliPath = path.resolve(__dirname, '../../node_modules/node-pg-migrate/bin/node-pg-migrate.js');
    const child = spawn(
      process.execPath,
      [cliPath, direction, '-f', '.migrate.json'],
      {
        cwd: path.resolve(__dirname, '../..'),
        env: {
          ...process.env,
          DATABASE_URL: TEST_DATABASE_URL,
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );

    let stderr = '';
    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr || `node-pg-migrate exited with code ${code}`));
      }
    });
  });
}

