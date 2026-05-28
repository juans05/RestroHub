'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CartDrawer } from '@/components/public/CartDrawer';
import { mockDB } from '@/lib/mockData';
import { ArrowRight, ShoppingBag, Clock, Heart, Award } from 'lucide-react';

export default function Home() {
  const config = mockDB.getConfig();
  const featuredDishes = mockDB.getDishes().slice(0, 3); // Get first 3 featured items
  const branchesCount = mockDB.getBranches().length;

  return (
    <div className="flex-1 flex flex-col bg-canvas">
      <Header />
      <CartDrawer />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-canvas to-canvas border-b border-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text details */}
            <div className="lg:col-span-6 space-y-8 text-left animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-primary/5 border border-accent/15 px-3 py-1 rounded-full text-primary font-sans text-xs font-semibold uppercase tracking-wider">
                <Award className="h-4 w-4 text-accent" />
                <span>Repostería Artesanal Premium</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-charcoal leading-[1.1] tracking-tight">
                {config.bannerTitle}
              </h1>
              <p className="font-sans text-base sm:text-lg text-charcoal-light leading-relaxed max-w-xl">
                {config.bannerText}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/menu"
                  className="font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark py-4 px-8 rounded-2xl shadow-md transition-smooth hover:scale-103 active:scale-97 flex items-center justify-center space-x-2"
                >
                  <span>Explorar Carta</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/reservar"
                  className="font-sans text-sm font-bold text-primary bg-card-bg hover:bg-canvas border border-accent/35 py-4 px-8 rounded-2xl shadow-sm transition-smooth hover:scale-103 active:scale-97 text-center"
                >
                  Reservar Mesa
                </Link>
              </div>

              {/* Statistics details */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-accent/10">
                <div>
                  <span className="block font-serif text-2xl font-black text-primary">100%</span>
                  <span className="block font-sans text-[10px] uppercase tracking-wider text-charcoal-light font-semibold mt-0.5">Hecho en Casa</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-black text-primary">{branchesCount}</span>
                  <span className="block font-sans text-[10px] uppercase tracking-wider text-charcoal-light font-semibold mt-0.5">Sedes Oficiales</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-black text-primary">15+</span>
                  <span className="block font-sans text-[10px] uppercase tracking-wider text-charcoal-light font-semibold mt-0.5">Dulces Antojos</span>
                </div>
              </div>

            </div>

            {/* Visual Hero Showcase */}
            <div className="lg:col-span-6 relative shrink-0 flex items-center justify-center">
              <div className="relative w-full max-w-[480px] h-[340px] sm:h-[420px] rounded-[48px] overflow-hidden border-2 border-accent/20 shadow-2xl z-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80"
                  alt="Pastelería Fina"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent flex items-end p-8">
                  <div className="text-white space-y-1">
                    <span className="font-sans text-[10px] tracking-widest uppercase text-accent font-extrabold">Recomendado</span>
                    <h3 className="font-serif text-2xl font-black">{featuredDishes[0]?.name || "Torta María Almenara"}</h3>
                    <p className="font-sans text-xs text-white/80 line-clamp-1">Fudge artesanal & manjarblanco de olla.</p>
                  </div>
                </div>
              </div>
              
              {/* Abstract decorations */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/15 rounded-full blur-3xl z-0" />
              <div className="absolute -bottom-6 -right-6 w-44 h-44 bg-primary/10 rounded-full blur-3xl z-0" />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Key Pillars Section */}
      <section className="py-20 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-canvas border border-accent/10 rounded-[24px]">
              <div className="h-12 w-12 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-4 border border-accent/15">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-serif text-base font-extrabold text-charcoal mb-2">Ingredientes Premium</h3>
              <p className="font-sans text-xs text-charcoal-light leading-relaxed">
                Utilizamos cacao orgánico al 70%, mantequilla pura de pastura y frutas seleccionadas a mano.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-canvas border border-accent/10 rounded-[24px]">
              <div className="h-12 w-12 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-4 border border-accent/15">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-serif text-base font-extrabold text-charcoal mb-2">Fresco Diario</h3>
              <p className="font-sans text-xs text-charcoal-light leading-relaxed">
                Nuestros reposteros hornean de madrugada para que disfrutes siempre de la textura y frescura ideal.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-canvas border border-accent/10 rounded-[24px]">
              <div className="h-12 w-12 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-4 border border-accent/15">
                <ShoppingBag className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-serif text-base font-extrabold text-charcoal mb-2">Bolsa & Reserva</h3>
              <p className="font-sans text-xs text-charcoal-light leading-relaxed">
                Elige tus platos favoritos de la carta digital y agiliza tu reserva en línea con confirmación directa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Showcase */}
      <section className="py-24 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <span className="font-sans text-[11px] tracking-widest uppercase text-accent font-extrabold">Especialidades</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-charcoal">Antojos Más Aclamados</h2>
            <p className="font-sans text-sm text-charcoal-light max-w-md mx-auto">
              Una cuidada selección de nuestras recetas clásicas más solicitadas por las familias limeñas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDishes.map((dish) => (
              <article key={dish.id} className="group relative bg-card-bg border border-accent/15 rounded-[32px] p-5 shadow-sm hover:shadow-lg transition-smooth">
                <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-canvas mb-4">
                  <img src={dish.imageUrl} alt={dish.name} className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-base font-extrabold text-charcoal">{dish.name}</h3>
                  <p className="font-sans text-xs text-charcoal-light line-clamp-2 leading-relaxed">{dish.description}</p>
                  <div className="flex justify-between items-center pt-3 border-t border-accent/5">
                    <span className="font-sans text-sm font-extrabold text-primary">S/. {dish.price.toFixed(2)}</span>
                    <Link href="/menu" className="font-sans text-xs font-bold text-accent group-hover:text-primary transition-colors flex items-center space-x-1">
                      <span>Ver en Carta</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-flex font-sans text-sm font-bold text-primary bg-primary/5 hover:bg-primary hover:text-white py-3.5 px-8 rounded-2xl border border-primary/20 shadow-sm transition-smooth hover:scale-103 active:scale-97"
            >
              Ver Carta Completa
            </Link>
          </div>

        </div>
      </section>

      {/* 4. Brand Promo CTA banner */}
      <section className="py-24 bg-charcoal text-canvas relative overflow-hidden border-b border-accent/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent z-0" />
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            ¿Planeas un evento o deseas una mesa especial?
          </h2>
          <p className="font-sans text-sm sm:text-base text-canvas/75 max-w-xl mx-auto leading-relaxed">
            Realiza tu pedido o reserva en tu sede preferida en solo 3 clics. Configura tu bolsa con postres y salados y confirma tu reserva instantáneamente a través de WhatsApp.
          </p>
          <div className="pt-2">
            <Link
              href="/reservar"
              className="inline-flex font-sans text-sm font-bold text-charcoal bg-accent hover:bg-accent/90 py-4 px-8 rounded-2xl shadow-lg transition-smooth hover:scale-103 active:scale-97"
            >
              Reservar Mesa Ahora
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
