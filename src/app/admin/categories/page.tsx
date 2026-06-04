'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  colorFrom: string;
  colorTo: string;
  order: number;
  _count?: { dishes: number };
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    imageUrl: '',
    description: '',
    colorFrom: 'from-primary/40',
    colorTo: 'to-accent/40',
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setNotification({ type: 'error', message: 'Error al cargar categorías' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : '/api/admin/categories';

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
        message: editingId ? 'Categoría actualizada' : 'Categoría agregada',
      });

      resetForm();
      fetchCategories();
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error saving category:', error);
      setNotification({ type: 'error', message: 'Error al guardar' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría? Los platos asociados también se eliminarán.')) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      setNotification({ type: 'success', message: 'Categoría eliminada' });
      fetchCategories();
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error deleting category:', error);
      setNotification({ type: 'error', message: 'Error al eliminar' });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl || '',
      description: category.description || '',
      colorFrom: category.colorFrom,
      colorTo: category.colorTo,
      order: category.order,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      imageUrl: '',
      description: '',
      colorFrom: 'from-primary/40',
      colorTo: 'to-accent/40',
      order: 0,
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
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">🏷️ Gestionar Categorías</h1>

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
            {editingId ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: editingId ? formData.slug : name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    });
                  }}
                  placeholder="ej: Tortas Personalizadas"
                  className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ej: tortas-personalizadas"
                  className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe esta categoría..."
                rows={2}
                className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none resize-none"
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
                  Orden
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  min={0}
                  className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                  Color Inicial (gradiente)
                </label>
                <input
                  type="text"
                  value={formData.colorFrom}
                  onChange={(e) => setFormData({ ...formData, colorFrom: e.target.value })}
                  placeholder="from-primary/40"
                  className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                  Color Final (gradiente)
                </label>
                <input
                  type="text"
                  value={formData.colorTo}
                  onChange={(e) => setFormData({ ...formData, colorTo: e.target.value })}
                  placeholder="to-accent/40"
                  className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark py-3 px-6 rounded-xl transition-smooth"
              >
                {editingId ? 'Actualizar' : 'Agregar'} Categoría
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

        {/* Categories List */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-charcoal mb-4">Categorías Actuales</h2>
          {categories.length === 0 ? (
            <p className="text-charcoal-light">No hay categorías aún</p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-card-bg border border-accent/15 rounded-xl p-6 flex items-start justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-charcoal mb-2">
                    {category.name}
                  </h3>
                  <p className="text-charcoal-light text-sm mb-1">{category.description || 'Sin descripción'}</p>
                  <p className="text-xs text-charcoal-light">
                    Slug: {category.slug} | Platos: {category._count?.dishes || 0}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-3 hover:bg-primary/20 text-primary rounded-lg transition"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
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
