import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Order } from '../types';
import { Package, ChevronRight } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente', CONFIRMED: 'Confirmado', SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado',
};

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.orders.list().then(setOrders).finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Mis Pedidos</h1>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No tienes pedidos aún</p>
          <Link to="/productos" className="text-primary-600 font-medium text-sm mt-2 inline-block">Ir a la tienda</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} to={`/pedidos/${order.id}`} className="block bg-white border border-gray-100 rounded-xl p-5 hover:border-primary-200 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-gray-400">#{order.id.slice(0, 8)}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                  </div>
                  <p className="text-sm text-gray-600">{order.items.length} {order.items.length === 1 ? 'producto' : 'productos'} · ${Number(order.total).toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
