import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-8 transition-colors">
        <ChevronLeft size={16} /> Volver
      </Link>
      <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: 2024</p>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p>
          En EEMI, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">1. Información que Recopilamos</h2>
        <p>
          Recopilamos la información que nos proporcionas directamente al registrarte, como tu nombre, dirección de correo electrónico y dirección de envío. También recopilamos información sobre tus compras y preferencias de navegación.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">2. Uso de la Información</h2>
        <p>
          Utilizamos tu información para procesar tus pedidos, mejorar nuestros servicios, enviarte actualizaciones sobre tus compras y, con tu consentimiento, comunicaciones de marketing.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">3. Protección de Datos</h2>
        <p>
          Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra el acceso no autorizado, la alteración o la divulgación.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">4. Tus Derechos</h2>
        <p>
          Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier momento. Puedes hacerlo desde tu perfil de usuario o contactándonos directamente.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">5. Contacto</h2>
        <p>
          Si tienes preguntas sobre esta política, puedes contactarnos a través de nuestro <a href="https://wa.me/573046642662" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">WhatsApp</a>.
        </p>
      </div>
    </div>
  );
}
