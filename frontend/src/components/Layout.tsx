import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Package, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import EEMILogo from '../assets/EEMI.png';

export default function Layout() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <img src={EEMILogo} alt="EEMI" className="h-14 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Inicio</Link>
              <Link to="/productos" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Productos</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/carrito" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <ShoppingBag size={20} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">{count}</span>
                )}
              </Link>

              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/perfil" className="p-2 text-gray-600 hover:text-primary-600 transition-colors"><User size={20} /></Link>
                  <Link to="/pedidos" className="p-2 text-gray-600 hover:text-primary-600 transition-colors"><Package size={20} /></Link>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Admin</Link>
                  )}
                  <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-gray-600 hover:text-primary-600 transition-colors"><LogOut size={20} /></button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">Entrar</Link>
                  <Link to="/registro" className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Registrarse</Link>
                </div>
              )}

              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600">Inicio</Link>
            <Link to="/productos" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600">Productos</Link>
            {user ? (
              <>
                <Link to="/perfil" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600">Perfil</Link>
                <Link to="/pedidos" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600">Pedidos</Link>
                {user.role === 'ADMIN' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-primary-600">Admin</Link>}
                <button onClick={() => { logout(); navigate('/'); setMenuOpen(false); }} className="block text-sm font-medium text-gray-600">Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600">Entrar</Link>
                <Link to="/registro" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-primary-600">Registrarse</Link>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <img src={EEMILogo} alt="EEMI" className="h-14 w-auto" />
              </div>
              <p className="text-sm text-gray-500">Moda con estilo para cada momento.</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Tienda</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/productos" className="hover:text-primary-600 transition-colors">Todos los productos</Link></li>
                <li><Link to="/productos?featured=true" className="hover:text-primary-600 transition-colors">Destacados</Link></li>
                <li><Link to="/nosotros" className="hover:text-primary-600 transition-colors">Nosotros</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Ayuda</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="https://wa.me/573046642662" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Contacto</a></li>
                <li><Link to="/envios-y-devoluciones" className="hover:text-primary-600 transition-colors">Envíos y devoluciones</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/privacidad" className="hover:text-primary-600 transition-colors">Privacidad</Link></li>
                <li><Link to="/terminos" className="hover:text-primary-600 transition-colors">Términos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-400">
            &copy; 2024 EEMI. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
