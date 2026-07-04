import { Router, Response } from 'express';
import { prisma } from '../index.js';

const router = Router();

router.get('/', async (_req, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: { where: { published: true } } } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req, res: Response) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: { _count: { select: { products: { where: { published: true } } } } },
    });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
