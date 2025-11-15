import app from './app';
import { checkDatabaseHealth } from './health';

const PORT = Number(process.env.PORT || 4000);

export const startApi = async (): Promise<void> => {
  const healthy = await checkDatabaseHealth();
  if (!healthy) {
    throw new Error('Database connection failed health check');
  }

  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
};

if (require.main === module) {
  startApi().catch((error) => {
    console.error('Failed to start API package:', error);
    process.exit(1);
  });
}
