'use client';

import React from 'react';
import Link from 'next/link';
import { HeaderV2 } from '@/components/public/HeaderV2';
import { FooterV2 } from '@/components/public/FooterV2';
import { CartDrawer } from '@/components/public/CartDrawer';
import { useSystemConfig } from '@/hooks/useSystemConfig';
import { Gift, Users, Calendar, DollarSign, Check, ArrowRight, MessageCircle } from 'lucide-react';

export default function CateringPage() {
  const { config } = useSystemConfig();

  const whatsappNumber = config?.whatsapp?.replace(/\D/g, '');
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=Hola%20me%20interesa%20el%20servicio%20de%20catering`
    : '#';

  const services = [
    {
      icon: <Gift className="h-8 w-8" />,
      title: 'Bodas',
      description: 'Crea momentos memorables con nuestros diseños personalizados y servicio profesional.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Eventos Corporativos',
      description: 'Impresiona a tu equipo con postres de alta calidad para reuniones y celebraciones.',
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Cumpleaños',
      description: 'Tortas personalizadas para cualquier edad. Diseños únicos que harán sonreír.',
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: 'Presupuestos Especiales',
      description: 'Descuentos por volumen y paquetes personalizados para grupos grandes.',
    },
  ];

  const features = [
    'Diseño personalizado según tu visión',
    'Entregas a domicilio en toda la ciudad',
    'Mínimo 7 días de anticipación recomendado',
    'Consultoría de sabores y presentación gratuita',
    'Servicio profesional de montaje',
    'Adaptable a cualquier número de personas',
  ];

  return (
    <div className="flex-1 flex flex-col bg-canvas">
      <HeaderV2 />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:30px_30px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center space-x-2 font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold bg-accent/20 px-4 py-2 rounded-full border border-accent/40">
              <Gift className="h-4 w-4" />
              <span>Servicios Especiales</span>
            </span>

            <h1 className="font-serif text-5xl md:text-6xl font-black leading-[1.1]">
              Catering para Eventos
            </h1>

            <p className="font-sans text-lg text-white/90 leading-relaxed max-w-2xl">
              Haz tu evento inolvidable con nuestras creaciones artesanales. Desde bodas hasta celebraciones corporativas, tenemos la solución dulce perfecta para ti.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 font-sans text-sm font-bold text-charcoal bg-accent hover:bg-accent/90 py-4 px-8 rounded-2xl shadow-lg transition-smooth hover:scale-105 active:scale-97"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Solicitar Cotización</span>
              </a>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center space-x-2 font-sans text-sm font-bold text-white bg-white/20 hover:bg-white/30 py-4 px-8 rounded-2xl backdrop-blur-sm border border-white/40 transition-smooth hover:scale-105 active:scale-97"
              >
                <span>Ver Portafolio</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 md:py-32 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 md:mb-20">
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
              Tipos de Catering
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-charcoal leading-[1.1]">
              Soluciones para Cada Ocasión
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-canvas border border-accent/15 rounded-[28px] p-8 hover:border-accent/35 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                  {service.icon}
                </div>
                <h3 className="font-serif text-2xl font-extrabold text-charcoal mb-3">
                  {service.title}
                </h3>
                <p className="font-sans text-base text-charcoal-light leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative h-[400px] rounded-[28px] overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80"
                alt="Catering de tortas"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
                  Por Qué Elegirnos
                </span>
                <h2 className="font-serif text-4xl font-black text-charcoal leading-[1.1]">
                  Lo que Incluye Nuestro Catering
                </h2>
              </div>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <p className="font-sans text-base text-charcoal-light leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark px-8 py-4 rounded-2xl shadow-lg transition-smooth hover:scale-105 active:scale-97"
                >
                  <span>Consulta Ahora</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 md:py-32 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 md:mb-20">
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
              Proceso Simple
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-charcoal leading-[1.1]">
              Cómo Contratar Nuestro Catering
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
            {[
              {
                step: '1',
                title: 'Contacta',
                description: 'Comunícate vía WhatsApp o formulario con tus requerimientos',
              },
              {
                step: '2',
                title: 'Consultoría',
                description: 'Discutimos diseños, sabores y presupuesto según tu evento',
              },
              {
                step: '3',
                title: 'Confirmación',
                description: 'Aseguramos disponibilidad y detalles finales de entrega',
              },
              {
                step: '4',
                title: 'Disfruta',
                description: 'Entregamos tu catering profesional el día del evento',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-canvas border border-accent/15 rounded-[24px] p-6 text-center space-y-3">
                  <div className="w-10 h-10 bg-primary text-white font-serif text-lg font-black rounded-full flex items-center justify-center mx-auto">
                    {item.step}
                  </div>
                  <h3 className="font-serif text-lg font-extrabold text-charcoal">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-charcoal-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {item.step !== '4' && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-accent/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="font-serif text-4xl md:text-5xl font-black leading-[1.1]">
            ¿Listo para tu Evento Especial?
          </h2>
          <p className="font-sans text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            Contacta con nosotros hoy y recibe una consultoría gratuita para planificar tu catering perfecto.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 font-sans text-sm font-bold text-charcoal bg-accent hover:bg-accent/90 px-8 py-4 rounded-2xl shadow-lg transition-smooth hover:scale-105 active:scale-97"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Solicitar Catering por WhatsApp</span>
          </a>
        </div>
      </section>

      <FooterV2 />
    </div>
  );
}
