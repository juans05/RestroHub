'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CategorySlider } from '@/components/public/CategorySlider';
import { DishCard } from '@/components/public/DishCard';
import { CartDrawer } from '@/components/public/CartDrawer';
import { mockDB, Category, Dish } from '@/lib/mockData';
import { BookOpen, Search } from 'lucide-react';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch initial data from mockDB
  useEffect(() => {
    const fetchedCategories = mockDB.getCategories().sort((a, b) => a.order - b.order);
    const fetchedDishes = mockDB.getDishes().filter(d => d.isActive).sort((a, b) => a.order - b.order);

    setCategories(fetchedCategories);
    setDishes(fetchedDishes);

    if (fetchedCategories.length > 0) {
      setActiveCategoryId(fetchedCategories[0].id);
    }
  }, []);

  // Filter dishes based on active category and search query
  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = dish.categoryId === activeCategoryId;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (searchQuery.trim() !== '') {
      return matchesSearch; // Search globally if there is a query
    }
    return matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col bg-canvas min-h-screen">
      <Header />
      <CartDrawer />

      {/* Hero Banner Header */}
      <section className="bg-card-bg border-b border-accent/10 py-12 md:py-16 text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center space-x-1.5 bg-primary/5 border border-accent/15 px-3 py-1 rounded-full text-primary font-sans text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="h-4 w-4 text-accent" />
            <span>Delicias para compartir</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight">
            Nuestra Carta Digital
          </h1>
          <p className="font-sans text-xs sm:text-sm text-charcoal-light max-w-lg mx-auto leading-relaxed">
            Explora nuestra selecta variedad de tortas finas, sándwiches artesanales, quiches horneados y bebidas premium preparadas al instante.
          </p>
        </div>
      </section>

      {/* Global Interactive Search */}
      <div className="max-w-md mx-auto w-full px-4 sm:px-0 -mt-6 z-10 relative">
        <div className="relative shadow-md rounded-2xl overflow-hidden bg-canvas border border-accent/20">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
            <Search className="h-4.5 w-4.5 stroke-[1.8]" />
          </div>
          <input
            type="text"
            placeholder="Buscar postres, salados o cafés..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 font-sans text-sm text-charcoal bg-canvas border-none focus:outline-none placeholder-charcoal-light/60"
          />
        </div>
      </div>

      {/* Category Horizontal Slider (Hidden if searching globally) */}
      {searchQuery.trim() === '' && categories.length > 0 && (
        <CategorySlider
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
        />
      )}

      {/* Dishes Grid Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {filteredDishes.length === 0 ? (
          
          /* Empty Search or Category state */
          <div className="text-center py-20 space-y-4 max-w-xs mx-auto animate-fade-in">
            <p className="text-4xl">🧁</p>
            <h3 className="font-serif text-lg font-bold text-charcoal">No se encontraron delicias</h3>
            <p className="font-sans text-xs text-charcoal-light leading-relaxed">
              Prueba buscando otro platillo o revisa otra de nuestras categorías en el menú superior.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="font-sans text-xs font-semibold text-primary underline hover:text-primary-dark mt-2"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          
          /* Grid of Dishes */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
