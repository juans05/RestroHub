'use client';

import React from 'react';
import Link from 'next/link';
import { Gift, Users, Clock, ArrowRight } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  cta: {
    text: string;
    href: string;
  };
  badge?: string;
  highlight?: boolean;
}

const defaultServices: Service[] = [
  {
    id: 'catering',
    title: 'Catering para Eventos',
    description: 'Personaliza tu menú para bodas, cumpleaños y eventos corporativos. Servicio profesional con presentación exquisita.',
    image: 'https://images.unsplash.com/photo-1555935338-8c1f4b4a0e6d?w=600&auto=format&fit=crop&q=80',
    icon: <Gift className="h-8 w-8" />,
    cta: {
      text: 'Solicitar Catering',
      href: '#',
    },
    badge: 'Popular',
  },
  {
    id: 'corporate',
    title: 'Pedidos Corporativos',
    description: 'Descuentos especiales para empresas. Ideal para reuniones, incentivos y celebraciones de equipo con volúmenes mayores.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80',
    icon: <Users className="h-8 w-8" />,
    cta: {
      text: 'Conocer Ofertas',
      href: '#',
    },
    highlight: true,
  },
];

interface FeaturedServicesProps {
  services?: Service[];
  tagline?: string;
}

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({
  services = defaultServices,
  tagline = 'Servicios Especiales',
}) => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-canvas via-card-bg to-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 md:mb-20">
          <span className="inline-flex items-center space-x-2 font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
            <Clock className="h-4 w-4" />
            <span>{tagline}</span>
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-black text-charcoal leading-[1.1]">
            Más allá de lo ordinario
          </h2>
          <p className="font-sans text-base text-charcoal-light max-w-2xl mx-auto leading-relaxed">
            Servicios personalizados para cada ocasión. Desde tu fiesta más especial hasta las celebraciones de tu empresa.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group relative overflow-hidden rounded-[32px] border transition-all duration-300 hover:shadow-xl ${
                service.highlight
                  ? 'lg:row-span-1 border-accent/40 bg-gradient-to-br from-accent/5 to-canvas shadow-md'
                  : 'border-accent/15 bg-card-bg hover:border-accent/35 shadow-sm'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay Gradient */}
                <div className={`absolute inset-0 ${
                  service.highlight
                    ? 'bg-gradient-to-br from-charcoal/70 via-charcoal/50 to-charcoal/30'
                    : 'bg-gradient-to-br from-charcoal/60 via-charcoal/40 to-transparent'
                }`} />
              </div>

              {/* Content */}
              <div className="relative p-8 md:p-10 h-full flex flex-col justify-between min-h-[400px]">

                {/* Top Content */}
                <div className="space-y-4">
                  {/* Badge */}
                  {service.badge && (
                    <div className="inline-flex">
                      <span className="font-sans text-[10px] tracking-[0.15em] uppercase font-bold text-accent bg-accent/20 px-3 py-1 rounded-full border border-accent/40">
                        {service.badge}
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    service.highlight
                      ? 'bg-accent/20 text-accent group-hover:bg-accent group-hover:text-charcoal'
                      : 'bg-white/10 text-white group-hover:bg-accent/30 group-hover:text-accent'
                  }`}>
                    {service.icon}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className={`font-serif text-2xl md:text-3xl font-black leading-[1.2] ${
                      service.highlight ? 'text-white' : 'text-white'
                    }`}>
                      {service.title}
                    </h3>
                    <p className="font-sans text-sm md:text-base text-white/85 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-6">
                  <Link
                    href={service.cta.href}
                    className={`inline-flex items-center space-x-2 font-sans text-sm font-bold px-6 py-3 rounded-full transition-smooth hover:scale-105 active:scale-97 border ${
                      service.highlight
                        ? 'bg-accent text-charcoal hover:bg-accent/90 border-accent'
                        : 'bg-white/10 text-white hover:bg-white/20 border-white/30 backdrop-blur-sm'
                    }`}
                  >
                    <span>{service.cta.text}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
