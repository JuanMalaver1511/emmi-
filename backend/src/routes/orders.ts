import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';
import { orderSchema } from '../utils/validators.js';
import { AuthRequest } from '../types/index.js';

const router = Router();

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = orderSchema.parse(req.body);
    const productIds = data.items.map(i => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map(p => [p.id, p]));

    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) return res.status(404).json({ error: `Product ${item.productId} not found` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
    }

    const orderItems = data.items.map(item => {
      const product = productMap.get(item.productId)!;
      const price = item.wholesale && product.wholesalePrice ? product.wholesalePrice : product.price;
      return {
        productId: item.productId,
        quantity: item.quantity,
        size: item.size ?? '',
        color: item.color ?? '',
        price,
      };
    });

    const total = orderItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const order = await prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          userId: req.user!.id,
          total,
          shippingName: data.shippingName,
          shippingEmail: data.shippingEmail,
          shippingPhone: data.shippingPhone,
          shippingAddress: data.shippingAddress,
          shippingCity: data.shippingCity,
          shippingState: data.shippingState,
          shippingZip: data.shippingZip,
          notes: data.notes,
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });
    });

    await prisma.cartItem.deleteMany({ where: { userId: req.user!.id } });

    res.status(201).json(order);
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ error: 'Validation error', details: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: String(req.params.id), userId: req.user!.id },
      include: { items: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
