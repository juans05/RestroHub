'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Clock, ShoppingBag } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  isHighlighted: boolean;
  order: number;
}

const ICON_MAP: { [key: string]: React.ReactNode } = {
  'heart': <Heart className="h-10 w-10 md:h-12 md:w-12" />,
  'clock': <Clock className="h-10 w-10 md:h-12 md:w-12" />,
  'shopping-bag': <ShoppingBag className="h-10 w-10 md:h-12 md:w-12" />,
};

const DEFAULT_FEATURES: Feature[] = [
  {
    id: '1',
    title: 'Ingredientes Premium',
    description: 'Cacao orgánico, mantequilla pura, frutas seleccionadas. Solo lo mejor en cada bocado.',
    icon: 'heart',
    isHighlighted: true,
    order: 1,
  },
  {
    id: '2',
    title: 'Fresco Diario',
    description: 'Nuestros reposteros hornean de madrugada para textura y frescura garantizadas.',
    icon: 'clock',
    isHighlighted: false,
    order: 2,
  },
  {
    id: '3',
    title: 'Bolsa & Reserva',
    description: 'Elige online, confirma por WhatsApp. Simple, rápido y con atención personalizada.',
    icon: 'shopping-bag',
    isHighlighted: false,
    order: 3,
  },
];

export const FeaturesSection = () => {
  const [features, setFeatures] = useState<Feature[]>(DEFAULT_FEATURES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch('/api/public/features');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setFeatures(data.sort((a: any, b: any) => a.order - b.order));
          }
        }
      } catch (error) {
        console.error('Error fetching features:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-canvas relative overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="h-64 bg-canvas rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  const highlightedFeature = features.find(f => f.isHighlighted);
  const otherFeatures = features.filter(f => !f.isHighlighted);

  return (
    <section className="py-20 md:py-32 bg-canvas relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-20 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-max">
          {/* Highlighted Feature - Card 1 */}
          {highlightedFeature && (
            <div className="lg:col-span-1 lg:row-span-2 group animate-float-up" style={{animationDelay: '0.1s'}}>
              <div className="h-full bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 mb-6 text-accent">
                    {ICON_MAP[highlightedFeature.icon] || ICON_MAP['heart']}
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-black mb-4">{highlightedFeature.title}</h3>
                  <p className="font-sans text-sm md:text-base text-white/90 leading-relaxed">
                    {highlightedFeature.description}
                  </p>
                </div>
                <div className="mt-6 text-4xl font-black text-accent">01</div>
              </div>
            </div>
          )}

          {/* Other Features */}
          {otherFeatures.map((feature, idx) => (
            <div key={feature.id} className="animate-float-up" style={{animationDelay: `${(idx + 1) * 0.1}s`}}>
              <div className="h-full bg-white border-2 border-primary/20 rounded-2xl p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="h-10 w-10 mb-4 text-primary">
                  {ICON_MAP[feature.icon] || ICON_MAP['heart']}
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal mb-3">{feature.title}</h3>
                <p className="font-sans text-sm text-charcoal-light">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
