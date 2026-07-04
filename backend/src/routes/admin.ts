import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { productSchema, categorySchema } from '../utils/validators.js';
import { AuthRequest } from '../types/index.js';

const router = Router();
router.use(authenticate, requireAdmin);

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
}

// Dashboard
router.get('/dashboard', async (_req: AuthRequest, res: Response) => {
  try {
    const [totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders, lowStock] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } } } }),
      prisma.product.findMany({ where: { stock: { lte: 10 } }, orderBy: { stock: 'asc' }, take: 10 }),
    ]);

    const ordersByStatus = await prisma.order.groupBy({ by: ['status'], _count: true });

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
      lowStock,
      ordersByStatus,
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Products CRUD
router.get('/products', async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: { category: true, _count: { select: { orderItems: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.product.count(),
    ]);

    res.json({ products, total, page: parseInt(page as string), pages: Math.ceil(total / take) });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/products', async (req: AuthRequest, res: Response) => {
  try {
    const data = productSchema.parse(req.body);
    const slug = slugify(data.name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) return res.status(400).json({ error: 'A product with this name already exists' });

    const product = await prisma.product.create({
      data: { ...data, slug, price: data.price, sizes: data.sizes ?? [], colors: data.colors ?? [] },
      include: { category: true },
    });
    res.status(201).json(product);
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ error: 'Validation error', details: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/products/:id', async (req: AuthRequest, res: Response) => {
  try {
    const data = productSchema.partial().parse(req.body);
    const updateData: any = { ...data };
    if (data.name) updateData.slug = slugify(data.name);

    const product = await prisma.product.update({
      where: { id: String(req.params.id) },
      data: updateData,
      include: { category: true },
    });
    res.json(product);
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ error: 'Validation error', details: err.errors });
    if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/products/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: String(req.params.id) } });
    res.json({ message: 'Product deleted' });
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Categories CRUD
router.get('/categories', async (_req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/categories', async (req: AuthRequest, res: Response) => {
  try {
    const data = categorySchema.parse(req.body);
    const slug = slugify(data.name);
    const category = await prisma.category.create({ data: { ...data, slug } });
    res.status(201).json(category);
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ error: 'Validation error', details: err.errors });
    if (err.code === 'P2002') return res.status(400).json({ error: 'Category already exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/categories/:id', async (req: AuthRequest, res: Response) => {
  try {
    const data = categorySchema.partial().parse(req.body);
    const updateData: any = { ...data };
    if (data.name) updateData.slug = slugify(data.name);

    const category = await prisma.category.update({
      where: { id: String(req.params.id) },
      data: updateData,
    });
    res.json(category);
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ error: 'Validation error', details: err.errors });
    if (err.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/categories/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: String(req.params.id) } });
    res.json({ message: 'Category deleted' });
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Orders
router.get('/orders', async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const where: any = {};
    if (status) where.status = status;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } }, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ orders, total, page: parseInt(page as string), pages: Math.ceil(total / take) });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/orders/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const valid = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const order = await prisma.order.update({
      where: { id: String(req.params.id) },
      data: { status },
      include: { items: { include: { product: true } }, user: { select: { name: true, email: true } } },
    });
    res.json(order);
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Order not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Users
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { orders: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.user.count(),
    ]);

    res.json({ users, total, page: parseInt(page as string), pages: Math.ceil(total / take) });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
