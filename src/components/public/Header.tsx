'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useSystemConfig } from '@/hooks/useSystemConfig';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bounce, setBounce] = useState(false);

  const { config, loading } = useSystemConfig();

  // Trigger bounce effect on cartCount change for premium UX
  useEffect(() => {
    if (cartCount === 0) return;
    setBounce(true);
    const timer = setTimeout(() => setBounce(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Menú', href: '/menu' },
    { name: 'Sedes', href: '/sedes' },
    { name: 'Reservar', href: '/reservar' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-canvas/80 border-b border-accent/10 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex flex-col justify-center">
              <span className="font-serif text-2xl font-bold tracking-tight text-primary group-hover:text-primary-dark transition-colors duration-300">
                {loading ? "..." : config?.businessName || "Restaurante"}
              </span>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-accent -mt-1 font-semibold">
                {config?.description ? config.description.split(" ").slice(0, 3).join(" ") : "FINE PASTRIES"}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm font-medium tracking-wide transition-colors duration-300 relative py-2 ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-charcoal-light hover:text-primary'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full animate-fade-in" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            
            {/* Bag Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2.5 rounded-full bg-card-bg border border-accent/10 hover:border-accent/40 shadow-sm transition-smooth hover:scale-105 active:scale-95 text-primary ${
                bounce ? 'scale-115 border-accent bg-accent/5' : ''
              }`}
              aria-label="Ver bolsa de pedidos"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-canvas font-sans font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-canvas animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-charcoal hover:text-primary hover:bg-card-bg/50 transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer-style dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-canvas border-b border-accent/15 px-4 pt-2 pb-6 space-y-2 shadow-inner animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl font-sans text-base font-semibold transition-all duration-200 ${
                isActive(link.href)
                  ? 'bg-primary/5 text-primary border-l-4 border-accent'
                  : 'text-charcoal-light hover:bg-card-bg hover:text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
