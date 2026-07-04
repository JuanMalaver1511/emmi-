import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { ChevronLeft } from 'lucide-react';
import { formatCOP } from '../utils/format';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shippingName: user?.name || '',
    shippingEmail: user?.email || '',
    shippingPhone: '',
    shippingAddress: user?.address || '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    notes: '',
  });

  if (!user) { navigate('/login?redirect=/checkout', { replace: true }); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await api.orders.create({
        ...form,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color })),
      });
      await clearCart();
      navigate(`/pedidos/${order.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/carrito" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <ChevronLeft size={16} /> Volver al carrito
      </Link>
      <h1 className="text-2xl font-bold mb-8">Finalizar Pedido</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-semibold">Información de Envío</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input required value={form.shippingName} onChange={update('shippingName')} placeholder="Nombre completo" className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input required type="email" value={form.shippingEmail} onChange={update('shippingEmail')} placeholder="Email" className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input value={form.shippingPhone} onChange={update('shippingPhone')} placeholder="Teléfono" className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input required value={form.shippingZip} onChange={update('shippingZip')} placeholder="Código Postal" className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <textarea required value={form.shippingAddress} onChange={update('shippingAddress')} placeholder="Dirección" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" rows={2} />
          <div className="grid sm:grid-cols-2 gap-4">
            <input required value={form.shippingCity} onChange={update('shippingCity')} placeholder="Ciudad" className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input required value={form.shippingState} onChange={update('shippingState')} placeholder="Estado/Provincia" className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <textarea value={form.notes} onChange={update('notes')} placeholder="Notas del pedido (opcional)" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" rows={2} />
        </div>

        <div>
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="font-semibold mb-4">Resumen</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{item.product.name} x{item.quantity}</span>
                  <span className="font-medium">{formatCOP(Number(item.product.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCOP(total)}</span>
            </div>
            <button type="submit" disabled={loading} className="w-full mt-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors">
              {loading ? 'Procesando...' : `Pagar ${formatCOP(total)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
