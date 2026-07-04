import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  images: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  stock: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  categoryId: z.string(),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const orderSchema = z.object({
  shippingName: z.string().min(2),
  shippingEmail: z.string().email(),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
  shippingState: z.string().min(2),
  shippingZip: z.string().min(3),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    size: z.string().optional(),
    color: z.string().optional(),
  })),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});
