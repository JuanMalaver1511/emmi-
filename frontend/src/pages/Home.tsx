import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Product, Category } from '../types';
import { ArrowRight, Star } from 'lucide-react';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.products.list({ featured: 'true', limit: '8' }).then(d => setFeatured(d.products));
    api.categories.list().then(setCategories);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Moda que<br />
              <span className="text-primary-400">define tu estilo</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-xl">
              Descubre nuestra colección de ropa diseñada para quienes buscan calidad, comodidad y un estilo único.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/productos" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Ver colección <ArrowRight size={18} />
              </Link>
              <Link to="/productos?featured=true" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20">
                Destacados
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Categorías</h2>
          <Link to="/productos" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            Ver todo <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link key={cat.id} to={`/productos?category=${cat.slug}`} className="group relative bg-gray-50 rounded-xl p-6 text-center hover:bg-primary-50 transition-colors border border-gray-100 hover:border-primary-200">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
                <span className="text-primary-600 font-bold text-lg">{cat.name[0]}</span>
              </div>
              <h3 className="font-medium text-sm">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{cat._count?.products || 0} productos</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Productos Destacados</h2>
            <Link to="/productos" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              Ver todo <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map(product => (
              <Link key={product.id} to={`/productos/${product.slug}`} className="group">
                <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3">
                  <img src={product.images[0] || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-medium text-sm group-hover:text-primary-600 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold">${Number(product.price).toFixed(2)}</span>
                  {product.comparePrice && <span className="text-sm text-gray-400 line-through">${Number(product.comparePrice).toFixed(2)}</span>}
                </div>
                {product.avgRating ? (
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{product.avgRating.toFixed(1)}</span>
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 sm:p-12 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Nueva Temporada</h2>
          <p className="text-primary-100 mb-6 max-w-md mx-auto">Descubre las últimas tendencias con nuestra colección más reciente.</p>
          <Link to="/productos" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Explorar ahora <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
