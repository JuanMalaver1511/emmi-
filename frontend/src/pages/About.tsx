import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-8 transition-colors">
        <ChevronLeft size={16} /> Volver
      </Link>

      <h1 className="text-3xl font-bold mb-6">Nosotros</h1>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p className="text-lg text-gray-800 leading-relaxed">
          EEMI nace de la pasión por la moda con propósito. Creemos que cada prenda cuenta una historia y que el estilo no está reñido con la conciencia.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">Nuestra Historia</h2>
        <p>
          Fundada con la visión de ofrecer moda femenina que combine calidad, diseño atemporal y responsabilidad, EEMI se ha convertido en un referente para quienes buscan expresar su personalidad a través de lo que visten.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">Nuestra Filosofía</h2>
        <p>
          Seleccionamos cuidadosamente cada pieza de nuestra colección, priorizando materiales de calidad, acabados impecables y diseños que trascienden las tendencias pasajeras. Creemos en una moda más consciente, donde cada compra es una inversión en tu estilo y en el planeta.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">Compromiso</h2>
        <p>
          Nos comprometemos a ofrecerte una experiencia de compra excepcional, desde el primer clic hasta que recibes tu pedido. Tu satisfacción es nuestra prioridad.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-gray-900 mb-2">Contacto</h3>
          <p className="text-sm">
            ¿Tienes preguntas? Escríbenos por{' '}
            <a href="https://wa.me/573046642662" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">WhatsApp</a>
            {' '}y te atenderemos con gusto.
          </p>
        </div>
      </div>
    </div>
  );
}
