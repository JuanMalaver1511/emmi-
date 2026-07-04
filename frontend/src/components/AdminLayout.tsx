import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/productos', icon: Package, label: 'Productos' },
  { to: '/admin/categorias', icon: Tag, label: 'Categorías' },
  { to: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
  { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') navigate('/login');
  }, [user, navigate]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-xl tracking-tight">EMMI</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Panel de Administración</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const isActive = item.end ? location.pathname === '/admin' : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={18} />Volver a la tienda
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors w-full">
            <LogOut size={18} />Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">E</span>
          </div>
          <span className="font-bold text-lg">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/" className="p-2 text-gray-500"><ArrowLeft size={18} /></Link>
          <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-gray-500"><LogOut size={18} /></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:pt-0 pt-14">
        <div className="lg:hidden flex overflow-x-auto border-b border-gray-200 bg-white gap-1 px-2">
          {navItems.map(item => {
            const isActive = item.end ? location.pathname === '/admin' : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${isActive ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <item.icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex-1 p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
