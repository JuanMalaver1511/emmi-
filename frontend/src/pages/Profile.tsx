import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { User } from 'lucide-react';

export default function Profile() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.auth.updateProfile({ name, phone, address });
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {} finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center"><User size={24} className="text-primary-600" /></div>
        <div><h1 className="text-xl font-bold">Mi Perfil</h1><p className="text-sm text-gray-500">{user.email}</p></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {saved && <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">Perfil actualizado</p>}
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Teléfono" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Dirección" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" rows={2} />
        <button type="submit" disabled={saving} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors">
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
