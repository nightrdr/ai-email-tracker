import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { AppError } from './errors/app-error';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'api' });
});

app.use('/api/auth', authRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message, details: err.details });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;

