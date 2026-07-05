import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, Product, User } from '../types';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

const GUEST_CART_KEY = 'EEMI_guest_cart';

interface GuestItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  product: Product;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  count: number;
  total: number;
  addItem: (data: { productId: string; quantity?: number; size?: string; color?: string; product?: Product }) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>(null!);

function generateId() {
  return 'guest_' + Math.random().toString(36).substring(2, 10);
}

function loadGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed: GuestItem[] = JSON.parse(raw);
    return parsed.map(g => ({
      id: generateId(),
      productId: g.productId,
      quantity: g.quantity,
      size: g.size,
      color: g.color,
      product: g.product,
    }));
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  const data: GuestItem[] = items.map(i => ({
    productId: i.productId,
    quantity: i.quantity,
    size: i.size,
    color: i.color,
    product: i.product,
  }));
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(data));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [prevUser, setPrevUser] = useState<User | null | undefined>(undefined);
  const { user } = useAuth();

  // Merge guest cart into server cart on login
  const mergeGuestCart = useCallback(async () => {
    const guestItems = loadGuestCart();
    if (guestItems.length === 0) return;

    setLoading(true);
    try {
      for (const item of guestItems) {
        try {
          await api.cart.add({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          });
        } catch {
          // skip items that fail
        }
      }
      localStorage.removeItem(GUEST_CART_KEY);
      const serverItems = await api.cart.list();
      setItems(serverItems);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  // Sync cart when auth state changes
  useEffect(() => {
    if (prevUser === undefined) {
      setPrevUser(user);
      return;
    }

    if (user && !prevUser) {
      // Just logged in — merge guest cart
      mergeGuestCart();
    } else if (!user && prevUser) {
      // Just logged out — clear server cart, load guest if any
      setItems(loadGuestCart());
    } else if (user) {
      // User is logged in (already was) — fetch server cart
      setLoading(true);
      api.cart.list().then(setItems).catch(() => {}).finally(() => setLoading(false));
    }

    setPrevUser(user);
  }, [user, prevUser, mergeGuestCart]);

  // Initial load: guest cart if not logged in
  useEffect(() => {
    if (!user) {
      setItems(loadGuestCart());
    }
  }, []);

  const count = items.reduce((a, i) => a + i.quantity, 0);
  const total = items.reduce((a, i) => a + Number(i.product.price) * i.quantity, 0);

  const addItem = async (data: { productId: string; quantity?: number; size?: string; color?: string; product?: Product }) => {
    if (user) {
      const item = await api.cart.add(data);
      setItems(prev => {
        const idx = prev.findIndex(i => i.id === item.id);
        if (idx >= 0) { const copy = [...prev]; copy[idx] = item; return copy; }
        return [item, ...prev];
      });
    } else {
      const product = data.product!;
      setItems(prev => {
        const existing = prev.find(
          i => i.productId === data.productId && i.size === (data.size ?? '') && i.color === (data.color ?? '')
        );
        if (existing) {
          const updated = prev.map(i =>
            i.productId === data.productId && i.size === (data.size ?? '') && i.color === (data.color ?? '')
              ? { ...i, quantity: i.quantity + (data.quantity ?? 1) }
              : i
          );
          saveGuestCart(updated);
          return updated;
        }
        const newItem: CartItem = {
          id: generateId(),
          productId: data.productId,
          quantity: data.quantity ?? 1,
          size: data.size,
          color: data.color,
          product,
        };
        const updated = [newItem, ...prev];
        saveGuestCart(updated);
        return updated;
      });
    }
  };

  const updateItem = async (id: string, quantity: number) => {
    if (user) {
      const updated = await api.cart.update(id, quantity);
      setItems(prev => prev.map(i => i.id === id ? updated : i));
    } else {
      setItems(prev => {
        const updated = prev.map(i => i.id === id ? { ...i, quantity } : i);
        saveGuestCart(updated);
        return updated;
      });
    }
  };

  const removeItem = async (id: string) => {
    if (user) {
      await api.cart.remove(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev => {
        const updated = prev.filter(i => i.id !== id);
        saveGuestCart(updated);
        return updated;
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      await api.cart.clear();
    }
    localStorage.removeItem(GUEST_CART_KEY);
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, loading, count, total, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
