import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Product } from '../types';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600';

export default function ProductCard({ product }: { product: Product }) {
  const price = Number(product.price);
  const compare = product.comparePrice ? Number(product.comparePrice) : 0;
  const hasDiscount = compare > price;
  const discount = hasDiscount ? Math.round(((compare - price) / compare) * 100) : 0;
  const isNew =
    product.createdAt &&
    Date.now() - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30;

  return (
    <Link to={`/productos/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3 ring-1 ring-gray-100 group-hover:ring-primary-200 transition">
        <img
          src={product.images[0] || PLACEHOLDER}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-full bg-primary-600 text-white text-[11px] font-semibold shadow-sm">
              -{discount}%
            </span>
          )}
          {isNew && !hasDiscount && (
            <span className="px-2 py-0.5 rounded-full bg-gray-900 text-white text-[11px] font-semibold shadow-sm">
              Nuevo
            </span>
          )}
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold">Agotado</span>
          </div>
        )}
      </div>
      <h3 className="font-medium text-sm text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
        {product.name}
      </h3>
      <div className="flex items-center gap-2 mt-1">
        <span className="font-semibold text-gray-900">${price.toFixed(2)}</span>
        {hasDiscount && <span className="text-sm text-gray-400 line-through">${compare.toFixed(2)}</span>}
      </div>
      {product.avgRating ? (
        <div className="flex items-center gap-1 mt-1">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs text-gray-500">{product.avgRating.toFixed(1)}</span>
        </div>
      ) : null}
    </Link>
  );
}
