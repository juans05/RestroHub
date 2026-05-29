'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, X, AlertCircle } from 'lucide-react';

interface Slider {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  ctaText: string | null;
  ctaHref: string | null;
  isActive: boolean;
  order: number;
}

interface FormData {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaHref: string;
  isActive: boolean;
  order: number;
}

export default function SlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    ctaText: '',
    ctaHref: '',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sliders');
      if (!response.ok) throw new Error('Error al obtener sliders');
      const data = await response.json();
      setSliders(data);
      setError('');
    } catch (err) {
      setError('Error al cargar los sliders');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      ctaText: '',
      ctaHref: '',
      isActive: true,
      order: 0,
    });
    setEditingSlider(null);
  };

  const openAddDrawer = () => {
    resetForm();
    setShowDrawer(true);
  };

  const openEditDrawer = (slider: Slider) => {
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle || '',
      description: slider.description || '',
      imageUrl: slider.imageUrl,
      ctaText: slider.ctaText || '',
      ctaHref: slider.ctaHref || '',
      isActive: slider.isActive,
      order: slider.order,
    });
    setEditingSlider(slider);
    setShowDrawer(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const url = editingSlider ? `/api/admin/sliders/${editingSlider.id}` : '/api/admin/sliders';
      const method = editingSlider ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al guardar slider');
      }

      const result = await response.json();

      if (editingSlider) {
        setSliders(sliders.map(s => (s.id === result.id ? result : s)));
      } else {
        setSliders([...sliders, result]);
      }

      setShowDrawer(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Error al guardar slider');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/sliders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar slider');

      setSliders(sliders.filter(s => s.id !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar slider');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Sliders</h1>
          <p className="text-charcoal-light mt-2">Gestiona los sliders del carousel principal</p>
        </div>
        <button
          onClick={openAddDrawer}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-smooth"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Slider</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Imagen</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Título</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Subtítulo</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Orden</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Estado</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-charcoal">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sliders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-charcoal-light">
                  No hay sliders aún. Crea uno para comenzar.
                </td>
              </tr>
            ) : (
              sliders.map(slider => (
                <tr key={slider.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={slider.imageUrl}
                      alt={slider.title}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-charcoal">{slider.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-charcoal-light">{slider.subtitle || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-charcoal">
                      {slider.order}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      slider.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {slider.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() => openEditDrawer(slider)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-primary transition-colors"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(slider.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Right Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => !submitting && setShowDrawer(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-charcoal">
                  {editingSlider ? 'Editar Slider' : 'Nuevo Slider'}
                </h2>
                <button
                  onClick={() => !submitting && setShowDrawer(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Título del slider"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="Subtítulo (opcional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descripción (opcional)"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    URL de Imagen *
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                {/* CTA Text */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Texto del Botón CTA
                  </label>
                  <input
                    type="text"
                    name="ctaText"
                    value={formData.ctaText}
                    onChange={handleInputChange}
                    placeholder="Ej: Ver Menú"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                {/* CTA Href */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    URL del Botón CTA
                  </label>
                  <input
                    type="text"
                    name="ctaHref"
                    value={formData.ctaHref}
                    onChange={handleInputChange}
                    placeholder="Ej: /menu"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Orden
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-charcoal">
                    Activo
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => !submitting && setShowDrawer(false)}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-charcoal rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg disabled:opacity-50"
                  >
                    {submitting ? 'Guardando...' : editingSlider ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-charcoal">¿Eliminar slider?</h3>
            <p className="text-charcoal-light">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-charcoal rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
