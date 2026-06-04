'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, Gift, Users, Clock } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  icon: string;
  ctaText: string | null;
  ctaHref: string | null;
  badge: string | null;
  isHighlighted: boolean;
  isActive: boolean;
  order: number;
}

const ICON_OPTIONS = [
  { value: 'gift', label: '🎁 Regalo', icon: Gift },
  { value: 'users', label: '👥 Usuarios', icon: Users },
  { value: 'clock', label: '⏰ Reloj', icon: Clock },
];

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    icon: 'gift',
    ctaText: '',
    ctaHref: '',
    badge: '',
    isHighlighted: false,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setNotification({ type: 'error', message: 'Error al cargar servicios' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/admin/services/${editingId}`
        : '/api/admin/services';

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar');
      }

      setNotification({
        type: 'success',
        message: editingId ? 'Servicio actualizado' : 'Servicio agregado',
      });

      resetForm();
      fetchServices();
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error saving service:', error);
      setNotification({ type: 'error', message: 'Error al guardar' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      setNotification({ type: 'success', message: 'Servicio eliminado' });
      fetchServices();
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error deleting service:', error);
      setNotification({ type: 'error', message: 'Error al eliminar' });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl || '',
      icon: service.icon,
      ctaText: service.ctaText || '',
      ctaHref: service.ctaHref || '',
      badge: service.badge || '',
      isHighlighted: service.isHighlighted,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      icon: 'gift',
      ctaText: '',
      ctaHref: '',
      badge: '',
      isHighlighted: false,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">🎯 Gestionar Servicios</h1>

        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Form */}
        <div className="bg-card-bg border border-accent/15 rounded-2xl p-6 mb-8">
          <h2 className="font-serif text-lg font-bold text-charcoal mb-6">
            {editingId ? '✏️ Editar Servicio' : '➕ Nuevo Servicio'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ej: Catering para Eventos"
                  className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                  Icono
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe este servicio..."
                rows={3}
                className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                  URL de Imagen
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                  Badge
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="ej: Popular"
                  className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                  Texto del CTA
                </label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="ej: Solicitar Catering"
                  className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                  URL del CTA
                </label>
                <input
                  type="text"
                  value={formData.ctaHref}
                  onChange={(e) => setFormData({ ...formData, ctaHref: e.target.value })}
                  placeholder="ej: /catering"
                  className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isHighlighted}
                onChange={(e) => setFormData({ ...formData, isHighlighted: e.target.checked })}
                className="w-5 h-5 text-primary cursor-pointer rounded"
              />
              <span className="font-sans text-sm font-bold text-charcoal">
                🎨 Destacar (tarjeta grande)
              </span>
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark py-3 px-6 rounded-xl transition-smooth"
              >
                {editingId ? 'Actualizar' : 'Agregar'} Servicio
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-charcoal/20 rounded-xl font-sans text-sm font-bold text-charcoal hover:bg-canvas"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-charcoal mb-4">Servicios Actuales</h2>
          {services.length === 0 ? (
            <p className="text-charcoal-light">No hay servicios aún</p>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className={`border rounded-xl p-6 flex items-start justify-between ${
                  service.isHighlighted
                    ? 'bg-accent/10 border-accent'
                    : 'bg-card-bg border-accent/15'
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-charcoal mb-2">
                    {service.isHighlighted && '🎨 '}
                    {service.title}
                  </h3>
                  <p className="text-charcoal-light text-sm mb-2">{service.description}</p>
                  <p className="text-xs text-charcoal-light">
                    Icono: {service.icon}
                    {service.badge && ` | Badge: ${service.badge}`}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-3 hover:bg-primary/20 text-primary rounded-lg transition"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-3 hover:bg-red-100 text-red-600 rounded-lg transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
