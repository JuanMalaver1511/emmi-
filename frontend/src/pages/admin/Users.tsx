import { useEffect, useState } from 'react';
import { api } from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.users().then(d => setUsers(d.users)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Rol</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Pedidos</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Registro</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50"><td colSpan={5}><div className="h-12 bg-gray-50 animate-pulse" /></td></tr>
              )) : users.map(user => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-right">{user._count?.orders || 0}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
