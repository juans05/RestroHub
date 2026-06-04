'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, Heart, Clock, ShoppingBag } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  isHighlighted: boolean;
  isActive: boolean;
  order: number;
}

const ICON_OPTIONS = [
  { value: 'heart', label: '❤️ Corazón', icon: Heart },
  { value: 'clock', label: '⏰ Reloj', icon: Clock },
  { value: 'shopping-bag', label: '🛍️ Bolsa', icon: ShoppingBag },
];

export default function FeaturesAdminPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'heart',
    isHighlighted: false,
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/admin/features');
      if (response.ok) {
        const data = await response.json();
        setFeatures(data);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      setNotification({ type: 'error', message: 'Error al cargar características' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/admin/features/${editingId}`
        : '/api/admin/features';

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
        message: editingId ? 'Característica actualizada' : 'Característica agregada',
      });

      resetForm();
      fetchFeatures();
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error saving feature:', error);
      setNotification({ type: 'error', message: 'Error al guardar' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta característica?')) return;

    try {
      const response = await fetch(`/api/admin/features/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      setNotification({ type: 'success', message: 'Característica eliminada' });
      fetchFeatures();
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error deleting feature:', error);
      setNotification({ type: 'error', message: 'Error al eliminar' });
    }
  };

  const handleEdit = (feature: Feature) => {
    setEditingId(feature.id);
    setFormData({
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      isHighlighted: feature.isHighlighted,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      icon: 'heart',
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
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">✨ Gestionar Características</h1>

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
            {editingId ? '✏️ Editar Característica' : '➕ Nueva Característica'}
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
                  placeholder="ej: Ingredientes Premium"
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
                placeholder="Describe esta característica..."
                rows={3}
                className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none resize-none"
                required
              />
            </div>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isHighlighted}
                onChange={(e) => setFormData({ ...formData, isHighlighted: e.target.checked })}
                className="w-5 h-5 text-primary cursor-pointer rounded"
              />
              <span className="font-sans text-sm font-bold text-charcoal">
                🎨 Destacar (tarjeta grande naranja)
              </span>
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark py-3 px-6 rounded-xl transition-smooth"
              >
                {editingId ? 'Actualizar' : 'Agregar'} Característica
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

        {/* Features List */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-charcoal mb-4">Características Actuales</h2>
          {features.length === 0 ? (
            <p className="text-charcoal-light">No hay características aún</p>
          ) : (
            features.map((feature) => (
              <div
                key={feature.id}
                className={`border rounded-xl p-6 flex items-start justify-between ${
                  feature.isHighlighted
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card-bg border-accent/15'
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-charcoal mb-2">
                    {feature.isHighlighted && '🎨 '}
                    {feature.title}
                  </h3>
                  <p className="text-charcoal-light text-sm mb-2">{feature.description}</p>
                  <p className="text-xs text-charcoal-light">Icono: {feature.icon}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(feature)}
                    className="p-3 hover:bg-primary/20 text-primary rounded-lg transition"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(feature.id)}
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
