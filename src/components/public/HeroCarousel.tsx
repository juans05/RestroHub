'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

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

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  autoplay = true,
  autoplayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayActive, setIsAutoplayActive] = useState(autoplay);

  const goToSlide = (index: number) => {
    setCurrentIndex(index % slides.length);
    setIsAutoplayActive(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsAutoplayActive(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setIsAutoplayActive(false);
  };

  // Autoplay effect
  useEffect(() => {
    if (!isAutoplayActive) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [isAutoplayActive, autoplayInterval, slides.length]);

  // Resume autoplay after user interaction
  useEffect(() => {
    if (isAutoplayActive) return;

    const timer = setTimeout(() => {
      setIsAutoplayActive(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAutoplayActive]);

  if (!slides || slides.length === 0) {
    return (
      <section className="relative w-full h-screen max-h-[800px] sm:max-h-[600px] overflow-hidden bg-charcoal flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center items-start">
          <div className="max-w-2xl space-y-6 w-full animate-pulse">
            {/* Subtitle placeholder */}
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full h-8 w-32" />
            
            {/* Title placeholder */}
            <div className="h-16 bg-white/10 rounded-2xl w-3/4" />
            
            {/* Description placeholder */}
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-5/6" />
            </div>
            
            {/* CTA placeholder */}
            <div className="h-12 bg-white/10 rounded-2xl w-48" />
          </div>
        </div>
      </section>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative w-full h-screen max-h-[800px] sm:max-h-[600px] overflow-hidden bg-charcoal">

      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/50 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-start z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-0">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            {/* Subtitle */}
            <div className="inline-flex items-center space-x-2 bg-accent/20 border border-accent/50 px-4 py-2 rounded-full">
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold">
                {currentSlide.subtitle}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
              {currentSlide.title}
            </h1>

            {/* Description */}
            <p className="font-sans text-base sm:text-lg text-white/90 max-w-xl leading-relaxed">
              {currentSlide.description}
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href={currentSlide.cta.href}
                className="inline-flex items-center space-x-2 font-sans text-sm font-bold text-charcoal bg-accent hover:bg-accent/90 py-4 px-8 rounded-2xl shadow-lg transition-smooth hover:scale-105 active:scale-97"
              >
                <span>{currentSlide.cta.text}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-4">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-smooth backdrop-blur-sm border border-white/20"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Dots Indicators */}
        <div className="flex items-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 bg-accent'
                  : 'w-2.5 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-smooth backdrop-blur-sm border border-white/20"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
};
