// En local (dev) queda vacío y usa el proxy de Vite (/api → localhost:4000).
// En producción (Railway) se define VITE_API_URL con la URL pública del backend.
const API = (import.meta.env.VITE_API_URL || '') + '/api';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers as Record<string, string> };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  auth: {
    login: (data: { email: string; password: string }) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: { name: string; email: string; password: string }) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request('/auth/me'),
    updateProfile: (data: { name?: string; phone?: string; address?: string }) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  products: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request('/products' + qs);
    },
    get: (slug: string) => request(`/products/${slug}`),
  },
  categories: {
    list: () => request('/categories'),
    get: (slug: string) => request(`/categories/${slug}`),
  },
  cart: {
    list: () => request('/cart'),
    add: (data: { productId: string; quantity?: number; size?: string; color?: string; wholesale?: boolean }) => request('/cart', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, quantity: number) => request(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    remove: (id: string) => request(`/cart/${id}`, { method: 'DELETE' }),
    clear: () => request('/cart', { method: 'DELETE' }),
  },
  orders: {
    list: () => request('/orders'),
    get: (id: string) => request(`/orders/${id}`),
    create: (data: { shippingName: string; shippingEmail: string; shippingPhone?: string; shippingAddress: string; shippingCity: string; shippingState: string; shippingZip: string; notes?: string; items: { productId: string; quantity: number; size?: string; color?: string; wholesale?: boolean }[] }) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  },
  reviews: {
    create: (productId: string, data: { rating: number; comment?: string }) => request(`/reviews/${productId}`, { method: 'POST', body: JSON.stringify(data) }),
  },
  admin: {
    dashboard: () => request('/admin/dashboard'),
    products: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request('/admin/products' + qs);
    },
    createProduct: (data: any) => request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id: string, data: any) => request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id: string) => request(`/admin/products/${id}`, { method: 'DELETE' }),
    categories: () => request('/admin/categories'),
    createCategory: (data: any) => request('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
    updateCategory: (id: string, data: any) => request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCategory: (id: string) => request(`/admin/categories/${id}`, { method: 'DELETE' }),
    orders: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request('/admin/orders' + qs);
    },
    updateOrderStatus: (id: string, status: string) => request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    users: () => request('/admin/users'),
  },
};
