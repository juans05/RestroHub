'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { SedeCard } from '@/components/public/SedeCard';
import { CartDrawer } from '@/components/public/CartDrawer';
import { mockDB, Branch } from '@/lib/mockData';
import { Map, Info } from 'lucide-react';

export default function SedesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchedBranches = mockDB.getBranches().filter(b => b.isActive);
    setBranches(fetchedBranches);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-canvas min-h-screen">
      <Header />
      <CartDrawer />

      {/* Hero Banner Header */}
      <section className="bg-card-bg border-b border-accent/10 py-12 md:py-16 text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center space-x-1.5 bg-primary/5 border border-accent/15 px-3 py-1 rounded-full text-primary font-sans text-xs font-semibold uppercase tracking-wider">
            <Map className="h-4 w-4 text-accent" />
            <span>Encuentra tu rincón favorito</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight">
            Nuestras Sedes Oficiales
          </h1>
          <p className="font-sans text-xs sm:text-sm text-charcoal-light max-w-lg mx-auto leading-relaxed">
            Te invitamos a visitarnos y pasar una tarde inolvidable en cualquiera de nuestros cálidos locales. Disfruta de un café de especialidad y nuestra repostería fresca recién horneada.
          </p>
        </div>
      </section>

      {/* Sedes Directory Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {branches.length === 0 ? (
          
          /* Empty Sedes state */
          <div className="text-center py-20 space-y-4 max-w-xs mx-auto animate-fade-in">
            <p className="text-4xl">📍</p>
            <h3 className="font-serif text-lg font-bold text-charcoal">Locales temporalmente inactivos</h3>
            <p className="font-sans text-xs text-charcoal-light leading-relaxed">
              Estamos renovando nuestras instalaciones para brindarte una mejor atención. ¡Regresa pronto!
            </p>
          </div>
        ) : (
          
          /* Grid of branches */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch) => (
              <SedeCard key={branch.id} branch={branch} />
            ))}
          </div>
        )}

        {/* Quality Banner Info */}
        <div className="mt-16 bg-card-bg border border-accent/15 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto shadow-sm">
          <div className="p-4 rounded-full bg-accent/5 border border-accent/10 shrink-0 text-accent">
            <Info className="h-7 w-7" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-lg font-bold text-charcoal">Reserva de Mesas & Eventos especiales</h3>
            <p className="font-sans text-xs text-charcoal-light leading-relaxed">
              ¿Deseas planificar un cumpleaños, reunión corporativa o brunch especial? Puedes agendar tu reserva llenando nuestro formulario de reservas y eligiendo la sede de tu preferencia. También puedes comunicarte por WhatsApp directamente con el local.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
