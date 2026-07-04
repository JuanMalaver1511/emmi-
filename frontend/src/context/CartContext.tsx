import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  count: number;
  total: number;
  addItem: (data: { productId: string; quantity?: number; size?: string; color?: string }) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>(null!);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try { setItems(await api.cart.list()); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const count = items.reduce((a, i) => a + i.quantity, 0);
  const total = items.reduce((a, i) => a + Number(i.product.price) * i.quantity, 0);

  const addItem = async (data: { productId: string; quantity?: number; size?: string; color?: string }) => {
    const item = await api.cart.add(data);
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx >= 0) { const copy = [...prev]; copy[idx] = item; return copy; }
      return [item, ...prev];
    });
  };

  const updateItem = async (id: string, quantity: number) => {
    const updated = await api.cart.update(id, quantity);
    setItems(prev => prev.map(i => i.id === id ? updated : i));
  };

  const removeItem = async (id: string) => {
    await api.cart.remove(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = async () => {
    await api.cart.clear();
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, loading, count, total, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
