import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Order } from '../../types';

const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const statusLabels: Record<string, string> = { PENDING: 'Pendiente', CONFIRMED: 'Confirmado', SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado' };

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filter) params.status = filter;
    api.admin.orders(params).then(d => setOrders(d.orders)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatus = async (id: string, status: string) => {
    await api.admin.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
          <option value="">Todos</option>
          {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Pedido</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Cliente</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Total</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Fecha</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50"><td colSpan={6}><div className="h-12 bg-gray-50 animate-pulse" /></td></tr>
              )) : orders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-500">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{order.user?.name}</div>
                    <div className="text-xs text-gray-400">{order.user?.email}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">${Number(order.total).toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>{statusLabels[order.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">{new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
                  <td className="px-4 py-3 text-center">
                    <select value={order.status} onChange={e => handleStatus(order.id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                      {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
