import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import db from '../db/index.ts';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  createSession,
  revokeSession,
  revokeAllSessions,
  hashToken,
} from '../services/authService.ts';
import { authenticate, requireAuth } from '../middleware/auth.ts';
import type { UserRow } from '../db/userTypes.ts';

const router = Router();

function nameToColor(name: string): string {
  const colors = [
    '#059669',
    '#3B82F6',
    '#7C3AED',
    '#EC4899',
    '#F59E0B',
    '#EF4444',
    '#06B6D4',
    '#8B5CF6',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length]!;
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  displayName: z.string().min(2),
});

router.post('/register', (req, res) => {
  try {
    const { email, password, displayName } = registerSchema.parse(req.body);

    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const id = crypto.randomUUID();
    const passwordHash = hashPassword(password);
    const avatarUrl = nameToColor(displayName);

    db.prepare(
      `
      INSERT INTO users (id, email, password_hash, display_name, avatar_url)
      VALUES (?, ?, ?, ?, ?)
    `,
    ).run(id, email, passwordHash, displayName, avatarUrl);

    const token = generateToken();
    createSession(id, token, req.ip, req.get('user-agent'));

    const user = {
      id,
      email,
      displayName,
      role: 'user',
      avatarColor: avatarUrl,
      joinedAt: new Date().toISOString(),
    };

    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/login', (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = db.prepare<[string], UserRow>('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    const token = generateToken();
    createSession(user.id, token, req.ip, req.get('user-agent'));

    const userResponse = {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      role: user.role,
      avatarColor: user.avatar_url,
      joinedAt: user.created_at,
    };

    res.json({ user: userResponse, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/refresh', authenticate, requireAuth, (req, res) => {
  try {
    const user = req.user!;
    const oldToken = req.token!;

    revokeSession(hashToken(oldToken));

    const newToken = generateToken();
    createSession(user.id, newToken, req.ip, req.get('user-agent'));

    res.json({ token: newToken });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', authenticate, requireAuth, (req, res) => {
  try {
    revokeSession(hashToken(req.token!));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout-all', authenticate, requireAuth, (req, res) => {
  try {
    revokeAllSessions(req.user!.id);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authenticate, requireAuth, (req, res) => {
  res.json({ user: req.user });
});

/**
 * Express router instance containing authentication routes (register, login, refresh, logout, logout-all, me).
 *
 * @category Routes
 * @type {import('express').Router}
 * @example
 * import authRoutes from './routes/auth.ts';
 * app.use('/api/auth', authRoutes);
 */
export default router;
