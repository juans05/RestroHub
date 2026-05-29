'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Share2, ChevronDown, Send } from 'lucide-react';
import { useSystemConfig } from '@/hooks/useSystemConfig';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const defaultFAQs: FAQItem[] = [
  {
    id: 'delivery',
    question: '¿Realizan entregas a domicilio?',
    answer: 'Sí, realizamos entregas en toda la zona. Los pedidos deben ser realizados con mínimo 2 horas de anticipación. Consulta disponibilidad en tu zona.',
  },
  {
    id: 'personalization',
    question: '¿Puedo personalizar mis pedidos?',
    answer: 'Por supuesto. Puedes personalizar prácticamente cualquier producto. Contáctanos por WhatsApp para detalles específicos de tu pedido.',
  },
  {
    id: 'payment',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos transferencias bancarias, tarjetas de crédito/débito, y pago en efectivo contra entrega en algunos casos.',
  },
  {
    id: 'reservation',
    question: '¿Cuánto tiempo antes debo reservar?',
    answer: 'Para pedidos regulares, 2 horas. Para catering y eventos especiales, recomendamos 7 días mínimo para mejores resultados.',
  },
];

export const FooterV2: React.FC = () => {
  const { config, loading } = useSystemConfig();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const currentYear = new Date().getFullYear();

  const whatsappNumber = config?.whatsapp?.replace(/\D/g, '');
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#';

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      alert(`¡Gracias por suscribirte a ${emailInput}!`);
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-charcoal text-canvas">

      {/* Newsletter Section */}
      <div className="border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4">
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
                Mantente Actualizado
              </span>
              <h3 className="font-serif text-3xl md:text-4xl font-black text-white leading-[1.2]">
                Recibe Ofertas Exclusivas
              </h3>
              <p className="font-sans text-sm text-canvas/75 leading-relaxed">
                Suscríbete para recibir noticias, promociones y recetas especiales directo en tu correo.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-full bg-canvas/10 border border-canvas/20 text-white placeholder:text-canvas/50 font-sans text-sm outline-none focus:border-accent/50 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-accent hover:bg-accent/90 text-charcoal font-sans font-bold text-sm transition-smooth flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <span>Suscribir</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="space-y-8 mb-12">
            <div className="text-center space-y-3">
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
                Preguntas Frecuentes
              </span>
              <h3 className="font-serif text-4xl font-black text-white">
                Respuestas a tus Dudas
              </h3>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {defaultFAQs.map((faq) => (
              <div
                key={faq.id}
                className="border border-accent/20 rounded-xl overflow-hidden bg-charcoal/50 hover:border-accent/40 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between font-sans font-semibold text-white hover:bg-accent/5 transition-colors"
                >
                  <span className="text-left">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-accent transition-transform duration-300 flex-shrink-0 ${
                      expandedFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 py-4 bg-accent/5 border-t border-accent/20">
                    <p className="font-sans text-sm text-canvas/75 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">

            {/* Brand Info */}
            <div className="lg:col-span-1 space-y-6">
              <Link href="/" className="flex flex-col">
                <span className="font-serif text-3xl font-extrabold tracking-tight text-white">
                  {loading ? "..." : config?.businessName || "Restaurante"}
                </span>
                <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-semibold mt-2">
                  {config?.description?.split(" ").slice(0, 2).join(" ") || "REPOSTERÍA FINA"}
                </span>
              </Link>
              <p className="font-sans text-sm text-canvas/75 leading-relaxed">
                {config?.description}
              </p>
              {/* Social Links */}
              <div className="flex items-center space-x-4 pt-4 border-t border-accent/10">
                {config?.facebook && (
                  <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="text-canvas/60 hover:text-accent transition-colors">
                    <Share2 className="h-5 w-5" />
                  </a>
                )}
                {config?.instagram && (
                  <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="text-canvas/60 hover:text-accent transition-colors">
                    <Share2 className="h-5 w-5" />
                  </a>
                )}
                {config?.twitter && (
                  <a href={config.twitter} target="_blank" rel="noopener noreferrer" className="text-canvas/60 hover:text-accent transition-colors">
                    <Share2 className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Navigation */}
            <div>
              <h4 className="font-serif text-lg font-bold text-white mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-accent">
                Navegación
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                <li>
                  <Link href="/" className="text-canvas/75 hover:text-accent transition-colors duration-200">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="text-canvas/75 hover:text-accent transition-colors duration-200">
                    Menú
                  </Link>
                </li>
                <li>
                  <Link href="/sedes" className="text-canvas/75 hover:text-accent transition-colors duration-200">
                    Nuestras Sedes
                  </Link>
                </li>
                <li>
                  <Link href="/reservar" className="text-canvas/75 hover:text-accent transition-colors duration-200">
                    Reservar Mesa
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-serif text-lg font-bold text-white mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-accent">
                Servicios
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                <li>
                  <Link href="/catering" className="text-canvas/75 hover:text-accent transition-colors duration-200">
                    Catering para Eventos
                  </Link>
                </li>
                <li>
                  <Link href="/catering" className="text-canvas/75 hover:text-accent transition-colors duration-200">
                    Pedidos Corporativos
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="text-canvas/75 hover:text-accent transition-colors duration-200">
                    Personalización
                  </Link>
                </li>
                <li>
                  <Link href="/rastreador" className="text-canvas/75 hover:text-accent transition-colors duration-200">
                    Rastreador de Pedidos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-serif text-lg font-bold text-white mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-accent">
                Contacto
              </h4>
              <ul className="space-y-4 font-sans text-sm">
                {config?.address && (
                  <li className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-canvas/75">{config.address}</span>
                  </li>
                )}
                {config?.whatsapp && (
                  <li className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-accent shrink-0" />
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-canvas/75 hover:text-accent transition-colors duration-200">
                      {config.whatsapp}
                    </a>
                  </li>
                )}
                {config?.email && (
                  <li className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-accent shrink-0" />
                    <a href={`mailto:${config.email}`} className="text-canvas/75 hover:text-accent transition-colors duration-200 break-all">
                      {config.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 font-sans text-xs text-canvas/60">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <p>© {currentYear} {config?.businessName || "Restaurante"}. Todos los derechos reservados.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a href="#privacidad" className="hover:text-accent transition-colors duration-200 font-semibold">
                Privacidad
              </a>
              <a href="#arco" className="hover:text-accent transition-colors duration-200 font-semibold">
                ARCO
              </a>
              <a href="#terminos" className="hover:text-accent transition-colors duration-200 font-semibold">
                Términos
              </a>
              <Link href="/contacto" className="hover:text-accent transition-colors duration-200 font-semibold">
                Contacto
              </Link>
              <Link href="/admin/login" className="hover:text-accent transition-colors duration-200 font-semibold uppercase tracking-wider">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};
