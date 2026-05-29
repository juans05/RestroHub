'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, MessageCircle } from 'lucide-react';
import { useSystemConfig } from '@/hooks/useSystemConfig';

export const HeaderV2: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { config, loading } = useSystemConfig();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount === 0) return;
    setBounce(true);
    const timer = setTimeout(() => setBounce(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  const navLinks = [
    { name: 'Menú', href: '/menu' },
    { name: 'Sedes', href: '/sedes' },
    { name: 'Reservar', href: '/reservar' },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  const whatsappNumber = config?.whatsapp?.replace(/\D/g, '');
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=Hola,%20me%20gustaría%20hacer%20un%20pedido` : '#';

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'backdrop-blur-xl bg-canvas/95 shadow-lg border-b border-accent/20'
        : 'bg-canvas/80 border-b border-accent/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo / Brand */}
          <Link href="/" className="flex-shrink-0 group flex flex-col justify-center min-w-0">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-primary group-hover:text-primary-dark transition-colors duration-300 truncate">
              {loading ? "..." : config?.businessName || "Restaurante"}
            </span>
            <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-accent font-semibold -mt-1">
              {config?.description ? config.description.split(" ").slice(0, 2).join(" ") : "REPOSTERÍA"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 mx-8 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm font-medium tracking-wide transition-colors duration-300 relative py-2 whitespace-nowrap ${
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
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">

            {/* WhatsApp Button - Hidden on small screens */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20BA58] text-white font-sans font-bold text-sm transition-smooth shadow-md hover:scale-105 active:scale-95"
              aria-label="Contactar por WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Bag Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2.5 rounded-full bg-card-bg border transition-smooth hover:scale-105 active:scale-95 text-primary ${
                bounce
                  ? 'scale-115 border-accent bg-accent/5 shadow-md'
                  : 'border-accent/10 hover:border-accent/40 shadow-sm'
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
              className="lg:hidden p-2 rounded-lg text-charcoal hover:text-primary hover:bg-card-bg/50 transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-canvas border-b border-accent/15 px-4 pt-2 pb-6 space-y-2 shadow-inner animate-fade-in">
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
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA58] text-white font-sans font-bold transition-all duration-200 w-full mt-4"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Contactar por WhatsApp</span>
          </a>
        </div>
      )}
    </header>
  );
};
