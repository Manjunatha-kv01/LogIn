import express from 'express';
import { UserRepository } from './repositories/userRepository.js';
import { PasswordHasher } from './utils/passwordHasher.js';
import { TokenFactory } from './utils/tokenFactory.js';
import { AuthService } from './services/authService.js';
import { AuthController } from './controllers/authController.js';
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express();
app.use(express.json());

const authService = new AuthService(new UserRepository(), new PasswordHasher(), new TokenFactory());
const authController = new AuthController(authService);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
app.get('/auth/me', authMiddleware(authService), authController.me);
app.post('/auth/logout', authMiddleware(authService), authController.logout);

export { app };
