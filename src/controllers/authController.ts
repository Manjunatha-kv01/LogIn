import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    if (!email || !password || password.length < 8) {
      return res.status(400).json({ message: 'Email and password (min 8 chars) are required' });
    }
    try {
      const user = await this.authService.register(email, password);
      return res.status(201).json({ user });
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_ALREADY_EXISTS') {
        return res.status(409).json({ message: 'Email already exists' });
      }
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    try {
      const result = await this.authService.authenticate(email, password);
      return res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  me = async (_req: Request, res: Response) => {
    return res.json({ session: res.locals.session });
  };

  logout = async (_req: Request, res: Response) => {
    await this.authService.logout(res.locals.session.sessionId);
    return res.json({ message: 'Logged out successfully' });
  };
}
