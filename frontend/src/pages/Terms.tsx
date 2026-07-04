import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-8 transition-colors">
        <ChevronLeft size={16} /> Volver
      </Link>
      <h1 className="text-3xl font-bold mb-2">Términos y Condiciones</h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: 2024</p>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p>
          Al utilizar la tienda en línea de EMMI, aceptas los siguientes términos y condiciones. Te recomendamos leerlos detenidamente antes de realizar cualquier compra.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">1. Productos y Precios</h2>
        <p>
          Todos los productos están sujetos a disponibilidad. Nos reservamos el derecho de modificar los precios en cualquier momento, pero los cambios no afectarán a los pedidos ya confirmados.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">2. Pedidos y Pagos</h2>
        <p>
          Al realizar un pedido, aceptas pagar el importe total indicado. Los pedidos están sujetos a disponibilidad de stock. En caso de falta de stock, te notificaremos y procederemos al reembolso correspondiente.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">3. Envíos</h2>
        <p>
          Realizamos envíos a todo el país. Los plazos de entrega son estimados y pueden variar según la ubicación. No nos hacemos responsables por retrasos causados por terceros.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">4. Devoluciones y Cambios</h2>
        <p>
          Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del pedido. Los productos deben estar en su estado original, sin usar y con todas las etiquetas.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">5. Propiedad Intelectual</h2>
        <p>
          Todos los contenidos de esta tienda, incluyendo imágenes, textos y diseño, son propiedad de EMMI y no pueden ser utilizados sin autorización.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">6. Contacto</h2>
        <p>
          Para cualquier consulta sobre estos términos, puedes contactarnos a través de nuestro <a href="https://wa.me/573046642662" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">WhatsApp</a>.
        </p>
      </div>
    </div>
  );
}
