import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';

export function authMiddleware(authService: AuthService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization;
      if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing bearer token' });
      const token = header.substring('Bearer '.length);
      const session = await authService.getUserFromToken(token);
      res.locals.session = session;
      next();
    } catch {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }
  };
}
