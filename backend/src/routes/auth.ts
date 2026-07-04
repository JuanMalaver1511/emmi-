import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { authenticate } from '../middleware/auth.js';
import { AuthRequest } from '../types/index.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'emmi-secret-key';

router.post('/register', async (req, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { ...data, password: hashed },
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ error: 'Validation error', details: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ error: 'Validation error', details: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, address } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, phone, address },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
