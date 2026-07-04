import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Product, Category } from '../types';
import { ArrowRight, Star } from 'lucide-react';
import { formatCOP } from '../utils/format';

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
      <section className="relative min-h-[75vh] flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 w-full">
          <div className="max-w-xl">
            <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95]">
              Moda que<br />
              <span className="text-primary-400">define tu estilo</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-md">
              Descubre nuestra colección de ropa diseñada para quienes buscan calidad, comodidad y un estilo único.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/productos" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-600/25">
                Ver colección <ArrowRight size={18} />
              </Link>
              <Link to="/productos?featured=true" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20">
                Destacados
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-medium text-primary-600 uppercase tracking-widest">Explorar</span>
            <h2 className="text-2xl font-bold mt-1">Categorías</h2>
          </div>
          <Link to="/productos" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors border-b border-gray-900 hover:border-primary-600 pb-0.5">
            Ver todo <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-gray-200 rounded-2xl overflow-hidden">
          {categories.map((cat, i) => {
            const images: Record<string, string> = {
              camisetas: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop',
              pantalones: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop',
              vestidos: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&auto=format&fit=crop',
              chaquetas: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop',
              accesorios: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&auto=format&fit=crop',
            };
            return (
              <Link
                key={cat.id}
                to={`/productos?category=${cat.slug}`}
                className="group relative bg-white overflow-hidden aspect-[4/5]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${images[cat.slug] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/70" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-medium text-sm tracking-wide">{cat.name}</h3>
                  <p className="text-white/60 text-xs mt-1 transition-opacity duration-300 group-hover:opacity-100">
                    {cat._count?.products || 0} {cat._count?.products === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link to="/productos" className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors border-b border-gray-900 pb-0.5">
            Ver todas las categorías <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-medium text-primary-600 uppercase tracking-widest">Colección</span>
              <h2 className="text-2xl font-bold mt-1">Destacados</h2>
            </div>
            <Link to="/productos?featured=true" className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors border-b border-gray-900 hover:border-primary-600 pb-0.5">
              Ver todo <ArrowRight size={14} className="inline" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map(product => (
              <Link key={product.id} to={`/productos/${product.slug}`} className="group">
                <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3 relative">
                  <img src={product.images[0] || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary-600 text-white text-[11px] font-semibold">
                      -{Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}%
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-sm group-hover:text-primary-600 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold">{formatCOP(product.price)}</span>
                  {product.comparePrice && <span className="text-sm text-gray-400 line-through">{formatCOP(product.comparePrice)}</span>}
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
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
          <div className="relative px-8 sm:px-16 py-14 sm:py-20 text-center">
            <span className="text-xs font-medium text-primary-200 uppercase tracking-[0.2em]">Temporada</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight">Nueva Colección</h2>
            <p className="text-primary-100 mt-3 max-w-md mx-auto text-sm sm:text-base">Descubre las últimas tendencias con nuestra colección más reciente.</p>
            <Link to="/productos" className="inline-flex items-center gap-2 mt-6 px-7 py-3 bg-white text-primary-700 rounded-full font-medium hover:bg-gray-100 transition-all hover:shadow-lg">
              Explorar ahora <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
