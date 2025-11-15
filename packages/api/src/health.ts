import { query } from './db';

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW() AS current_time');
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

