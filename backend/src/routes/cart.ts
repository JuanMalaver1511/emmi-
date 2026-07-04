import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';
import { cartItemSchema } from '../utils/validators.js';
import { AuthRequest } from '../types/index.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = cartItemSchema.parse(req.body);
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId_size_color: { userId: req.user!.id, productId: data.productId, size: data.size ?? '', color: data.color ?? '' } },
    });

    if (existing) {
      const item = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + data.quantity },
        include: { product: true },
      });
      return res.json(item);
    }

    const item = await prisma.cartItem.create({
      data: { ...data, userId: req.user!.id, size: data.size ?? '', color: data.color ?? '' },
      include: { product: true },
    });
    res.status(201).json(item);
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ error: 'Validation error', details: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    const id = String(req.params.id);
    const item = await prisma.cartItem.findFirst({ where: { id, userId: req.user!.id } });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const item = await prisma.cartItem.findFirst({ where: { id, userId: req.user!.id } });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await prisma.cartItem.delete({ where: { id } });
    res.json({ message: 'Item removed' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user!.id } });
    res.json({ message: 'Cart cleared' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
