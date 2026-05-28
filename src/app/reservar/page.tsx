'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CartDrawer } from '@/components/public/CartDrawer';
import { useCart } from '@/context/CartContext';
import { mockDB, Branch } from '@/lib/mockData';
import { Calendar, User, Phone, MapPin, Clock, Users, FileText, ShoppingBag, CheckCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function ReservarPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [branches, setBranches] = useState<Branch[]>([]);
  
  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [peopleCount, setPeopleCount] = useState(2);
  const [notes, setNotes] = useState('');

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [createdOrderDetails, setCreatedOrderDetails] = useState<any>(null);

  useEffect(() => {
    const activeBranches = mockDB.getBranches().filter(b => b.isActive);
    setBranches(activeBranches);
    if (activeBranches.length > 0) {
      setSelectedBranchId(activeBranches[0].id);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time || !selectedBranchId) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setIsSubmitting(true);

    // Simulate database write
    setTimeout(() => {
      const selectedBranch = branches.find(b => b.id === selectedBranchId) || branches[0];
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      const orderItems = cart.map(item => ({
        dishId: item.dish.id,
        dishName: item.dish.name,
        quantity: item.quantity,
        price: item.dish.price
      }));

      const newOrder = {
        id: orderId,
        customerName: name,
        customerPhone: phone,
        branchId: selectedBranchId,
        branchName: selectedBranch.name,
        eventDate: date,
        eventTime: time,
        peopleCount: peopleCount,
        status: 'PENDIENTE' as const,
        notes: notes,
        createdAt: new Date().toISOString(),
        items: orderItems,
        total: cartTotal
      };

      // Save to mock database
      mockDB.saveOrder(newOrder);

      // Construct WhatsApp message
      const cleanedBranchPhone = selectedBranch.phone.replace(/\D/g, '');
      const formattedDate = date.split('-').reverse().join('/');
      
      let dishDetailsText = '';
      if (cart.length > 0) {
        dishDetailsText = cart.map(item => `%0A• *${item.quantity}x* ${item.dish.name}`).join('');
      } else {
        dishDetailsText = ' Ninguno (Solo mesa)';
      }

      const messageText = `Hola *${selectedBranch.name}*, quiero confirmar mi reserva.%0A%0A*Código:* ${orderId}%0A*Cliente:* ${name}%0A*Teléfono:* ${phone}%0A*Fecha:* ${formattedDate}%0A*Hora:* ${time}%0A*Personas:* ${peopleCount}%0A*Platos Seleccionados:*${dishDetailsText}%0A${notes ? `*Comentarios:* ${notes}%0A` : ''}%0A*Total Estimado:* S/. ${cartTotal.toFixed(2)}`;
      
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanedBranchPhone}&text=${messageText}`;

      setWhatsappLink(waUrl);
      setCreatedOrderDetails(newOrder);
      setIsSuccess(true);
      setIsSubmitting(false);
      
      // Clear global cart state after success
      clearCart();
    }, 800);
  };

  if (isSuccess && createdOrderDetails) {
    return (
      <div className="flex-1 flex flex-col bg-canvas min-h-screen">
        <Header />
        
        <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
          <div className="bg-card-bg border border-accent/15 rounded-[40px] p-8 md:p-10 shadow-xl text-center space-y-6 animate-scale-in">
            
            <div className="mx-auto h-16 w-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center border border-[#25D366]/20">
              <CheckCircle className="h-9 w-9 stroke-[1.8]" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl md:text-3xl font-black text-charcoal">
                ¡Reserva Registrada!
              </h2>
              <p className="font-sans text-xs text-charcoal-light leading-relaxed max-w-sm mx-auto">
                Tu solicitud ha sido guardada en nuestro sistema con el código <span className="font-bold text-primary">{createdOrderDetails.id}</span>.
              </p>
            </div>

            {/* Recipient branch detail */}
            <div className="bg-canvas rounded-2xl p-4 text-left font-sans text-xs text-charcoal-light space-y-3 border border-accent/10">
              <div className="flex justify-between border-b border-accent/5 pb-2">
                <span className="font-semibold text-charcoal">Cliente:</span>
                <span>{createdOrderDetails.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-accent/5 pb-2">
                <span className="font-semibold text-charcoal">Sede:</span>
                <span>{createdOrderDetails.branchName}</span>
              </div>
              <div className="flex justify-between border-b border-accent/5 pb-2">
                <span className="font-semibold text-charcoal">Fecha y Hora:</span>
                <span>{createdOrderDetails.eventDate.split('-').reverse().join('/')} - {createdOrderDetails.eventTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-charcoal">Personas:</span>
                <span>{createdOrderDetails.peopleCount} personas</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full font-sans text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba56] py-4.5 px-6 rounded-2xl shadow-md transition-smooth hover:scale-102 active:scale-98 flex items-center justify-center space-x-2.5"
              >
                <MessageSquare className="h-5 w-5 shrink-0" />
                <span>Confirmar por WhatsApp</span>
              </a>

              <Link
                href="/menu"
                className="block text-center font-sans text-xs font-semibold text-primary hover:underline"
              >
                Volver a la Carta
              </Link>
            </div>

            <p className="font-sans text-[10px] text-charcoal-light/70 leading-relaxed max-w-xs mx-auto">
              * Para finalizar tu reserva de forma segura, haz clic en el botón superior. Esto enviará los detalles de tu mesa y platos directamente al WhatsApp de la sede seleccionada.
            </p>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-canvas min-h-screen">
      <Header />
      <CartDrawer />

      {/* Hero Banner Header */}
      <section className="bg-card-bg border-b border-accent/10 py-12 md:py-16 text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center space-x-1.5 bg-primary/5 border border-accent/15 px-3 py-1 rounded-full text-primary font-sans text-xs font-semibold uppercase tracking-wider">
            <Calendar className="h-4 w-4 text-accent" />
            <span>Mesa Reservada, Dulzura Garantizada</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight">
            Reserva tu Mesa & Pedido
          </h1>
          <p className="font-sans text-xs sm:text-sm text-charcoal-light max-w-lg mx-auto leading-relaxed">
            Completa tus datos y selecciona tu local favorito. Si añadiste postres a tu bolsa de pedidos, los prepararemos con anticipación para tu visita.
          </p>
        </div>
      </section>

      {/* Checkout layout splits */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Interactive Form */}
          <section className="lg:col-span-7 bg-card-bg border border-accent/15 rounded-[32px] p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-charcoal mb-6 border-b border-accent/10 pb-4">
              Datos de tu Reserva
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name input */}
              <div className="space-y-2">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 font-sans text-sm text-charcoal bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none placeholder-charcoal-light/50"
                  />
                </div>
              </div>

              {/* Phone input */}
              <div className="space-y-2">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Teléfono / Celular de contacto *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +51 987 654 321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 font-sans text-sm text-charcoal bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none placeholder-charcoal-light/50"
                  />
                </div>
              </div>

              {/* Sede Dropdown selection */}
              <div className="space-y-2">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Elige tu Sede de Preferencia *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 font-sans text-sm text-charcoal bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} - {b.address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Event Date & Time details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                    Fecha de Reserva *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 font-sans text-sm text-charcoal bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                    Hora de Reserva *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
                      <Clock className="h-4 w-4" />
                    </span>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 font-sans text-sm text-charcoal bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal"
                    />
                  </div>
                </div>

              </div>

              {/* People Count input */}
              <div className="space-y-2">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Número de Personas *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
                    <Users className="h-4 w-4" />
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    max={20}
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                    className="block w-full pl-11 pr-4 py-3 font-sans text-sm text-charcoal bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal"
                  />
                </div>
              </div>

              {/* Notes details */}
              <div className="space-y-2">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Comentarios / Indicaciones Especiales
                </label>
                <div className="relative">
                  <span className="absolute top-3.5 left-3.5 flex items-center pointer-events-none text-charcoal-light">
                    <FileText className="h-4 w-4" />
                  </span>
                  <textarea
                    rows={4}
                    placeholder="Ej. Mesa en terraza, silla para bebé, intolerancias alimenticias..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 font-sans text-sm text-charcoal bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none placeholder-charcoal-light/50 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark py-4 px-6 rounded-2xl shadow-md transition-smooth hover:scale-102 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Registrando...' : 'Confirmar Reserva de Mesa'}</span>
              </button>

            </form>
          </section>

          {/* Right Column: Order Review Sidebar */}
          <aside className="lg:col-span-5 space-y-6">
            {/* Delivery/Pickup Details Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-[24px] p-5 space-y-4">
              <h3 className="font-serif text-sm font-bold text-primary uppercase tracking-wider">
                📅 Detalles de Recojo/Entrega
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                <div className="bg-white/60 rounded-lg p-3 text-center border border-primary/10">
                  <p className="text-charcoal-light text-[10px] uppercase tracking-wider font-semibold mb-1">Fecha</p>
                  <p className="text-charcoal font-bold">
                    {date ? new Date(date).toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: '2-digit' }) : '—'}
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center border border-primary/10">
                  <p className="text-charcoal-light text-[10px] uppercase tracking-wider font-semibold mb-1">Hora</p>
                  <p className="text-charcoal font-bold">
                    {time || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-card-bg border border-accent/15 rounded-[32px] p-6 shadow-sm space-y-6">

              <div className="flex items-center space-x-2.5 border-b border-accent/10 pb-4">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-lg font-bold text-charcoal">
                  Bolsa de Pedidos
                </h2>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-6 font-sans text-xs text-charcoal-light space-y-2">
                  <p>No has agregado postres o salados a tu reserva.</p>
                  <Link href="/menu" className="block text-primary hover:underline font-semibold">
                    Ir a la Carta Digital
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.dish.id} className="flex justify-between items-start text-xs font-sans text-charcoal-light bg-canvas/40 rounded-lg p-3 border border-accent/5">
                      <div className="flex-1">
                        <span className="line-clamp-1 pr-2 font-semibold text-charcoal text-sm">
                          {item.quantity}x {item.dish.name}
                        </span>
                        <p className="text-[10px] text-charcoal-light/70 mt-0.5">
                          S/. {item.dish.price.toFixed(2)} c/u
                        </p>
                      </div>
                      <span className="shrink-0 text-primary font-bold text-sm">
                        S/. {(item.dish.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Total calculations */}
              <div className="border-t border-accent/10 pt-4 space-y-3 font-sans text-xs">
                <div className="flex justify-between items-center text-charcoal-light">
                  <span>Platos seleccionados:</span>
                  <span>S/. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-charcoal-light">
                  <span>Reserva de mesa:</span>
                  <span className="text-[#25D366] font-bold uppercase tracking-wider">Gratis</span>
                </div>
                <div className="flex justify-between items-center text-charcoal text-sm font-serif font-extrabold border-t border-accent/5 pt-3">
                  <span>Total Estimado:</span>
                  <span className="text-primary text-base">S/. {cartTotal.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}
