'use client';

import React from 'react';
import Link from 'next/link';
import { HeaderV2 } from '@/components/public/HeaderV2';
import { HeroCarousel } from '@/components/public/HeroCarousel';
import { FeaturedServices } from '@/components/public/FeaturedServices';
import { CategoriesShowcase } from '@/components/public/CategoriesShowcase';
import { CartDrawer } from '@/components/public/CartDrawer';
import { FooterV2 } from '@/components/public/FooterV2';
import { mockDB } from '@/lib/mockData';
import { Heart, Clock, ShoppingBag, Award, ArrowRight } from 'lucide-react';

export default function HomeV2() {
  const config = mockDB.getConfig();
  const branches = mockDB.getBranches();
  const featuredDishes = mockDB.getDishes().slice(0, 3);

  // Hero Carousel Slides
  const heroSlides = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80',
      title: 'Repostería Artesanal Premium',
      subtitle: 'Especialidad de la casa',
      description: 'Cada creación es una obra maestra hecha con ingredientes seleccionados y dedicación infinita.',
      cta: {
        text: 'Comienza tu Pedido',
        href: '/menu',
      },
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&auto=format&fit=crop&q=80',
      title: 'Tartas para Eventos',
      subtitle: 'Celebra especial',
      description: 'Personaliza tu torta para bodas, cumpleaños y ocasiones memorables.',
      cta: {
        text: 'Solicitar Catering',
        href: '#catering',
      },
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1663050588223-14341e537528?w=1200&auto=format&fit=crop&q=80',
      title: 'Postres Individuales',
      subtitle: 'Dulces momentos',
      description: 'Prueba nuestros exquisitos postres elaborados fresco cada día.',
      cta: {
        text: 'Ver Carta Completa',
        href: '/menu',
      },
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-canvas">
      <HeaderV2 />
      <CartDrawer />

      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} autoplay={true} autoplayInterval={5000} />

      {/* Propuesta de Valor - Banner */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.8)_1px,_transparent_1px)] bg-[length:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-2">
            <p className="font-serif text-2xl md:text-3xl font-black tracking-tight">
              {config.bannerTitle || "El arte de la repostería artesanal"}
            </p>
            <p className="font-sans text-sm md:text-base text-white/90 max-w-2xl mx-auto">
              {config.bannerText || "Cada postre cuenta una historia de pasión, calidad y dedicación"}
            </p>
          </div>
        </div>
      </section>

      {/* Key Pillars / Value Propositions */}
      <section className="py-16 md:py-24 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">

            <div className="flex flex-col items-center text-center p-8 bg-canvas border border-accent/10 rounded-[28px] hover:border-accent/30 hover:shadow-md transition-all duration-300">
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 border border-accent/15 group-hover:bg-accent/20">
                <Heart className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-extrabold text-charcoal mb-3">Ingredientes Premium</h3>
              <p className="font-sans text-sm text-charcoal-light leading-relaxed">
                Cacao orgánico, mantequilla pura, frutas seleccionadas. Solo lo mejor en cada bocado.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-canvas border border-accent/10 rounded-[28px] hover:border-accent/30 hover:shadow-md transition-all duration-300">
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 border border-accent/15">
                <Clock className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-extrabold text-charcoal mb-3">Fresco Diario</h3>
              <p className="font-sans text-sm text-charcoal-light leading-relaxed">
                Nuestros reposteros hornean de madrugada para textura y frescura garantizadas.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-canvas border border-accent/10 rounded-[28px] hover:border-accent/30 hover:shadow-md transition-all duration-300">
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 border border-accent/15">
                <ShoppingBag className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-extrabold text-charcoal mb-3">Bolsa & Reserva</h3>
              <p className="font-sans text-sm text-charcoal-light leading-relaxed">
                Elige online, confirma por WhatsApp. Simple, rápido y con atención personalizada.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Services */}
      <FeaturedServices />

      {/* Categories Showcase */}
      <CategoriesShowcase />

      {/* Featured Dishes */}
      <section className="py-24 md:py-32 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center space-y-4 mb-16 md:mb-20">
            <span className="inline-flex items-center space-x-2 font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
              <Award className="h-4 w-4" />
              <span>Bestsellers</span>
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-charcoal leading-[1.1]">
              Antojos Más Aclamados
            </h2>
            <p className="font-sans text-base text-charcoal-light max-w-xl mx-auto leading-relaxed">
              Las recetas clásicas más solicitadas por nuestros clientes. Probadas y aprobadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {featuredDishes.map((dish) => (
              <article
                key={dish.id}
                className="group relative bg-canvas border border-accent/15 rounded-[28px] p-6 shadow-sm hover:shadow-lg hover:border-accent/35 transition-all duration-300"
              >
                <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-canvas mb-6">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="font-sans text-[10px] tracking-[0.15em] uppercase font-bold text-white bg-primary/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      Popular
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-extrabold text-charcoal leading-tight">
                    {dish.name}
                  </h3>
                  <p className="font-sans text-sm text-charcoal-light line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-accent/10">
                    <span className="font-serif text-xl font-extrabold text-primary">
                      S/. {dish.price.toFixed(2)}
                    </span>
                    <Link
                      href="/menu"
                      className="font-sans text-xs font-bold text-accent group-hover:text-primary transition-colors flex items-center space-x-1 hover:translate-x-1 transition-transform"
                    >
                      <span>Ver</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* Branches Showcase */}
      {branches.length > 0 && (
        <section className="py-24 md:py-32 bg-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center space-y-4 mb-16 md:mb-20">
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
                Visítanos
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-black text-charcoal leading-[1.1]">
                Nuestras Sedes
              </h2>
              <p className="font-sans text-base text-charcoal-light max-w-xl mx-auto">
                Encuentra la sucursal más cercana a ti.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {branches.slice(0, 3).map((branch) => (
                <div key={branch.id} className="group bg-card-bg border border-accent/15 rounded-[24px] p-8 hover:border-accent/35 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-serif text-xl font-extrabold text-charcoal mb-4">
                    {branch.name}
                  </h3>
                  <p className="font-sans text-sm text-charcoal-light mb-6 leading-relaxed">
                    {branch.address}
                  </p>
                  <Link
                    href="/sedes"
                    className="inline-flex items-center space-x-2 font-sans text-sm font-bold text-accent group-hover:text-primary transition-colors"
                  >
                    <span>Ver Ubicación</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 md:mt-16">
              <Link
                href="/sedes"
                className="inline-flex items-center space-x-2 font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark px-8 py-4 rounded-2xl shadow-lg transition-smooth hover:scale-105 active:scale-97"
              >
                <span>Ver Todas las Sedes</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal text-white relative overflow-hidden border-b border-accent/20">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_50%,rgba(197,160,89,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_80%,rgba(107,26,42,0.1)_0%,transparent_50%)]" />

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <span className="inline-flex items-center space-x-2 font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
            <ShoppingBag className="h-4 w-4" />
            <span>Comienza Ahora</span>
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1]">
            ¿Listo para Disfrutar?
          </h2>

          <p className="font-sans text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            Explora nuestra carta completa, personaliza tus pedidos y reserva tu experiencia gastronómica en línea. Atención rápida y trato especial garantizado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center space-x-2 font-sans text-sm font-bold text-charcoal bg-accent hover:bg-accent/90 py-4 px-8 rounded-2xl shadow-lg transition-smooth hover:scale-105 active:scale-97"
            >
              <span>Explorar Menú</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/reservar"
              className="inline-flex items-center justify-center space-x-2 font-sans text-sm font-bold text-accent bg-white/10 hover:bg-white/20 py-4 px-8 rounded-2xl border border-white/30 backdrop-blur-sm transition-smooth hover:scale-105 active:scale-97"
            >
              <span>Reservar Mesa</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FooterV2 />
    </div>
  );
}
