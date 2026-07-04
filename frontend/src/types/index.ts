export interface User {
  id: string; name: string; email: string; role: string; phone?: string; address?: string;
}

export interface Category {
  id: string; name: string; slug: string; description?: string; image?: string;
  _count?: { products: number };
}

export interface Product {
  id: string; name: string; slug: string; description: string; price: number;
  comparePrice?: number; images: string[]; sizes: string[]; colors: string[];
  stock: number; featured: boolean; published: boolean; categoryId: string;
  category?: Category; avgRating?: number; reviews?: Review[];
  createdAt: string; updatedAt: string;
}

export interface CartItem {
  id: string; quantity: number; size?: string; color?: string;
  userId?: string; productId: string; product: Product;
  createdAt?: string; updatedAt?: string;
}

export interface Order {
  id: string; userId: string; total: number; status: string;
  shippingName: string; shippingEmail: string; shippingPhone?: string;
  shippingAddress: string; shippingCity: string; shippingState: string; shippingZip: string;
  notes?: string; items: OrderItem[];
  user?: { id: string; name: string; email: string };
  createdAt: string; updatedAt: string;
}

export interface OrderItem {
  id: string; quantity: number; size?: string; color?: string; price: number;
  productId: string; product: Product;
}

export interface Review {
  id: string; rating: number; comment?: string;
  userId: string; user?: { id: string; name: string };
  productId: string; createdAt: string;
}

export interface DashboardStats {
  totalProducts: number; totalOrders: number; totalUsers: number;
  totalRevenue: number; recentOrders: Order[]; lowStock: Product[];
  ordersByStatus: { status: string; _count: number }[];
}
