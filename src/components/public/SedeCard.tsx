'use client';

import React, { useState } from 'react';
import { Branch } from '@/lib/mockData';
import { MapPin, Phone, Clock, ChevronDown, MessageCircle, Navigation } from 'lucide-react';

interface SedeCardProps {
  branch: Branch;
}

export const SedeCard: React.FC<SedeCardProps> = ({ branch }) => {
  const [showHours, setShowHours] = useState(false);

  const handleWhatsapp = () => {
    const formattedPhone = branch.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  return (
    <article className="group bg-card-bg border border-accent/15 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-smooth flex flex-col justify-between">
      <div>
        
        {/* Cover Image */}
        <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-canvas border border-accent/5 mb-5 shrink-0">
          <img
            src={branch.imageUrl}
            alt={branch.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <h3 className="font-serif text-lg font-extrabold text-charcoal">
              {branch.name}
            </h3>
            <p className="font-sans text-xs text-accent font-semibold tracking-wide uppercase mt-0.5">
              Sede Oficial
            </p>
          </div>

          <div className="space-y-3 font-sans text-xs text-charcoal-light">
            <div className="flex items-start space-x-2.5">
              <MapPin className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
              <span className="leading-relaxed">{branch.address}</span>
            </div>
            
            <div className="flex items-center space-x-2.5">
              <Phone className="h-4 w-4 text-accent shrink-0" />
              <span>{branch.phone}</span>
            </div>
          </div>

          {/* Schedulers Accordion */}
          <div className="border-t border-b border-accent/10 py-3">
            <button
              onClick={() => setShowHours(!showHours)}
              className="w-full flex justify-between items-center text-charcoal hover:text-primary font-sans text-xs font-bold transition-colors cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-accent" />
                <span>Ver Horarios Semanales</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 text-charcoal-light transition-transform duration-300 ${
                  showHours ? 'rotate-180 text-primary' : ''
                }`}
              />
            </button>

            {/* Accordion panel */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                showHours ? 'max-h-60 mt-3 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-canvas/50 rounded-xl p-3 space-y-2 border border-accent/5 font-sans text-[11px] text-charcoal-light">
                {Object.entries(branch.hours).map(([day, hrs]) => (
                  <div key={day} className="flex justify-between items-center py-0.5">
                    <span className="font-semibold text-charcoal">{day}</span>
                    <span>{hrs}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Buttons and call actions */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={handleWhatsapp}
          className="font-sans text-xs font-bold text-[#25D366] bg-[#25D366]/5 border border-[#25D366]/20 hover:bg-[#25D366] hover:text-white py-3 px-4 rounded-2xl shadow-sm transition-smooth hover:scale-103 active:scale-97 flex items-center justify-center space-x-1.5"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span>WhatsApp</span>
        </button>

        <a
          href={branch.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs font-bold text-white bg-primary hover:bg-primary-dark py-3 px-4 rounded-2xl shadow-sm transition-smooth hover:scale-103 active:scale-97 flex items-center justify-center space-x-1.5 text-center"
        >
          <Navigation className="h-4 w-4 shrink-0" />
          <span>Cómo Llegar</span>
        </a>
      </div>

    </article>
  );
};
