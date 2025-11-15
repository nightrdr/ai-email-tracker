import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AppError } from '../errors/app-error';

const authService = new AuthService();

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authService.register({ email, password });
    res.status(201).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

function handleError(res: Response, error: unknown): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message, details: error.details });
    return;
  }

  console.error('Auth controller error:', error);
  res.status(500).json({ error: 'Internal server error' });
}

