import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchCategories = () => {
    setLoading(true);
    api.admin.categories().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createCategory(form);
      setForm({ name: '', description: '' });
      setShowNew(false);
      fetchCategories();
    } catch (err: any) { alert(err.message); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await api.admin.updateCategory(editing.id, form);
      setEditing(null);
      setForm({ name: '', description: '' });
      fetchCategories();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar categoría?')) return;
    await api.admin.deleteCategory(id);
    fetchCategories();
  };

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <button onClick={() => { setShowNew(true); setEditing(null); setForm({ name: '', description: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus size={16} /> Nueva
        </button>
      </div>

      {(showNew || editing) && (
        <form onSubmit={editing ? handleUpdate : handleCreate} className="bg-gray-50 rounded-xl p-4 mb-6 flex items-end gap-4">
          <div className="flex-1">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nombre" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2" />
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción (opcional)" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="p-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><Check size={18} /></button>
            <button type="button" onClick={() => { setShowNew(false); setEditing(null); }} className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100"><X size={18} /></button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Slug</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Productos</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [...Array(3)].map((_, i) => (
              <tr key={i} className="border-b border-gray-50"><td colSpan={4}><div className="h-12 bg-gray-50 animate-pulse" /></td></tr>
            )) : categories.map(cat => (
              <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                <td className="px-4 py-3 text-right">{cat._count?.products || 0}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => startEdit(cat)} className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
