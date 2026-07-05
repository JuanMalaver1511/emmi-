import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Shipping() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-8 transition-colors">
        <ChevronLeft size={16} /> Volver
      </Link>

      <h1 className="text-3xl font-bold mb-2">Envíos y Devoluciones</h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: 2024</p>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Envíos</h2>
        <p>
          Realizamos envíos a todo el país. El tiempo de entrega estimado es de 3 a 7 días hábiles, dependiendo de la ubicación. El costo de envío se calcula al momento del checkout y varía según el destino.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">Tiempos de Procesamiento</h2>
        <p>
          Los pedidos se procesan en un plazo de 1 a 2 días hábiles después de confirmada la compra. Recibirás un correo de confirmación con el número de seguimiento una vez que tu pedido haya sido despachado.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">Devoluciones</h2>
        <p>
          Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del pedido. Las prendas deben estar en su estado original, sin usar y con todas las etiquetas.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">Proceso de Devolución</h2>
        <p>
          Para iniciar una devolución, contáctanos a través de nuestro{' '}
          <a href="https://wa.me/573046642662" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">WhatsApp</a>
          {' '}con tu número de pedido. Te guiaremos en el proceso y te indicaremos los pasos a seguir.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">Reembolsos</h2>
        <p>
          Una vez recibida y verificada la devolución, procesaremos el reembolso en un plazo de 5 a 10 días hábiles. El reembolso se realizará mediante el mismo método de pago utilizado en la compra.
        </p>
      </div>
    </div>
  );
}
