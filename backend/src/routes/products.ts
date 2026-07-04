import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { optionalAuth } from '../middleware/auth.js';
import { productSchema } from '../utils/validators.js';
import { AuthRequest } from '../types/index.js';

const router = Router();

router.get('/', async (req, res: Response) => {
  try {
    const { category, featured, search, sort, page = '1', limit = '12' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = { published: true };
    if (category) where.category = { slug: category as string };
    if (featured === 'true') where.featured = true;
    if (search) where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'name') orderBy = { name: 'asc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, reviews: { select: { rating: true } } },
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithRating = products.map(p => ({
      ...p,
      avgRating: p.reviews.length ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length : 0,
      reviews: undefined,
    }));

    res.json({ products: productsWithRating, total, page: parseInt(page as string), pages: Math.ceil(total / take) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!product || (!product.published && req.user?.role !== 'ADMIN')) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, published: true },
      take: 4,
      include: { category: true },
    });

    res.json({ product, related });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
