import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Trash2, ArrowRight, ChevronLeft, Package } from 'lucide-react';
import { formatCOP } from '../utils/format';

export default function Cart() {
  const { items, count, total, updateItem, removeItem } = useCart();
  const { user } = useAuth();

  const unitPrice = (item: typeof items[0]) =>
    item.wholesale && item.product.wholesalePrice ? Number(item.product.wholesalePrice) : Number(item.product.price);

  if (count === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingBag size={24} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-bold mb-2">Tu carrito está vacío</h2>
      <p className="text-gray-500 mb-6">Agrega productos para comenzar.</p>
      <Link to="/productos" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
        Ver productos <ArrowRight size={18} />
      </Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Carrito ({count} {count === 1 ? 'producto' : 'productos'})</h1>

      <div className="space-y-4 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
            <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img src={item.product.images[0] || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200'} alt={item.product.name} className="w-full h-full object-cover" />
            </div>
              <div className="flex-1 min-w-0">
                <Link to={`/productos/${item.product.slug}`} className="font-medium text-sm hover:text-primary-600 transition-colors">{item.product.name}</Link>
                <div className="text-xs text-gray-400 mt-0.5">
                  {item.size && <span>Talla: {item.size}</span>}
                  {item.color && <span className="ml-2">Color: {item.color}</span>}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {item.wholesale && (
                    <span className="text-[10px] font-medium text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded flex items-center gap-0.5"><Package size={10} /> Por mayor</span>
                  )}
                  <span className="text-xs text-gray-400">{formatCOP(unitPrice(item))} c/u</span>
                </div>
                <div className="text-sm font-semibold mt-1">{formatCOP(unitPrice(item) * item.quantity)}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))} className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-50">-</button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateItem(item.id, item.quantity + 1)} className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-50">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">{formatCOP(total)}</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">Los gastos de envío se calculan al finalizar.</p>
        {user ? (
          <Link to="/checkout" className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
            Proceder al pago <ArrowRight size={18} />
          </Link>
        ) : (
          <Link to="/login?redirect=/checkout" className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
            Inicia sesión para comprar <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}
