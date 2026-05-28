'use client';

import React, { useState, useEffect } from 'react';
import { mockDB, Order } from '@/lib/mockData';
import { ShoppingBag, BookOpen, MapPin, DollarSign, Clock, Check, RefreshCw, Eye } from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishesCount, setDishesCount] = useState(0);
  const [branchesCount, setBranchesCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load dynamic figures
    const fetchedOrders = mockDB.getOrders();
    const fetchedDishes = mockDB.getDishes();
    const fetchedBranches = mockDB.getBranches();

    setOrders(fetchedOrders);
    setDishesCount(fetchedDishes.length);
    setBranchesCount(fetchedBranches.length);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    mockDB.updateOrderStatus(orderId, newStatus);
    // Reload local orders list state
    setOrders(mockDB.getOrders());
    // Also update selected order detail modal if open
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedOrder = mockDB.getOrders().find(o => o.id === orderId);
      if (updatedOrder) setSelectedOrder(updatedOrder);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDIENTE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONFIRMADO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'EN_PREPARACION':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'ENTREGADO':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELADO':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Billing statistics calculations
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'CANCELADO' ? o.total : 0), 0);
  const activeOrdersCount = orders.filter(o => o.status === 'PENDIENTE' || o.status === 'CONFIRMADO' || o.status === 'EN_PREPARACION').length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-black text-charcoal">Resumen de Operación</h1>
        <p className="font-sans text-xs text-charcoal-light mt-1">Supervisa y gestiona los pedidos, estados de entrega e indicadores clave de tu restaurante.</p>
      </div>

      {/* 1. Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Orders Card */}
        <div className="bg-card-bg border border-accent/15 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
          <div className="h-12 w-12 bg-primary/5 text-primary border border-accent/15 rounded-2xl flex items-center justify-center shrink-0">
            <ShoppingBag className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div>
            <span className="block font-sans text-[10px] uppercase tracking-wider text-charcoal-light font-semibold">Total Pedidos</span>
            <span className="block font-serif text-2xl font-black text-charcoal mt-0.5">{orders.length}</span>
            <span className="block font-sans text-[9px] text-accent mt-0.5 font-bold uppercase">{activeOrdersCount} activos</span>
          </div>
        </div>

        {/* Estimated Sales Card */}
        <div className="bg-card-bg border border-accent/15 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
          <div className="h-12 w-12 bg-primary/5 text-primary border border-accent/15 rounded-2xl flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5 stroke-[1.8] text-accent" />
          </div>
          <div>
            <span className="block font-sans text-[10px] uppercase tracking-wider text-charcoal-light font-semibold">Ventas Estimadas</span>
            <span className="block font-serif text-2xl font-black text-primary mt-0.5">S/. {totalSales.toFixed(2)}</span>
            <span className="block font-sans text-[9px] text-charcoal-light mt-0.5">Excluye cancelados</span>
          </div>
        </div>

        {/* Total Dishes Card */}
        <div className="bg-card-bg border border-accent/15 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
          <div className="h-12 w-12 bg-primary/5 text-primary border border-accent/15 rounded-2xl flex items-center justify-center shrink-0">
            <BookOpen className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div>
            <span className="block font-sans text-[10px] uppercase tracking-wider text-charcoal-light font-semibold">Platos en Carta</span>
            <span className="block font-serif text-2xl font-black text-charcoal mt-0.5">{dishesCount}</span>
            <span className="block font-sans text-[9px] text-charcoal-light mt-0.5">Visibles al cliente</span>
          </div>
        </div>

        {/* Total Branches Card */}
        <div className="bg-card-bg border border-accent/15 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
          <div className="h-12 w-12 bg-primary/5 text-primary border border-accent/15 rounded-2xl flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div>
            <span className="block font-sans text-[10px] uppercase tracking-wider text-charcoal-light font-semibold">Sedes Habilitadas</span>
            <span className="block font-serif text-2xl font-black text-charcoal mt-0.5">{branchesCount}</span>
            <span className="block font-sans text-[9px] text-[#25D366] mt-0.5 font-bold uppercase">100% activas</span>
          </div>
        </div>

      </section>

      {/* 2. Orders Control Section */}
      <section className="bg-card-bg border border-accent/15 rounded-[32px] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-accent/10 pb-4">
          <h2 className="font-serif text-lg font-bold text-charcoal">
            Pedidos & Reservas Recientes
          </h2>
          <button
            onClick={() => setOrders(mockDB.getOrders())}
            className="p-2 text-charcoal-light hover:text-primary rounded-xl hover:bg-canvas transition-colors"
            title="Recargar listado"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-accent/10 text-charcoal uppercase tracking-wider font-bold">
                <th className="py-4 px-4">Código</th>
                <th className="py-4 px-4">Cliente</th>
                <th className="py-4 px-4">Sede</th>
                <th className="py-4 px-4">Fecha y Hora</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/5 text-charcoal-light">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">No se han registrado pedidos en el sistema.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-canvas/30 transition-colors">
                    <td className="py-4 px-4 font-bold text-primary">{o.id}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-charcoal">{o.customerName}</div>
                      <div className="text-[10px]">{o.customerPhone}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-charcoal">{o.branchName}</td>
                    <td className="py-4 px-4">
                      <div>{o.eventDate.split('-').reverse().join('/')}</div>
                      <div className="text-[10px]">{o.eventTime}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-charcoal">S/. {o.total.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block border px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[9px] ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Selector for status updates */}
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as Order['status'])}
                          className="bg-canvas border border-accent/20 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-primary font-sans text-[10px] font-bold text-charcoal"
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="CONFIRMADO">CONFIRMADO</option>
                          <option value="EN_PREPARACION">EN COCINA</option>
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 hover:bg-primary/5 hover:text-primary rounded-lg text-charcoal-light transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Detailed Modal Drawer Popup */}
      {selectedOrder && (
        <>
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs z-50 transition-opacity"
          />
          <section className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-canvas border-l border-accent/15 p-6 shadow-2xl overflow-y-auto animate-slide-left space-y-6">
            
            <div className="flex justify-between items-center border-b border-accent/10 pb-4 bg-card-bg -m-6 p-6 mb-0">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h3 className="font-serif text-lg font-bold text-charcoal">Detalle del Pedido</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-charcoal-light hover:text-primary rounded-full hover:bg-canvas"
              >
                ✕
              </button>
            </div>

            {/* Order Identity info */}
            <div className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-4 bg-card-bg rounded-2xl p-4 border border-accent/10">
                <div>
                  <span className="block text-charcoal-light text-[10px] uppercase font-bold tracking-wider">Código</span>
                  <span className="block font-serif text-lg font-black text-primary mt-0.5">{selectedOrder.id}</span>
                </div>
                <div>
                  <span className="block text-charcoal-light text-[10px] uppercase font-bold tracking-wider">Estado</span>
                  <span className={`inline-block border px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[9px] mt-1 ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-3 bg-card-bg rounded-2xl p-4 border border-accent/10">
                <h4 className="font-serif font-bold text-charcoal text-sm border-b border-accent/5 pb-2">Información del Cliente</h4>
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Nombre:</span>
                  <span className="text-charcoal-light">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Teléfono:</span>
                  <span className="text-charcoal-light">{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Sede preferida:</span>
                  <span className="text-charcoal-light">{selectedOrder.branchName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Fecha y Hora:</span>
                  <span className="text-charcoal-light">{selectedOrder.eventDate.split('-').reverse().join('/')} - {selectedOrder.eventTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Nro Personas:</span>
                  <span className="text-charcoal-light">{selectedOrder.peopleCount} personas</span>
                </div>
                {selectedOrder.notes && (
                  <div className="border-t border-accent/5 pt-2 mt-2">
                    <span className="block font-semibold text-charcoal mb-1">Notas especiales:</span>
                    <span className="block text-charcoal-light bg-canvas p-2.5 rounded-xl border border-accent/5 leading-relaxed">{selectedOrder.notes}</span>
                  </div>
                )}
              </div>

              {/* Selected Dishes detail */}
              <div className="space-y-3 bg-card-bg rounded-2xl p-4 border border-accent/10">
                <h4 className="font-serif font-bold text-charcoal text-sm border-b border-accent/5 pb-2">Platos Solicitados</h4>
                {selectedOrder.items.length === 0 ? (
                  <div className="text-center text-charcoal-light py-2">Solo reserva de mesa (Sin platos).</div>
                ) : (
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.dishId} className="flex justify-between items-center text-charcoal-light">
                        <span className="font-semibold text-charcoal">{item.quantity}x {item.dishName}</span>
                        <span className="text-primary font-bold">S/. {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-accent/10 pt-3 flex justify-between items-center text-charcoal font-serif font-extrabold text-sm">
                      <span>Total Estimado:</span>
                      <span className="text-primary text-base">S/. {selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons to control status in modal */}
              <div className="bg-card-bg rounded-2xl p-4 border border-accent/10 space-y-3">
                <h4 className="font-serif font-bold text-charcoal text-sm border-b border-accent/5 pb-2">Acción Rápida de Estado</h4>
                <div className="grid grid-cols-2 gap-2 font-sans text-[10px]">
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'CONFIRMADO')}
                    className="p-2 border border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50 rounded-xl font-bold uppercase transition-colors"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'EN_PREPARACION')}
                    className="p-2 border border-orange-200 text-orange-700 bg-orange-50/50 hover:bg-orange-50 rounded-xl font-bold uppercase transition-colors"
                  >
                    En Cocina
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'ENTREGADO')}
                    className="p-2 border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl font-bold uppercase transition-colors"
                  >
                    Entregar
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'CANCELADO')}
                    className="p-2 border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-50 rounded-xl font-bold uppercase transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>

            </div>

          </section>
        </>
      )}

    </div>
  );
}
