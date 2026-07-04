import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { DashboardStats } from '../../types';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { formatCOP } from '../../utils/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.dashboard().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl" />)}
    </div>
    <div className="h-64 bg-gray-100 rounded-xl" />
  </div>;

  if (!stats) return null;

  const cards = [
    { label: 'Productos', value: stats.totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pedidos', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-purple-50 text-purple-600' },
    { label: 'Usuarios', value: stats.totalUsers, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Ingresos', value: formatCOP(stats.totalRevenue), icon: DollarSign, color: 'bg-primary-50 text-primary-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon size={20} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold mb-4">Últimos Pedidos</h3>
          <div className="space-y-3">
            {stats.recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-mono">#{order.id.slice(0, 8)}</span>
                <span className="font-medium">{formatCOP(order.total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold mb-4">Stock Bajo</h3>
          <div className="space-y-3">
            {stats.lowStock.map(product => (
              <div key={product.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{product.name}</span>
                <span className="text-red-600 font-medium">{product.stock} uds.</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
