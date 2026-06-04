'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeaderV2 } from '@/components/public/HeaderV2';
import { FeaturedServices } from '@/components/public/FeaturedServices';
import { CategoriesShowcase } from '@/components/public/CategoriesShowcase';
import { CartDrawer } from '@/components/public/CartDrawer';
import { FooterV2 } from '@/components/public/FooterV2';
import { FeaturesSection } from '@/components/public/FeaturesSection';
import { HeroCarousel } from '@/components/public/HeroCarousel';
import { Award, ArrowRight, ShoppingBag } from 'lucide-react';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  cta: {
    text: string;
    href: string;
  };
}

export default function Home() {
  const [config, setConfig] = useState<any>({});
  const [featuredDishes, setFeaturedDishes] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/settings').then(r => r.json()),
      fetch('/api/public/dishes?limit=3').then(r => r.json()),
      fetch('/api/public/branches').then(r => r.json()),
    ]).then(([conf, dishes, segs]) => {
      setConfig(conf);
      setFeaturedDishes(Array.isArray(dishes) ? dishes : []);
      setBranches(Array.isArray(segs) ? segs : []);
    });
  }, []);

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loadingSlides, setLoadingSlides] = useState(true);

  const [mainHeroSlides, setMainHeroSlides] = useState<HeroSlide[]>([]);
  const [rightBannerSlides, setRightBannerSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    if (rightBannerSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prevIndex) => (prevIndex + 1) % rightBannerSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [rightBannerSlides]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/sliders');
        if (response.ok) {
          const sliders = await response.json();

          if (Array.isArray(sliders) && sliders.length > 0) {
            const mappedSlides = sliders.map((slider: any) => ({
              id: slider.id,
              image: slider.imageUrl,
              title: slider.title,
              subtitle: slider.subtitle || '',
              description: slider.description || '',
              type: slider.type || 'HERO',
              cta: {
                text: slider.ctaText || 'Ver Más',
                href: slider.ctaHref || '/menu',
              },
            }));
            setHeroSlides(mappedSlides);
            setMainHeroSlides(mappedSlides.filter((s: HeroSlide & { type?: string }) => s.type === 'HERO'));
            setRightBannerSlides(mappedSlides.filter((s: HeroSlide & { type?: string }) => s.type === 'BANNER'));
          } else {
            const defaults = getDefaultSlides();
            setHeroSlides(defaults);
            setMainHeroSlides(defaults);
            setRightBannerSlides([]);
          }
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
        const defaults = getDefaultSlides();
        setHeroSlides(defaults);
        setMainHeroSlides(defaults);
        setRightBannerSlides([]);
      } finally {
        setLoadingSlides(false);
      }
    };

    fetchSlides();
  }, []);

  const getDefaultSlides = (): HeroSlide[] => [
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
        href: '/catering',
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
      <HeroCarousel slides={mainHeroSlides} />

      <section className="py-24 md:py-32 bg-canvas relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Contenido */}
            <div className="space-y-6 animate-float-up" style={{animationDelay: '0.1s'}}>
              <div className="inline-block">
                <span className="bg-primary/10 border border-primary/30 px-4 py-2 rounded-full font-sans text-xs font-bold text-primary uppercase tracking-wider">
                  ✨ Artesanía Premium
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-charcoal leading-[1.1]">
                {config.bannerTitle || "El arte de la repostería"}
              </h2>
              <p className="font-sans text-lg text-charcoal-light leading-relaxed max-w-xl">
                {config.bannerText || "Cada postre cuenta una historia de pasión, calidad y dedicación. Hecho a mano, todos los días."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/menu" className="bg-primary hover:bg-primary-dark text-white font-sans font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                  <span>Comenzar Pedido</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="/menu" className="border-2 border-primary text-primary hover:bg-primary/5 font-sans font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-center flex items-center justify-center">
                  Ver Catálogo
                </Link>
              </div>
            </div>

            {/* Right Banner Carousel */}
            <div className="relative animate-float-up" style={{animationDelay: '0.3s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-primary to-accent rounded-3xl p-8 transform hover:scale-[1.02] transition-transform duration-500">
                <div className="aspect-square bg-canvas rounded-2xl overflow-hidden flex flex-col justify-between p-6 relative group">
                  {rightBannerSlides.length > 0 ? (
                    (() => {
                      const currentSlide = rightBannerSlides[activeSlideIndex];
                      return (
                        <div key={currentSlide.id} className="h-full flex flex-col justify-between animate-fade-in duration-500">
                          <div className="relative h-2/3 w-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                            <img
                              src={currentSlide.image}
                              alt={currentSlide.title}
                              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                            {currentSlide.subtitle && (
                              <div className="absolute top-3 left-3">
                                <span className="bg-accent text-white font-sans text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                  {currentSlide.subtitle}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="pt-4 flex items-center justify-between">
                            <div className="space-y-1 max-w-[65%]">
                              <h3 className="font-serif text-lg font-black text-charcoal truncate">
                                {currentSlide.title}
                              </h3>
                              <p className="font-sans text-xs text-charcoal-light line-clamp-1">
                                {currentSlide.description}
                              </p>
                            </div>
                            {currentSlide.cta && (
                              <Link
                                href={currentSlide.cta.href || '/menu'}
                                className="bg-primary hover:bg-primary-dark text-white font-sans font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1"
                              >
                                <span>{currentSlide.cta.text || 'Ver'}</span>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <svg className="w-24 h-24 text-primary mb-4 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="font-serif text-2xl font-bold text-charcoal">Pasteles Frescos Diarios</p>
                    </div>
                  )}

                  {rightBannerSlides.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {rightBannerSlides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlideIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === activeSlideIndex ? 'bg-primary scale-125' : 'bg-charcoal/20'
                          }`}
                          aria-label={`Ir al slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      <FeaturedServices
        tagline={config.servicesTagline}
        title={config.servicesTitle}
        description={config.servicesDescription}
      />

      <CategoriesShowcase
        tagline={config.categoriesTagline}
        title={config.categoriesTitle}
      />

      <section className="py-24 md:py-32 bg-canvas relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center space-y-6 mb-20 animate-float-up">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider">{config.bestsellersTagline || "Bestsellers"}</span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-black text-charcoal leading-[1.1]">
              {config.bestsellersTitle || "Antojos Más Aclamados"}
            </h2>
            <p className="font-sans text-lg text-charcoal-light max-w-2xl mx-auto leading-relaxed">
              {config.bestsellersDescription || "Las recetas clásicas más solicitadas. Probadas y aprobadas por nuestros clientes."}
            </p>
          </div>

          {/* Products Grid - Asymmetric */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max">
            {featuredDishes.map((dish, idx) => (
              <article
                key={dish.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 animate-float-up hover:scale-105"
                style={{animationDelay: `${idx * 0.1 + 0.2}s`}}
              >
                {/* Image with overlay */}
                <div className="relative h-64 md:h-72 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="h-full w-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-block bg-primary text-white font-sans text-xs font-bold px-4 py-2 rounded-full backdrop-blur-sm shadow-lg">
                      ⭐ Popular
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-4">
                  <h3 className="font-serif text-2xl font-black text-charcoal group-hover:text-primary transition-colors">
                    {dish.name}
                  </h3>
                  <p className="font-sans text-sm text-charcoal-light leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t-2 border-primary/10">
                    <div className="space-y-1">
                      <p className="font-sans text-xs text-charcoal-light uppercase tracking-wider">Precio</p>
                      <p className="font-serif text-2xl font-black text-primary">
                        S/. {dish.price.toFixed(2)}
                      </p>
                    </div>
                    <Link
                      href="/menu"
                      className="bg-primary text-white h-12 w-12 rounded-full flex items-center justify-center hover:bg-primary-dark transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {branches.length > 0 && (
        <section className="py-24 md:py-32 bg-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center space-y-4 mb-16 md:mb-20">
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
                {config.branchesTagline || "Visítanos"}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-black text-charcoal leading-[1.1]">
                {config.branchesTitle || "Nuestras Sedes"}
              </h2>
              <p className="font-sans text-base text-charcoal-light max-w-xl mx-auto">
                {config.branchesDescription || "Encuentra la sucursal más cercana a ti."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(Array.isArray(branches) ? branches : []).slice(0, 3).map((branch) => (
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

      <section className="py-24 md:py-32 bg-gradient-to-br from-primary via-primary-dark to-charcoal text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 animate-float-up">
          <div className="inline-flex items-center space-x-3 bg-white/10 border border-white/30 px-6 py-3 rounded-full backdrop-blur-sm">
            <ShoppingBag className="h-5 w-5 text-accent animate-bounce" />
            <span className="font-sans text-sm font-bold text-white uppercase tracking-wider">🎉 Comienza Tu Aventura Culinaria</span>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.1]">
              {config.ctaTitle || "¿Listo para Disfrutar?"}
            </h2>
            <p className="font-sans text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {config.ctaText || "Explora nuestra carta completa, personaliza tus pedidos y reserva tu experiencia gastronómica. Atención rápida y trato especial garantizado."}
            </p>
          </div>

          {/* CTA Buttons - Side by side with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link
              href="/menu"
              className="group relative inline-flex items-center justify-center space-x-2 font-sans font-bold text-charcoal bg-accent hover:bg-white py-5 px-10 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent to-white opacity-0 group-hover:opacity-20 transition-opacity" />
              <span className="relative">{config.ctaButton || "Explorar Menú Completo"}</span>
              <ArrowRight className="h-5 w-5 relative transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/reservar"
              className="group inline-flex items-center justify-center space-x-2 font-sans font-bold text-white border-2 border-white/40 hover:border-white bg-white/10 hover:bg-white/20 py-5 px-10 rounded-3xl backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <span>Reservar Mesa Ahora</span>
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust statement */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✓</span>
              <p className="font-sans text-sm text-white/80">Entrega garantizada</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <p className="font-sans text-sm text-white/80">Atención personalizada</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <p className="font-sans text-sm text-white/80">100% Premium</p>
            </div>
          </div>
        </div>
      </section>

      <FooterV2 />
    </div>
  );
}
