'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  color: string;
  productCount: number;
}

const defaultCategories: Category[] = [
  {
    id: 'tortas',
    name: 'Tortas Personalizadas',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80',
    description: 'Diseños únicos para cada ocasión',
    color: 'from-pink-600/40 to-rose-600/40',
    productCount: 24,
  },
  {
    id: 'cumpleanos',
    name: 'Cumpleaños',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a104?w=500&auto=format&fit=crop&q=80',
    description: 'Celebra con nuestras delicias',
    color: 'from-purple-600/40 to-indigo-600/40',
    productCount: 18,
  },
  {
    id: 'boxes',
    name: 'Boxes & Regalos',
    image: 'https://images.unsplash.com/photo-1599599810694-9db19b80c32e?w=500&auto=format&fit=crop&q=80',
    description: 'Empaques premium para regalar',
    color: 'from-amber-600/40 to-orange-600/40',
    productCount: 15,
  },
  {
    id: 'postres',
    name: 'Postres Individuales',
    image: 'https://images.unsplash.com/photo-1663050588223-14341e537528?w=500&auto=format&fit=crop&q=80',
    description: 'Porciones de puro placer',
    color: 'from-red-600/40 to-pink-600/40',
    productCount: 32,
  },
];

interface CategoriesShowcaseProps {
  categories?: Category[];
  title?: string;
}

export const CategoriesShowcase: React.FC<CategoriesShowcaseProps> = ({
  categories = defaultCategories,
  title = 'Explora Nuestras Categorías',
}) => {
  return (
    <section className="py-24 md:py-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 md:mb-20">
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
            Catálogo Completo
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-black text-charcoal leading-[1.1]">
            {title}
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu?category=${category.id}`}
              className="group relative overflow-hidden rounded-[24px] aspect-square cursor-pointer"
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} to-charcoal/70`} />

              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">

                {/* Top - Product Count */}
                <div className="self-start">
                  <span className="font-sans text-[11px] tracking-[0.15em] uppercase font-bold text-accent bg-accent/20 px-3 py-1.5 rounded-full border border-accent/40">
                    {category.productCount} productos
                  </span>
                </div>

                {/* Bottom - Title & Description */}
                <div className="space-y-2 group-hover:translate-y-1 transition-transform duration-300">
                  <h3 className="font-serif text-2xl sm:text-3xl font-black text-white leading-[1.1]">
                    {category.name}
                  </h3>
                  <p className="font-sans text-sm text-white/80">
                    {category.description}
                  </p>
                  <div className="flex items-center space-x-2 text-accent font-sans font-bold text-sm group-hover:translate-x-2 transition-transform duration-300 pt-2">
                    <span>Ver Más</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

              </div>

              {/* Border on hover */}
              <div className="absolute inset-0 border-2 border-accent opacity-0 group-hover:opacity-100 rounded-[24px] transition-opacity duration-300 pointer-events-none" />

            </Link>
          ))}
        </div>

        {/* CTA to Full Menu */}
        <div className="text-center mt-16 md:mt-20">
          <Link
            href="/menu"
            className="inline-flex items-center space-x-2 font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark px-8 py-4 rounded-2xl shadow-lg transition-smooth hover:scale-105 active:scale-97"
          >
            <span>Ver Carta Completa</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
