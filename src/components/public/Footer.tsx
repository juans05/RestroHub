'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useSystemConfig } from '@/hooks/useSystemConfig';

export const Footer: React.FC = () => {
  const { config, loading } = useSystemConfig();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-canvas pt-16 pb-8 border-t border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand Info */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-3xl font-extrabold tracking-tight text-white">
                {config?.businessName || "Restaurante"}
              </span>
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-semibold mt-1">
                {config?.description?.split(" ").slice(0, 2).join(" ") || "FINE PASTRIES"}
              </span>
            </Link>
            <p className="font-sans text-sm text-canvas/75 max-w-sm leading-relaxed">
              {config?.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-accent">
              Nuestra Casa
            </h3>
            <ul className="space-y-4 font-sans text-sm">
              <li>
                <Link href="/" className="text-canvas/75 hover:text-accent transition-colors duration-200">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-canvas/75 hover:text-accent transition-colors duration-200">
                  Carta Digital
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

          {/* Contact Details */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-accent">
              Contacto
            </h3>
            <ul className="space-y-4 font-sans text-sm text-canvas/75">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>{config?.address || "Lima, Perú"}</span>
              </li>
              {config?.whatsapp && (
                <li className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-accent shrink-0" />
                  <a href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`} className="hover:text-accent transition-colors duration-200">
                    {config.whatsapp}
                  </a>
                </li>
              )}
              {config?.email && (
                <li className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-accent shrink-0" />
                  <a href={`mailto:${config.email}`} className="hover:text-accent transition-colors duration-200 break-all">
                    {config.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-canvas/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-canvas/50 font-sans space-y-4 md:space-y-0">
          <p>© {currentYear} {config?.businessName || "Restaurante"}. Todos los derechos reservados.</p>
          <div className="flex space-x-6">
            <Link href="/admin/login" className="hover:text-accent transition-colors duration-200 font-semibold uppercase tracking-wider">
              Panel Administrador
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
