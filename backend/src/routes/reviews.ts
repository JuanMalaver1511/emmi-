import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';
import { reviewSchema } from '../utils/validators.js';
import { AuthRequest } from '../types/index.js';

const router = Router();

router.post('/:productId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = reviewSchema.parse(req.body);
    const productId = String(req.params.productId);
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: req.user!.id, productId } },
    });
    if (existing) return res.status(400).json({ error: 'You already reviewed this product' });

    const review = await prisma.review.create({
      data: { ...data, userId: req.user!.id, productId },
      include: { user: { select: { id: true, name: true } } },
    });
    res.status(201).json(review);
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ error: 'Validation error', details: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
