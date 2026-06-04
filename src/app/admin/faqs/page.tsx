'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2 } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  order: number;
}

export default function FAQsAdminPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/admin/faqs');
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setNotification({ type: 'error', message: 'Error al cargar FAQs' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/admin/faqs/${editingId}`
        : '/api/admin/faqs';

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error || 'Error al guardar');
      }

      setNotification({
        type: 'success',
        message: editingId ? 'FAQ actualizada' : 'FAQ agregada',
      });

      resetForm();
      fetchFAQs();
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error saving FAQ:', error);
      setNotification({ type: 'error', message: 'Error al guardar' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta FAQ?')) return;

    try {
      const response = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      setNotification({ type: 'success', message: 'FAQ eliminada' });
      fetchFAQs();
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setNotification({ type: 'error', message: 'Error al eliminar' });
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      question: '',
      answer: '',
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
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">❓ Gestionar FAQs</h1>

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
            {editingId ? '✏️ Editar FAQ' : '➕ Nueva FAQ'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                Pregunta
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="ej: ¿Cuánto tiempo tarda mi pedido?"
                className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-sans text-sm font-bold text-charcoal mb-2">
                Respuesta
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Escribe la respuesta aquí..."
                rows={4}
                className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none resize-none"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark py-3 px-6 rounded-xl transition-smooth"
              >
                {editingId ? 'Actualizar' : 'Agregar'} FAQ
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

        {/* FAQs List */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-charcoal mb-4">FAQs Actuales</h2>
          {faqs.length === 0 ? (
            <p className="text-charcoal-light">No hay FAQs aún</p>
          ) : (
            faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-accent/15 rounded-xl p-6 bg-card-bg hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-charcoal mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-charcoal-light text-sm mb-2">{faq.answer}</p>
                    <p className="text-xs text-charcoal-light">Orden: {faq.order}</p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="p-3 hover:bg-primary/20 text-primary rounded-lg transition"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-3 hover:bg-red-100 text-red-600 rounded-lg transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
