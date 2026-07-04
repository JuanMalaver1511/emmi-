import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Order } from '../types';
import { ChevronLeft, Package } from 'lucide-react';
import { formatCOP } from '../utils/format';

const statusLabels: Record<string, string> = { PENDING: 'Pendiente', CONFIRMED: 'Confirmado', SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado' };

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.orders.get(id).then(setOrder).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8"><div className="h-64 bg-gray-100 rounded-xl animate-pulse" /></div>;
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><p className="text-gray-500">Pedido no encontrado</p></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/pedidos" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <ChevronLeft size={16} /> Mis pedidos
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">Pedido #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary-50 text-primary-700">{statusLabels[order.status]}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-3">Dirección de Envío</h3>
          <p className="text-sm text-gray-600">{order.shippingName}<br />{order.shippingAddress}<br />{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
          {order.shippingPhone && <p className="text-sm text-gray-600 mt-1">{order.shippingPhone}</p>}
        </div>
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-3">Información del Pedido</h3>
          <p className="text-sm text-gray-600">Email: {order.shippingEmail}</p>
          <p className="text-sm text-gray-600">Total: <span className="font-semibold">{formatCOP(order.total)}</span></p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Productos</h3>
        {order.items.map(item => (
          <div key={item.id} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
            <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img src={item.product.images[0] || ''} alt={item.product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <Link to={`/productos/${item.product.slug}`} className="font-medium text-sm hover:text-primary-600">{item.product.name}</Link>
              <div className="text-xs text-gray-400 mt-0.5">
                {item.size && <span>Talla: {item.size}</span>}
                {item.color && <span className="ml-2">Color: {item.color}</span>}
              </div>
              <div className="text-sm font-medium mt-1">{formatCOP(Number(item.price) * item.quantity)} <span className="text-gray-400 font-normal">x{item.quantity}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
