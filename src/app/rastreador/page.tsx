'use client';

import React, { useState } from 'react';
import { HeaderV2 } from '@/components/public/HeaderV2';
import { FooterV2 } from '@/components/public/FooterV2';
import { CartDrawer } from '@/components/public/CartDrawer';
import { Search, Package, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface OrderStatus {
  id: string;
  orderNumber: string;
  status: 'pendiente' | 'confirmada' | 'en-preparacion' | 'listo' | 'entregado';
  estimatedTime: string;
  items: Array<{ name: string; quantity: number }>;
  total: number;
}

const mockOrders: Record<string, OrderStatus> = {
  'DEMO123': {
    id: '1',
    orderNumber: 'DEMO123',
    status: 'en-preparacion',
    estimatedTime: '15 minutos',
    items: [
      { name: 'Torta de Chocolate', quantity: 1 },
      { name: 'Postres Individuales', quantity: 3 },
    ],
    total: 85.50,
  },
  'DEMO456': {
    id: '2',
    orderNumber: 'DEMO456',
    status: 'entregado',
    estimatedTime: 'Entregado hace 2 horas',
    items: [
      { name: 'Boxes de Regalos', quantity: 2 },
    ],
    total: 120.00,
  },
};

const statusConfig = {
  pendiente: {
    label: 'Pendiente de Confirmación',
    icon: <Clock className="h-6 w-6" />,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    step: 1,
  },
  confirmada: {
    label: 'Confirmada',
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    step: 2,
  },
  'en-preparacion': {
    label: 'En Preparación',
    icon: <Package className="h-6 w-6" />,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    step: 3,
  },
  listo: {
    label: 'Listo para Retirar',
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'text-green-600 bg-green-50 border-green-200',
    step: 4,
  },
  entregado: {
    label: 'Entregado',
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'text-green-700 bg-green-50 border-green-300',
    step: 5,
  },
};

export default function RastreadorPage() {
  const [searchInput, setSearchInput] = useState('');
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const upperInput = searchInput.toUpperCase();

    if (mockOrders[upperInput]) {
      setOrder(mockOrders[upperInput]);
    } else {
      setOrder(null);
    }
  };

  const resetSearch = () => {
    setSearchInput('');
    setOrder(null);
    setSearched(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-canvas">
      <HeaderV2 />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:30px_30px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center space-x-2 font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold bg-accent/20 px-4 py-2 rounded-full border border-accent/40">
              <Package className="h-4 w-4" />
              <span>Rastrear Tu Pedido</span>
            </span>

            <h1 className="font-serif text-5xl md:text-6xl font-black leading-[1.1]">
              ¿Dónde está mi pedido?
            </h1>

            <p className="font-sans text-lg text-white/90 leading-relaxed max-w-2xl">
              Ingresa el número de tu pedido para ver su estado en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-24 md:py-32 bg-card-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <form onSubmit={handleSearch} className="space-y-6 mb-16">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                placeholder="Ej: DEMO123"
                className="w-full px-6 py-4 rounded-2xl bg-canvas border-2 border-accent/20 font-sans text-lg outline-none focus:border-accent/60 transition-colors"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-primary hover:bg-primary-dark text-white transition-smooth"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center">
              <p className="font-sans text-sm text-charcoal-light">
                💡 Prueba: <strong>DEMO123</strong> o <strong>DEMO456</strong>
              </p>
            </div>
          </form>

          {searched && !order && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
              <h3 className="font-serif text-2xl font-black text-charcoal">
                Pedido no encontrado
              </h3>
              <p className="font-sans text-base text-charcoal-light max-w-md mx-auto">
                No pudimos encontrar un pedido con ese número. Por favor verifica el número e intenta de nuevo.
              </p>
              <button
                onClick={resetSearch}
                className="inline-flex items-center space-x-2 font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark px-8 py-3 rounded-xl transition-smooth"
              >
                <span>Intentar de Nuevo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {order && (
            <div className="space-y-12">

              {/* Order Header */}
              <div className="bg-canvas border-2 border-accent/20 rounded-2xl p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="font-sans text-sm text-charcoal-light mb-1">Número de Pedido</p>
                    <h2 className="font-serif text-3xl font-black text-charcoal">
                      {order.orderNumber}
                    </h2>
                  </div>
                  <div className={`flex items-center space-x-3 px-6 py-3 rounded-xl border-2 ${statusConfig[order.status].color}`}>
                    {statusConfig[order.status].icon}
                    <span className="font-sans font-bold">
                      {statusConfig[order.status].label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-accent/10 rounded-xl border border-accent/20">
                  <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                  <p className="font-sans text-base text-charcoal font-semibold">
                    Tiempo estimado: <span className="text-primary font-black">{order.estimatedTime}</span>
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-black text-charcoal">
                  Estado del Pedido
                </h3>

                <div className="space-y-4">
                  {['pendiente', 'confirmada', 'en-preparacion', 'listo', 'entregado'].map((step, index) => {
                    const stepConfig = statusConfig[step as keyof typeof statusConfig];
                    const isCompleted = stepConfig.step <= statusConfig[order.status].step;

                    return (
                      <div key={step} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                              isCompleted
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            {stepConfig.step}
                          </div>
                          {index < 4 && (
                            <div
                              className={`w-1 h-12 my-2 transition-colors ${
                                isCompleted ? 'bg-primary' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>

                        <div className="pb-8">
                          <p className="font-sans font-bold text-charcoal text-lg">
                            {stepConfig.label}
                          </p>
                          <p className="font-sans text-sm text-charcoal-light mt-1">
                            {stepConfig.step === statusConfig[order.status].step
                              ? 'En proceso...'
                              : isCompleted
                              ? 'Completado'
                              : 'Por hacer'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-black text-charcoal">
                  Detalles del Pedido
                </h3>

                <div className="bg-canvas border-2 border-accent/20 rounded-2xl overflow-hidden">
                  <div className="space-y-0">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center p-4 ${
                          index !== order.items.length - 1 ? 'border-b border-accent/10' : ''
                        }`}
                      >
                        <div>
                          <p className="font-sans font-semibold text-charcoal">
                            {item.name}
                          </p>
                          <p className="font-sans text-sm text-charcoal-light">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-card-bg p-4 border-t-2 border-accent/10 flex justify-between items-center">
                    <p className="font-sans font-bold text-charcoal">
                      Total:
                    </p>
                    <p className="font-serif text-2xl font-black text-primary">
                      S/. {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <button
                  onClick={resetSearch}
                  className="inline-flex items-center space-x-2 font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark px-8 py-4 rounded-2xl transition-smooth hover:scale-105 active:scale-97 shadow-lg"
                >
                  <span>Rastrear Otro Pedido</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* Info Section */}
      {!searched && (
        <section className="py-24 md:py-32 bg-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-black text-charcoal leading-[1.1]">
                ¿Cómo funciona?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  num: '1',
                  title: 'Realiza tu Pedido',
                  description: 'Ordena desde nuestro menú online o contacta por WhatsApp',
                },
                {
                  num: '2',
                  title: 'Recibe tu Número',
                  description: 'Te damos un código de seguimiento para tu pedido',
                },
                {
                  num: '3',
                  title: 'Rastrear Aquí',
                  description: 'Ingresa el código y sigue el estado en tiempo real',
                },
              ].map((item) => (
                <div key={item.num} className="bg-card-bg border-2 border-accent/15 rounded-2xl p-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-serif text-xl font-black mx-auto">
                    {item.num}
                  </div>
                  <h3 className="font-serif text-xl font-black text-charcoal">
                    {item.title}
                  </h3>
                  <p className="font-sans text-base text-charcoal-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FooterV2 />
    </div>
  );
}
