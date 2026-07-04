import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Product, Category } from '../types';
import { Star, Filter, X } from 'lucide-react';
import { formatCOP } from '../utils/format';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    api.categories.list().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page) };
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (search) params.search = search;
    api.products.list(params).then(d => {
      setProducts(d.products);
      setTotal(d.total);
      setPages(d.pages);
      setLoading(false);
    });
  }, [category, sort, search, page]);

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-gray-500 mt-1">{total} productos encontrados</p>
        </div>
        <div className="flex items-center gap-3">
          {search && (
            <div className="relative">
              <input type="text" value={search} onChange={e => setParam('search', e.target.value)} placeholder="Buscar..." className="w-48 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              {search && <button onClick={() => setParam('search', '')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><X size={14} /></button>}
            </div>
          )}
          <select value={sort} onChange={e => setParam('sort', e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            <option value="">Más recientes</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-2 border border-gray-200 rounded-lg">
            <Filter size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className={`lg:block w-56 flex-shrink-0 ${showFilters ? 'block' : 'hidden'}`}>
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-3">Categorías</h3>
              <div className="space-y-2">
                <button onClick={() => setParam('category', '')} className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${!category ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>Todas</button>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setParam('category', cat.slug)} className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${category === cat.slug ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {cat.name} <span className="text-gray-400">({cat._count?.products || 0})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map(product => (
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

              {pages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {[...Array(pages)].map((_, i) => (
                    <button key={i} onClick={() => setParam('page', String(i + 1))} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
