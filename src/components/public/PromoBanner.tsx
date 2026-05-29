'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  badge?: string;
  title?: string;
  description?: string;
  cta?: {
    text: string;
    href: string;
  };
  variant?: 'accent' | 'primary' | 'dark';
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  badge = 'Oferta Limitada',
  title = '15% de descuento en tu primer pedido',
  description = 'Usa el código BIENVENIDA al momento del pago. Válido solo para nuevos clientes.',
  cta = {
    text: 'Comienza tu Pedido',
    href: '/menu',
  },
  variant = 'accent',
}) => {
  const variants = {
    accent: 'bg-gradient-to-r from-accent via-accent/90 to-accent/80 text-charcoal',
    primary: 'bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white',
    dark: 'bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal/90 text-white',
  };

  return (
    <section className={`relative py-12 md:py-16 overflow-hidden ${variants[variant]}`}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:30px_30px]" />
      </div>

      {/* Diagonal Decorative Element */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* Content */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 animate-pulse" />
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-extrabold">
                {badge}
              </span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl font-black leading-[1.2]">
              {title}
            </h3>
            <p className="font-sans text-base leading-relaxed opacity-90">
              {description}
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <Link
              href={cta.href}
              className={`inline-flex items-center space-x-2 font-sans text-sm font-bold px-8 py-4 rounded-2xl transition-smooth hover:scale-105 active:scale-97 shadow-lg ${
                variant === 'dark'
                  ? 'bg-accent text-charcoal hover:bg-accent/90'
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40'
              }`}
            >
              <span>{cta.text}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
