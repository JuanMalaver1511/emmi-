import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingBag, ChevronLeft, Check } from 'lucide-react';
import { formatCOP } from '../utils/format';

const COLOR_PRESETS: { name: string; hex: string }[] = [
  { name: 'Negro', hex: '#111827' }, { name: 'Blanco', hex: '#ffffff' },
  { name: 'Gris', hex: '#9ca3af' }, { name: 'Rojo', hex: '#dc2626' },
  { name: 'Azul', hex: '#2563eb' }, { name: 'Verde', hex: '#16a34a' },
  { name: 'Beige', hex: '#d6c7a1' }, { name: 'Marrón', hex: '#92400e' },
  { name: 'Rosa', hex: '#ec4899' }, { name: 'Amarillo', hex: '#eab308' },
  { name: 'Celeste', hex: '#7dd3fc' }, { name: 'Burdeos', hex: '#7f1d1d' },
];
const colorHex = (name: string) =>
  COLOR_PRESETS.find(c => c.name.toLowerCase() === name.toLowerCase())?.hex || '#d1d5db';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.products.get(slug).then(d => {
      setProduct(d.product);
      setRelated(d.related);
      setSelectedImage(0);
      setSelectedSize(d.product.sizes?.[0] || '');
      setSelectedColor(d.product.colors?.[0] || '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const handleAdd = async () => {
    if (!product) return;
    try {
      await addItem({ productId: product.id, quantity, size: selectedSize, color: selectedColor, product });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {}
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    try {
      await api.reviews.create(product.id, { rating: reviewRating, comment: reviewComment });
      setReviewComment('');
      const d = await api.products.get(product.slug);
      setProduct(d.product);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-[3/4] bg-gray-100 rounded-xl" />
        <div className="space-y-4"><div className="h-8 bg-gray-100 rounded w-3/4" /><div className="h-6 bg-gray-100 rounded w-1/4" /><div className="h-24 bg-gray-100 rounded" /></div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <p className="text-gray-500">Producto no encontrado</p>
      <Link to="/productos" className="text-primary-600 font-medium mt-2 inline-block">Volver a productos</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/productos" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <ChevronLeft size={16} /> Volver
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-3">
          <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative">
            <img src={product.images[selectedImage] || product.images[0] || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600'} alt={product.name} className="w-full h-full object-cover" />
            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary-600 text-white text-sm font-semibold">
                -{Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${selectedImage === i ? 'border-primary-600' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-1 text-sm text-primary-600 font-medium">{product.category?.name}</div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-3">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-bold">{formatCOP(product.price)}</span>
            {product.comparePrice && <span className="text-lg text-gray-400 line-through">{formatCOP(product.comparePrice)}</span>}
          </div>

          {product.avgRating ? (
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.round(product.avgRating!) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />)}
              <span className="text-sm text-gray-500 ml-1">({product.reviews?.length || 0} reseñas)</span>
            </div>
          ) : null}

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="space-y-4 mb-6">
            {product.sizes.length > 0 && product.sizes[0] !== 'Única' && (
              <div>
                <label className="text-sm font-medium block mb-2">Talla</label>
                <div className="flex gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 text-sm rounded-lg border transition-colors ${selectedSize === s ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <label className="text-sm font-medium block mb-2">Color</label>
                <div className="flex gap-3">
                  {product.colors.map(c => {
                    const hex = colorHex(c);
                    const isSelected = selectedColor === c;
                    return (
                      <button key={c} onClick={() => setSelectedColor(c)} className="flex flex-col items-center gap-1 group">
                        <div className={`w-7 h-7 rounded-full transition-all ${isSelected ? 'ring-2 ring-primary-600 ring-offset-2 scale-110' : 'ring-1 ring-gray-200 group-hover:ring-gray-400'}`}
                          style={{ backgroundColor: hex, border: hex === '#ffffff' ? '1px solid #e5e7eb' : 'none' }} />
                        <span className={`text-[10px] ${isSelected ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium block mb-2">Cantidad</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">-</button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button>
                <span className="text-sm text-gray-400">{product.stock} disponibles</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={product.stock === 0} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : added ? 'bg-green-600 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
              {added ? <><Check size={18} /> Añadido</> : <><ShoppingBag size={18} /> {product.stock === 0 ? 'Agotado' : 'Añadir al carrito'}</>}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {user && (
        <div className="mt-12 border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold mb-4">Reseña</h3>
          <form onSubmit={handleReview} className="max-w-md space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <button key={i} type="button" onClick={() => setReviewRating(i + 1)}>
                  <Star size={20} className={i < reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                </button>
              ))}
            </div>
            <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Comentario (opcional)" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" rows={3} />
            <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">Enviar reseña</button>
          </form>
        </div>
      )}

      {/* Reviews list */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="font-bold">Reseñas ({product.reviews.length})</h3>
          {product.reviews.map((review: any) => (
            <div key={review.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{review.user?.name}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />)}
                </div>
              </div>
              {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold mb-6">Productos Relacionados</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(p => (
              <Link key={p.id} to={`/productos/${p.slug}`} className="group">
                <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-2 relative">
                  <img src={p.images[0] || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.comparePrice && Number(p.comparePrice) > Number(p.price) && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary-600 text-white text-[11px] font-semibold">
                      -{Math.round((1 - Number(p.price) / Number(p.comparePrice)) * 100)}%
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-sm">{p.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-sm">{formatCOP(p.price)}</span>
                  {p.comparePrice && <span className="text-xs text-gray-400 line-through">{formatCOP(p.comparePrice)}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
