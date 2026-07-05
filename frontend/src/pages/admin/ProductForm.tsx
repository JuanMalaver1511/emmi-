import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { Category } from '../../types';
import { Plus, X, Star, ImageOff, AlertCircle, Check } from 'lucide-react';

const SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Única'];
const NUMERIC_SIZES = ['28', '30', '32', '34', '36', '38'];
const COLOR_PRESETS: { name: string; hex: string }[] = [
  { name: 'Negro', hex: '#111827' }, { name: 'Blanco', hex: '#ffffff' },
  { name: 'Gris', hex: '#9ca3af' }, { name: 'Rojo', hex: '#dc2626' },
  { name: 'Azul', hex: '#2563eb' }, { name: 'Verde', hex: '#16a34a' },
  { name: 'Beige', hex: '#d6c7a1' }, { name: 'Marrón', hex: '#92400e' },
  { name: 'Rosa', hex: '#ec4899' }, { name: 'Amarillo', hex: '#eab308' },
];
const colorHex = (name: string) =>
  COLOR_PRESETS.find(c => c.name.toLowerCase() === name.toLowerCase())?.hex || '#d1d5db';

const money = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [customColor, setCustomColor] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: 0, comparePrice: undefined as number | undefined,
    wholesalePrice: undefined as number | undefined, wholesaleMinQty: 6,
    images: [] as string[], sizes: [] as string[], colors: [] as string[],
    stock: 0, featured: false, published: true, categoryId: '',
  });

  const isEdit = !!id;

  useEffect(() => {
    api.admin.categories().then(setCategories);
    if (id) {
      api.admin.products({ limit: '100' }).then(d => {
        const product = d.products.find((p: any) => p.id === id);
        if (product) setForm({
          name: product.name, description: product.description, price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
          wholesalePrice: product.wholesalePrice ? Number(product.wholesalePrice) : undefined,
          wholesaleMinQty: product.wholesaleMinQty ?? 6,
          images: product.images, sizes: product.sizes, colors: product.colors,
          stock: product.stock, featured: product.featured, published: product.published,
          categoryId: product.categoryId,
        });
      });
    }
  }, [id]);

  const set = (patch: Partial<typeof form>) => setForm(f => ({ ...f, ...patch }));

  const toggle = (field: 'sizes' | 'colors', value: string) => {
    const list = form[field];
    set({ [field]: list.includes(value) ? list.filter(v => v !== value) : [...list, value] } as any);
  };

  const addImages = (raw: string) => {
    const urls = raw.split(/[\n\s]+/).map(s => s.trim()).filter(Boolean);
    if (urls.length) set({ images: [...form.images, ...urls.filter(u => !form.images.includes(u))] });
    setImageInput('');
  };

  const discount = form.comparePrice && form.comparePrice > form.price
    ? Math.round(((form.comparePrice - form.price) / form.comparePrice) * 100) : 0;

  const validate = () => {
    if (form.name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
    if (form.description.trim().length < 10) return 'La descripción debe tener al menos 10 caracteres.';
    if (!form.price || form.price <= 0) return 'El precio debe ser mayor a 0.';
    if (!form.categoryId) return 'Selecciona una categoría.';
    if (form.comparePrice && form.comparePrice <= form.price) return 'El precio comparativo debe ser mayor al precio de venta.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setError('');
    setLoading(true);
    try {
      if (isEdit) await api.admin.updateProduct(id!, form);
      else await api.admin.createProduct(form);
      navigate('/admin/productos');
    } catch (err: any) {
      setError(err.message || 'No se pudo guardar el producto.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally { setLoading(false); }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition';
  const labelClass = 'text-sm font-medium text-gray-700 block mb-1.5';
  const sectionClass = 'bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm';

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? 'Editar producto' : 'Nuevo producto'}</h1>
        <p className="text-sm text-gray-500 mt-1">Completa la información. Verás una vista previa a la derecha.</p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Columna izquierda: campos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos básicos */}
          <div className={sectionClass}>
            <h2 className="font-semibold mb-4">Información básica</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nombre del producto</label>
                <input value={form.name} onChange={e => set({ name: e.target.value })} placeholder="Ej: Camisa Polo Clásica" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>
                  Descripción
                  <span className={`ml-2 text-xs font-normal ${form.description.trim().length < 10 ? 'text-gray-400' : 'text-green-600'}`}>
                    {form.description.trim().length < 10 ? `mínimo 10 caracteres (${form.description.trim().length})` : '✓'}
                  </span>
                </label>
                <textarea value={form.description} onChange={e => set({ description: e.target.value })} rows={4} placeholder="Describe el material, el corte, para qué ocasión es ideal..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Categoría</label>
                <select value={form.categoryId} onChange={e => set({ categoryId: e.target.value })} className={`${inputClass} bg-white`}>
                  <option value="">Seleccionar...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Precio y stock */}
          <div className={sectionClass}>
            <h2 className="font-semibold mb-4">Precio e inventario</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Precio de venta</label>
                <input type="number" min="0" step="1" value={form.price || ''} onChange={e => set({ price: Number(e.target.value) })} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Precio antes <span className="text-gray-400 font-normal">(opcional)</span></label>
                <input type="number" min="0" step="1" value={form.comparePrice ?? ''} onChange={e => set({ comparePrice: e.target.value ? Number(e.target.value) : undefined })} placeholder="Para mostrar descuento" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Precio por mayor <span className="text-gray-400 font-normal">(opcional)</span></label>
                <input type="number" min="0" step="1" value={form.wholesalePrice ?? ''} onChange={e => set({ wholesalePrice: e.target.value ? Number(e.target.value) : undefined })} placeholder="Precio al por mayor" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Cant. mínima por mayor</label>
                <input type="number" min="1" value={form.wholesaleMinQty || ''} onChange={e => set({ wholesaleMinQty: Number(e.target.value) || 6 })} placeholder="6" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Stock disponible</label>
                <input type="number" min="0" value={form.stock || ''} onChange={e => set({ stock: Number(e.target.value) })} placeholder="0" className={inputClass} />
              </div>
              <div className="flex items-end">
                {discount > 0 && (
                  <div className="w-full px-4 py-2.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium text-center">
                    Descuento del {discount}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tallas */}
          <div className={sectionClass}>
            <h2 className="font-semibold mb-1">Tallas</h2>
            <p className="text-xs text-gray-400 mb-3">Haz clic para agregar o quitar. Si no aplica, deja vacío o usa "Única".</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {[...SIZE_PRESETS, ...NUMERIC_SIZES].map(s => (
                <button key={s} type="button" onClick={() => toggle('sizes', s)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm border transition ${form.sizes.includes(s) ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300'}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={customSize} onChange={e => setCustomSize(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (customSize.trim()) { toggle('sizes', customSize.trim()); setCustomSize(''); } } }}
                placeholder="Otra talla..." className={`${inputClass} flex-1`} />
              <button type="button" onClick={() => { if (customSize.trim()) { toggle('sizes', customSize.trim()); setCustomSize(''); } }}
                className="px-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"><Plus size={16} /></button>
            </div>
            {form.sizes.filter(s => ![...SIZE_PRESETS, ...NUMERIC_SIZES].includes(s)).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.sizes.filter(s => ![...SIZE_PRESETS, ...NUMERIC_SIZES].includes(s)).map(s => (
                  <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary-600 text-white text-sm">
                    {s} <button type="button" onClick={() => toggle('sizes', s)}><X size={13} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Colores */}
          <div className={sectionClass}>
            <h2 className="font-semibold mb-3">Colores</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {COLOR_PRESETS.map(c => {
                const active = form.colors.includes(c.name);
                return (
                  <button key={c.name} type="button" onClick={() => toggle('colors', c.name)}
                    className={`inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-sm border transition ${active ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ background: c.hex }} />
                    {c.name}
                    {active && <Check size={13} />}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input value={customColor} onChange={e => setCustomColor(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (customColor.trim()) { toggle('colors', customColor.trim()); setCustomColor(''); } } }}
                placeholder="Otro color..." className={`${inputClass} flex-1`} />
              <button type="button" onClick={() => { if (customColor.trim()) { toggle('colors', customColor.trim()); setCustomColor(''); } }}
                className="px-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"><Plus size={16} /></button>
            </div>
          </div>

          {/* Imágenes */}
          <div className={sectionClass}>
            <h2 className="font-semibold mb-1">Imágenes</h2>
            <p className="text-xs text-gray-400 mb-3">Pega una o varias URLs. La primera será la imagen principal.</p>
            <div className="flex gap-2 mb-4">
              <input value={imageInput} onChange={e => setImageInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImages(imageInput); } }}
                placeholder="https://..." className={`${inputClass} flex-1`} />
              <button type="button" onClick={() => addImages(imageInput)}
                className="px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 flex items-center gap-1"><Plus size={16} /> Agregar</button>
            </div>
            {form.images.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                <ImageOff size={24} className="mx-auto mb-2 opacity-60" />
                Aún no hay imágenes
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {form.images.map((url, i) => (
                  <div key={url + i} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={url} alt="" className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />
                    {i === 0 && <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-gray-900/80 text-white text-[10px] font-medium flex items-center gap-0.5"><Star size={9} className="fill-white" /> Principal</span>}
                    <button type="button" onClick={() => set({ images: form.images.filter((_, idx) => idx !== i) })}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white"><X size={13} /></button>
                    {i !== 0 && (
                      <button type="button" onClick={() => set({ images: [url, ...form.images.filter((_, idx) => idx !== i)] })}
                        className="absolute bottom-1 left-1 right-1 py-1 rounded bg-white/90 text-gray-700 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition hover:bg-gray-900 hover:text-white">Hacer principal</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Opciones */}
          <div className={sectionClass}>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex-1 flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                <input type="checkbox" checked={form.featured} onChange={e => set({ featured: e.target.checked })} className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span><span className="text-sm font-medium block">Destacado</span><span className="text-xs text-gray-400">Aparece en la página de inicio</span></span>
              </label>
              <label className="flex-1 flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                <input type="checkbox" checked={form.published} onChange={e => set({ published: e.target.checked })} className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span><span className="text-sm font-medium block">Publicado</span><span className="text-xs text-gray-400">Visible para los clientes</span></span>
              </label>
            </div>
          </div>
        </div>

        {/* Columna derecha: vista previa */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <div className={sectionClass}>
            <h2 className="font-semibold text-sm text-gray-500 mb-3">Vista previa</h2>
            <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3 relative">
              {form.images[0] ? (
                <img src={form.images[0]} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageOff size={32} /></div>
              )}
              {discount > 0 && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary-600 text-white text-[11px] font-semibold">-{discount}%</span>}
            </div>
            <h3 className="font-medium text-sm">{form.name || 'Nombre del producto'}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-semibold">{money(form.price)}</span>
              {form.comparePrice && form.comparePrice > form.price && <span className="text-sm text-gray-400 line-through">{money(form.comparePrice)}</span>}
            </div>
            {form.colors.length > 0 && (
              <div className="flex gap-1 mt-2">
                {form.colors.map(c => <span key={c} className="w-4 h-4 rounded-full border border-black/10" style={{ background: colorHex(c) }} title={c} />)}
              </div>
            )}
            {form.sizes.length > 0 && <p className="text-xs text-gray-400 mt-2">Tallas: {form.sizes.join(', ')}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors">
              {loading ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Crear producto')}
            </button>
            <button type="button" onClick={() => navigate('/admin/productos')} className="w-full py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
          </div>
        </div>
      </form>
    </div>
  );
}
