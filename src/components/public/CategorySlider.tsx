'use client';

import React, { useRef } from 'react';
import { Category } from '@/lib/mockData';

interface CategorySliderProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (id: string, index: number) => {
    onSelectCategory(id);

    // Smooth scroll into viewport center on mobile
    if (containerRef.current) {
      const button = containerRef.current.children[index] as HTMLElement;
      if (button) {
        const containerWidth = containerRef.current.clientWidth;
        const buttonOffsetLeft = button.offsetLeft;
        const buttonWidth = button.clientWidth;
        containerRef.current.scrollTo({
          left: buttonOffsetLeft - containerWidth / 2 + buttonWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div className="w-full border-b border-accent/10 bg-canvas/90 backdrop-blur-md sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={containerRef}
          className="flex space-x-8 overflow-x-auto py-5 no-scrollbar scroll-smooth cursor-grab select-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {categories.map((cat, idx) => {
            const active = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id, idx)}
                className={`font-sans text-sm font-semibold tracking-wide whitespace-nowrap pb-2.5 transition-all duration-300 relative focus:outline-none cursor-pointer ${
                  active
                    ? 'text-primary scale-102 font-bold'
                    : 'text-charcoal-light hover:text-primary'
                }`}
              >
                {cat.name}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent rounded-full animate-scale-x" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
