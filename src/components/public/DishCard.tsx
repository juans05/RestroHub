'use client';

import React from 'react';
import { Dish } from '@/lib/mockData';
import { useCart } from '@/context/CartContext';
import { Plus, Check } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { addToCart, cart } = useCart();
  const cartItem = cart.find((item) => item.dish.id === dish.id);
  const inCart = !!cartItem;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dish.isAvailable) return;
    addToCart(dish);
  };

  return (
    <article
      className={`group relative flex flex-col justify-between bg-card-bg border border-accent/15 rounded-[32px] p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-smooth ${
        !dish.isAvailable ? 'opacity-80' : ''
      }`}
    >
      <div>
        
        {/* Image Container */}
        <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-canvas border border-accent/5 mb-4 shrink-0">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          
          {/* Availability Badges */}
          {!dish.isAvailable ? (
            <div className="absolute inset-0 bg-charcoal/65 backdrop-blur-[2px] flex items-center justify-center">
              <span className="font-sans text-xs font-bold tracking-widest uppercase text-white bg-accent/90 px-4 py-1.5 rounded-full border border-white/20 shadow-md">
                Agotado
              </span>
            </div>
          ) : (
            inCart && (
              <div className="absolute top-3 right-3 bg-primary text-white p-1.5 rounded-full border border-canvas/20 shadow-md flex items-center justify-center animate-scale-in">
                <Check className="h-3 w-3 stroke-[2.5]" />
              </div>
            )
          )}
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-serif text-base font-extrabold text-charcoal line-clamp-1 pr-1">
              {dish.name}
            </h3>
          </div>
          <p className="font-sans text-xs text-charcoal-light line-clamp-2 min-h-[32px] leading-relaxed">
            {dish.description}
          </p>
        </div>

      </div>

      {/* Footer controls: Pricing & Call to Action button */}
      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col">
          <span className="font-sans text-[10px] uppercase tracking-wider text-accent font-semibold">Precio</span>
          <span className="font-sans text-base font-extrabold text-primary">
            S/. {dish.price.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={!dish.isAvailable}
          className={`flex items-center justify-center h-11 w-11 rounded-2xl shadow-sm transition-all duration-300 ${
            !dish.isAvailable
              ? 'bg-canvas text-charcoal-light/30 border border-accent/10 cursor-not-allowed'
              : inCart
              ? 'bg-accent hover:bg-accent/90 text-white hover:scale-105 active:scale-95'
              : 'bg-primary hover:bg-primary-dark text-white hover:scale-105 active:scale-95'
          }`}
          aria-label={dish.isAvailable ? `Añadir ${dish.name} a la bolsa` : 'Producto agotado'}
        >
          <Plus className="h-5 w-5 stroke-[2.2]" />
        </button>
      </div>

    </article>
  );
};
