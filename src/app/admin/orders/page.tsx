'use client';

import React, { useState, useEffect } from 'react';
import { Eye, AlertCircle, X } from 'lucide-react';

interface OrderItem {
  id: string;
  dishName: string;
  quantity: number;
  price: string | number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  branch: { id: string; name: string };
  eventDate: string;
  eventTime: string;
  peopleCount: number;
  status: 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'ENTREGADO' | 'CANCELADO';
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

interface Branch {
  id: string;
  name: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  PENDIENTE: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pendiente' },
  CONFIRMADO: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Confirmado' },
  EN_PREPARACION: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'En Prep.' },
  ENTREGADO: { bg: 'bg-green-50', text: 'text-green-700', label: 'Entregado' },
  CANCELADO: { bg: 'bg-red-50', text: 'text-red-700', label: 'Cancelado' },
};

const STATUS_SEQUENCE: Record<string, string[]> = {
  PENDIENTE: ['CONFIRMADO', 'CANCELADO'],
  CONFIRMADO: ['EN_PREPARACION', 'CANCELADO'],
  EN_PREPARACION: ['ENTREGADO', 'CANCELADO'],
  ENTREGADO: [],
  CANCELADO: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currencySymbol, setCurrencySymbol] = useState('S/');

  // Filters
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  // Status update state
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch branches
        const branchesRes = await fetch('/api/admin/branches');
        if (branchesRes.ok) {
          const branchesData = await branchesRes.json();
          setBranches(branchesData);
        }

        // Fetch config for currency
        const configRes = await fetch('/api/public/settings');
        if (configRes.ok) {
          const config = await configRes.json();
          setCurrencySymbol(config.currencySymbol || 'S/');
        }

        // Fetch orders
        await fetchOrders();
        setError(null);
      } catch (err) {
        setError('Error al cargar datos');
        console.error('Fetch data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchOrders = async (branch?: string, status?: string, date?: string) => {
    try {
      const params = new URLSearchParams();
      if (branch && branch !== 'all') params.append('branchId', branch);
      if (status && status !== 'all') params.append('status', status);
      if (date) params.append('date', date);

      const response = await fetch(`/api/admin/orders?${params}`);
      if (!response.ok) throw new Error('Error fetching orders');

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Fetch orders error:', err);
    }
  };

  const handleFilterChange = async (type: 'branch' | 'status' | 'date', value: string) => {
    if (type === 'branch') setFilterBranch(value);
    if (type === 'status') setFilterStatus(value);
    if (type === 'date') setFilterDate(value);

    const branch = type === 'branch' ? value : filterBranch;
    const status = type === 'status' ? value : filterStatus;
    const date = type === 'date' ? value : filterDate;

    await fetchOrders(branch, status, date);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrder) return;

    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Error updating order');

      const updatedOrder = await response.json();
      setOrders(prev => prev.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
      setSelectedOrder(updatedOrder);
    } catch (err) {
      alert('Error al actualizar el estado del pedido');
      console.error('Status update error:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const calculateTotal = (items: OrderItem[]): number => {
    return items.reduce((sum, item) => sum + (parseFloat(String(item.price)) * item.quantity), 0);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string): string => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-black text-charcoal">Gestión de Pedidos</h1>
        <p className="font-sans text-xs text-charcoal-light mt-1">Visualiza, filtra y actualiza el estado de los pedidos realizados por los clientes.</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="font-sans text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card-bg border border-accent/15 rounded-2xl p-4 shadow-sm">

        {/* Branch filter */}
        <select
          value={filterBranch}
          onChange={(e) => handleFilterChange('branch', e.target.value)}
          className="block w-full px-4 py-2.5 font-sans text-xs text-charcoal bg-canvas border border-accent/10 rounded-xl focus:border-primary focus:outline-none"
        >
          <option value="all">Todas las Sedes</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="block w-full px-4 py-2.5 font-sans text-xs text-charcoal bg-canvas border border-accent/10 rounded-xl focus:border-primary focus:outline-none"
        >
          <option value="all">Todos los Estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="EN_PREPARACION">En Preparación</option>
          <option value="ENTREGADO">Entregado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>

        {/* Date filter */}
        <input
          type="date"
          value={filterDate}
          onChange={(e) => handleFilterChange('date', e.target.value)}
          className="block w-full px-4 py-2.5 font-sans text-xs text-charcoal bg-canvas border border-accent/10 rounded-xl focus:border-primary focus:outline-none"
        />
      </div>

      {/* Orders Table */}
      <section className="bg-card-bg border border-accent/15 rounded-[32px] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-accent/10 text-charcoal uppercase tracking-wider font-bold">
                <th className="py-4 px-4">Código</th>
                <th className="py-4 px-4">Cliente</th>
                <th className="py-4 px-4">Sede</th>
                <th className="py-4 px-4">Fecha / Hora</th>
                <th className="py-4 px-4 text-center">Personas</th>
                <th className="py-4 px-4 text-center">Estado</th>
                <th className="py-4 px-4 text-right">Total</th>
                <th className="py-4 px-4 text-center">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/5 text-charcoal-light">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10">No se encontraron pedidos que coincidan con los filtros.</td>
                </tr>
              ) : (
                orders.map(order => {
                  const total = calculateTotal(order.items);
                  const statusInfo = STATUS_COLORS[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-canvas/30 transition-colors">
                      <td className="py-4 px-4 font-bold text-charcoal">{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-charcoal">{order.customerName}</div>
                        <div className="text-[10px] text-charcoal-light">{order.customerPhone}</div>
                      </td>
                      <td className="py-4 px-4 text-charcoal">{order.branch.name}</td>
                      <td className="py-4 px-4 text-charcoal">
                        <div>{formatDate(order.eventDate)}</div>
                        <div className="text-[10px] text-charcoal-light">{formatTime(order.eventTime)}</div>
                      </td>
                      <td className="py-4 px-4 text-center font-semibold text-charcoal">{order.peopleCount}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase ${statusInfo.bg} ${statusInfo.text}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-charcoal">{currencySymbol} {total.toFixed(2)}</td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-charcoal-light hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                          title="Ver Detalles"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail Side Panel */}
      {selectedOrder && (
        <>
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs z-50 transition-opacity"
          />
          <section className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-canvas border-l border-accent/15 p-6 shadow-2xl overflow-y-auto animate-slide-left space-y-6">

            <div className="flex justify-between items-center border-b border-accent/10 pb-4 bg-card-bg -m-6 p-6 mb-0">
              <h3 className="font-serif text-lg font-bold text-charcoal">Detalles del Pedido</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-charcoal-light hover:text-primary rounded-full hover:bg-canvas"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 font-sans text-xs">

              {/* Order code */}
              <div className="bg-card-bg rounded-xl p-4">
                <div className="text-charcoal-light uppercase tracking-wider font-bold mb-1">Código de Pedido</div>
                <div className="font-serif text-lg font-black text-charcoal">{selectedOrder.id.slice(0, 8).toUpperCase()}</div>
              </div>

              {/* Customer info */}
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-charcoal border-b border-accent/10 pb-2">Datos del Cliente</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-charcoal-light uppercase font-bold text-[9px] mb-1">Nombre</div>
                    <div className="text-charcoal font-semibold">{selectedOrder.customerName}</div>
                  </div>
                  <div>
                    <div className="text-charcoal-light uppercase font-bold text-[9px] mb-1">Teléfono</div>
                    <div className="text-charcoal font-semibold">{selectedOrder.customerPhone}</div>
                  </div>
                </div>
              </div>

              {/* Event info */}
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-charcoal border-b border-accent/10 pb-2">Evento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-charcoal-light uppercase font-bold text-[9px] mb-1">Fecha</div>
                    <div className="text-charcoal font-semibold">{formatDate(selectedOrder.eventDate)}</div>
                  </div>
                  <div>
                    <div className="text-charcoal-light uppercase font-bold text-[9px] mb-1">Hora</div>
                    <div className="text-charcoal font-semibold">{formatTime(selectedOrder.eventTime)}</div>
                  </div>
                  <div>
                    <div className="text-charcoal-light uppercase font-bold text-[9px] mb-1">Personas</div>
                    <div className="text-charcoal font-semibold">{selectedOrder.peopleCount}</div>
                  </div>
                  <div>
                    <div className="text-charcoal-light uppercase font-bold text-[9px] mb-1">Sede</div>
                    <div className="text-charcoal font-semibold">{selectedOrder.branch.name}</div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-charcoal border-b border-accent/10 pb-2">Artículos</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between items-start bg-canvas p-3 rounded-lg">
                      <div>
                        <div className="font-semibold text-charcoal">{item.dishName}</div>
                        <div className="text-[10px] text-charcoal-light">Cantidad: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-charcoal">{currencySymbol} {(parseFloat(String(item.price)) * item.quantity).toFixed(2)}</div>
                        <div className="text-[10px] text-charcoal-light">@ {currencySymbol} {parseFloat(String(item.price)).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="text-charcoal-light uppercase font-bold text-[9px] mb-2">Total Estimado</div>
                <div className="font-serif text-3xl font-black text-charcoal">
                  {currencySymbol} {calculateTotal(selectedOrder.items).toFixed(2)}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="space-y-2">
                  <h4 className="font-bold uppercase tracking-wider text-charcoal">Notas</h4>
                  <div className="bg-canvas p-3 rounded-lg text-charcoal text-[12px] leading-relaxed whitespace-pre-wrap break-words">
                    {selectedOrder.notes}
                  </div>
                </div>
              )}

              {/* Status management */}
              <div className="space-y-3 border-t border-accent/10 pt-6">
                <h4 className="font-bold uppercase tracking-wider text-charcoal">Cambiar Estado</h4>
                <div className="text-charcoal-light text-[11px] mb-3">
                  Estado actual: <span className="font-bold text-charcoal">{STATUS_COLORS[selectedOrder.status].label}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {STATUS_SEQUENCE[selectedOrder.status].map(nextStatus => (
                    <button
                      key={nextStatus}
                      onClick={() => handleStatusUpdate(nextStatus)}
                      disabled={updatingStatus}
                      className={`py-3 px-4 rounded-xl font-bold text-white text-[12px] transition-smooth disabled:opacity-50 ${
                        nextStatus === 'CANCELADO'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-primary hover:bg-primary-dark'
                      }`}
                    >
                      {updatingStatus ? 'Actualizando...' : `Marcar como ${STATUS_COLORS[nextStatus].label}`}
                    </button>
                  ))}
                  {STATUS_SEQUENCE[selectedOrder.status].length === 0 && (
                    <div className="text-center text-charcoal-light text-[11px] py-4">
                      No hay cambios de estado disponibles para este pedido.
                    </div>
                  )}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 px-4 border border-accent/20 rounded-xl font-bold text-charcoal hover:bg-accent/5 transition-smooth"
              >
                Cerrar
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
