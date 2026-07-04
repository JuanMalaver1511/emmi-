import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { Category } from '../../types';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: 0, comparePrice: undefined as number | undefined,
    images: [] as string[], sizes: [] as string[], colors: [] as string[],
    stock: 0, featured: false, published: true, categoryId: '',
  });

  const isEdit = !!id;

  useEffect(() => {
    api.admin.categories().then(setCategories);
    if (id) {
      api.admin.products({ limit: '100' }).then(d => {
        const product = d.products.find((p: any) => p.id === id);
        if (product) setForm({
          name: product.name, description: product.description, price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
          images: product.images, sizes: product.sizes, colors: product.colors,
          stock: product.stock, featured: product.featured, published: product.published,
          categoryId: product.categoryId,
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) await api.admin.updateProduct(id!, form);
      else await api.admin.createProduct(form);
      navigate('/admin/productos');
    } catch (err: any) {
      alert(err.message);
    } finally { setLoading(false); }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-medium block mb-1">Nombre</label>
            <input value={form.name} onChange={update('name')} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium block mb-1">Descripción</label>
            <textarea value={form.description} onChange={update('description')} required rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Precio</label>
            <input type="number" step="0.01" value={form.price} onChange={update('price')} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Precio comparativo</label>
            <input type="number" step="0.01" value={form.comparePrice || ''} onChange={e => setForm({ ...form, comparePrice: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Categoría</label>
            <select value={form.categoryId} onChange={update('categoryId')} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
              <option value="">Seleccionar...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Stock</label>
            <input type="number" value={form.stock} onChange={update('stock')} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Tallas (separadas por coma)</label>
            <input value={form.sizes.join(', ')} onChange={e => setForm({ ...form, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Colores (separados por coma)</label>
            <input value={form.colors.join(', ')} onChange={e => setForm({ ...form, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium block mb-1">URLs de imágenes (una por línea)</label>
            <textarea value={form.images.join('\n')} onChange={e => setForm({ ...form, images: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="col-span-2 flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              Destacado
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              Publicado
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors">
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
          </button>
          <button type="button" onClick={() => navigate('/admin/productos')} className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
