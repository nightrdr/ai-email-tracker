import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthError } from '../errors/app-error';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new AuthError('Authorization header missing'));
    return;
  }

  const token = header.substring('Bearer '.length);

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (_error) {
    next(new AuthError('Invalid or expired token'));
  }
}

