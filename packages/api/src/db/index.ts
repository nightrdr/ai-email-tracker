import path from 'node:path';

import { config } from 'dotenv';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

config();
config({ path: path.resolve(__dirname, '../../.env'), override: false });
config({ path: path.resolve(__dirname, '../../../../.env'), override: false });

const DEFAULT_DEV_DATABASE_URL = 'postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev';
const DEFAULT_TEST_DATABASE_URL = 'postgresql://aitracker:devpassword@localhost:5433/ai_tracker_test';
const isTestEnv = process.env.NODE_ENV === 'test';
const connectionString = isTestEnv
  ? process.env.TEST_DATABASE_URL ?? DEFAULT_TEST_DATABASE_URL
  : process.env.DATABASE_URL ?? DEFAULT_DEV_DATABASE_URL;

export const pool = new Pool({
  connectionString,
  max: Number(process.env.PG_POOL_MAX ?? 20),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

pool.on('error', (error) => {
  console.error('Unexpected error on idle PostgreSQL client', error);
});

export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};

export const getClient = (): Promise<PoolClient> => {
  return pool.connect();
};

export const closePool = (): Promise<void> => {
  return pool.end();
};

export default pool;

