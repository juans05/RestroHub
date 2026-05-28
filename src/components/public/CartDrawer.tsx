'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();

  // Prevent scroll on body when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/reservar');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className={`fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40 transition-opacity duration-500 ease-in-out ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide drawer container */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-canvas border-l border-accent/15 shadow-2xl flex flex-col justify-between transition-transform duration-500 ease-in-out transform ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-accent/10 flex justify-between items-center bg-card-bg">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h2 className="font-serif text-xl font-bold text-charcoal">
              Bolsa de Pedidos
            </h2>
            {cartCount > 0 && (
              <span className="font-sans text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-canvas text-charcoal-light hover:text-primary transition-colors duration-200"
            aria-label="Cerrar bolsa"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
              <div className="p-6 rounded-full bg-accent/5 border border-accent/10">
                <ShoppingBag className="h-12 w-12 text-accent stroke-[1.2]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-charcoal">Tu bolsa está vacía</h3>
                <p className="font-sans text-sm text-charcoal-light max-w-xs leading-relaxed">
                  ¿Aún no te decides? Explora nuestra exquisita carta y deleita tu paladar con nuestras especialidades.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/menu');
                }}
                className="font-sans text-sm font-semibold text-white bg-primary hover:bg-primary-dark py-3.5 px-6 rounded-2xl shadow-md transition-smooth hover:scale-103 active:scale-97"
              >
                Explorar Nuestra Carta
              </button>
            </div>
          ) : (
            
            /* Items List */
            <div className="space-y-4 divide-y divide-accent/10">
              {cart.map((item, index) => (
                <div
                  key={item.dish.id}
                  className={`flex py-4 first:pt-0 gap-4 animate-scale-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-accent/10 shrink-0 bg-white">
                    <img
                      src={item.dish.imageUrl}
                      alt={item.dish.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details & Action controls */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-bold text-charcoal line-clamp-1 pr-2">
                          {item.dish.name}
                        </h4>
                        <span className="font-sans text-sm font-bold text-primary shrink-0">
                          S/. {(item.dish.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-charcoal-light mt-0.5 line-clamp-1">
                        S/. {item.dish.price.toFixed(2)} c/u
                      </p>
                    </div>

                    {/* Quantity Selector and Delete Trash button */}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-accent/20 rounded-xl bg-card-bg shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-charcoal-light hover:text-primary hover:bg-canvas/60 rounded-l-xl transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-sans text-xs font-bold text-charcoal px-3 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-charcoal-light hover:text-primary hover:bg-canvas/60 rounded-r-xl transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.dish.id)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-charcoal-light hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        aria-label="Eliminar item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Billing Card */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-accent/15 bg-card-bg space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-charcoal-light text-sm font-sans">
                <span>Subtotal de productos:</span>
                <span>S/. {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-charcoal text-base font-serif font-extrabold border-t border-accent/10 pt-3">
                <span>Total Estimado:</span>
                <span className="text-primary text-xl">S/. {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark py-4 px-6 rounded-2xl shadow-md transition-smooth hover:scale-102 active:scale-98 flex items-center justify-center space-x-2"
            >
              <span>Continuar con mi Reserva</span>
            </button>
            <p className="font-sans text-[10px] text-center text-charcoal-light tracking-wide leading-relaxed">
              * Agenda tu fecha, hora y sede favorita en la siguiente pantalla.
            </p>
          </div>
        )}

      </aside>
    </>
  );
};
