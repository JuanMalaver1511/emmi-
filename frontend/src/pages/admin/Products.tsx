import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { Product } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    api.admin.products().then(d => setProducts(d.products)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar producto?')) return;
    await api.admin.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link to="/admin/productos/nuevo" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus size={16} /> Nuevo
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Producto</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Categoría</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Precio</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Stock</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Publicado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50"><td colSpan={6}><div className="h-12 bg-gray-50 animate-pulse" /></td></tr>
              )) : products.map(product => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img src={product.images[0] || ''} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product.category?.name}</td>
                  <td className="px-4 py-3 text-right font-medium">${Number(product.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{product.stock}</td>
                  <td className="px-4 py-3 text-center">{product.published ? <span className="text-green-600 font-medium">Sí</span> : <span className="text-gray-400">No</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/productos/${product.id}`} className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50"><Edit size={16} /></Link>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 size={16} /></button>
                    </div>
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
