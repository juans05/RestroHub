'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, ToggleLeft, ToggleRight, X, AlertCircle } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  imageUrl?: string;
  mapsUrl?: string;
  isActive: boolean;
  hours: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAY_KEYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    imageUrl: '',
    mapsUrl: '',
    isActive: true,
    hours: {
      lunes: '09:00 - 22:00',
      martes: '09:00 - 22:00',
      miercoles: '09:00 - 22:00',
      jueves: '09:00 - 22:00',
      viernes: '09:00 - 22:00',
      sabado: '09:00 - 23:00',
      domingo: '10:00 - 22:00',
    },
  });

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/branches');
        if (!response.ok) throw new Error('Error fetching branches');
        const data = await response.json();
        setBranches(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las sedes');
        console.error('Fetch branches error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      imageUrl: '',
      mapsUrl: '',
      isActive: true,
      hours: {
        lunes: '09:00 - 22:00',
        martes: '09:00 - 22:00',
        miercoles: '09:00 - 22:00',
        jueves: '09:00 - 22:00',
        viernes: '09:00 - 22:00',
        sabado: '09:00 - 23:00',
        domingo: '10:00 - 22:00',
      },
    });
    setEditingBranch(null);
  };

  const openAddDrawer = () => {
    resetForm();
    setShowDrawer(true);
  };

  const openEditDrawer = (branch: Branch) => {
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      imageUrl: branch.imageUrl || '',
      mapsUrl: branch.mapsUrl || '',
      isActive: branch.isActive,
      hours: {
        lunes: branch.hours?.lunes || '09:00 - 22:00',
        martes: branch.hours?.martes || '09:00 - 22:00',
        miercoles: branch.hours?.miercoles || '09:00 - 22:00',
        jueves: branch.hours?.jueves || '09:00 - 22:00',
        viernes: branch.hours?.viernes || '09:00 - 22:00',
        sabado: branch.hours?.sabado || '09:00 - 23:00',
        domingo: branch.hours?.domingo || '10:00 - 22:00',
      },
    });
    setEditingBranch(branch);
    setShowDrawer(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHourChange = (dayKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hours: { ...prev.hours, [dayKey]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.phone) {
      alert('Por favor, completa los campos obligatorios');
      return;
    }

    try {
      setSubmitting(true);
      const url = editingBranch ? `/api/admin/branches/${editingBranch.id}` : '/api/admin/branches';
      const method = editingBranch ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al guardar sede');
      }

      const savedBranch = await response.json();

      if (editingBranch) {
        setBranches(prev => prev.map(b => (b.id === savedBranch.id ? savedBranch : b)));
      } else {
        setBranches(prev => [...prev, savedBranch]);
      }

      setShowDrawer(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar la sede');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (branch: Branch) => {
    try {
      const response = await fetch(`/api/admin/branches/${branch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...branch, isActive: !branch.isActive }),
      });

      if (!response.ok) throw new Error('Error updating branch');
      const updated = await response.json();
      setBranches(prev => prev.map(b => (b.id === updated.id ? updated : b)));
    } catch (err) {
      alert('Error al actualizar la sede');
      console.error('Toggle active error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/branches/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error deleting branch');
      setBranches(prev => prev.filter(b => b.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert('Error al eliminar la sede');
      console.error('Delete error:', err);
    }
  };

  const filteredBranches = branches.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-black text-charcoal">Gestión de Sedes</h1>
          <p className="font-sans text-xs text-charcoal-light mt-1">Administra las ubicaciones, horarios y contacto de cada sede del restaurante.</p>
        </div>
        <button
          onClick={openAddDrawer}
          className="font-sans text-xs font-bold text-white bg-primary hover:bg-primary-dark py-3 px-5 rounded-2xl shadow-sm transition-smooth hover:scale-102 active:scale-98 flex items-center space-x-1.5"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Nueva Sede</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="font-sans text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-card-bg border border-accent/15 rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o dirección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-2.5 font-sans text-xs text-charcoal bg-canvas border border-accent/10 rounded-xl focus:border-primary focus:outline-none placeholder-charcoal-light/50"
          />
        </div>
      </div>

      {/* Branches Table */}
      <section className="bg-card-bg border border-accent/15 rounded-[32px] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-accent/10 text-charcoal uppercase tracking-wider font-bold">
                <th className="py-4 px-4">Imagen</th>
                <th className="py-4 px-4">Nombre</th>
                <th className="py-4 px-4">Dirección</th>
                <th className="py-4 px-4">Teléfono</th>
                <th className="py-4 px-4 text-center">Estado</th>
                <th className="py-4 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/5 text-charcoal-light">
              {filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">No se encontraron sedes registradas.</td>
                </tr>
              ) : (
                filteredBranches.map(branch => (
                  <tr key={branch.id} className="hover:bg-canvas/30 transition-colors">
                    <td className="py-4 px-4">
                      {branch.imageUrl ? (
                        <img
                          src={branch.imageUrl}
                          alt={branch.name}
                          className="h-10 w-10 object-cover rounded-xl border border-accent/10"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-accent/20 rounded-xl border border-accent/10 flex items-center justify-center text-[9px] text-charcoal-light">
                          Sin imagen
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-serif text-sm font-bold text-charcoal">{branch.name}</div>
                    </td>
                    <td className="py-4 px-4 text-charcoal-light max-w-xs line-clamp-2">{branch.address}</td>
                    <td className="py-4 px-4 font-semibold text-charcoal">{branch.phone}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleToggleActive(branch)}
                          className="p-1 rounded-lg text-charcoal hover:bg-canvas transition-all"
                          title={branch.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {branch.isActive ? (
                            <span className="flex items-center text-primary font-bold space-x-1.5 uppercase text-[9px]">
                              <ToggleRight className="h-7 w-7" />
                              <span>Activa</span>
                            </span>
                          ) : (
                            <span className="flex items-center text-charcoal-light/50 font-bold space-x-1.5 uppercase text-[9px]">
                              <ToggleLeft className="h-7 w-7" />
                              <span>Inactiva</span>
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditDrawer(branch)}
                          className="p-2 text-charcoal-light hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                          title="Editar Sede"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(branch.id)}
                          className="p-2 text-charcoal-light hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Eliminar Sede"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          <div
            onClick={() => setDeleteConfirm(null)}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs z-50 transition-opacity"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-canvas border border-accent/15 rounded-2xl p-6 max-w-sm shadow-lg">
              <h3 className="font-serif text-lg font-bold text-charcoal mb-2">Eliminar Sede</h3>
              <p className="font-sans text-xs text-charcoal-light mb-6">¿Estás seguro de que deseas eliminar esta sede? Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 font-sans text-xs font-bold text-charcoal bg-canvas border border-accent/20 py-2.5 px-4 rounded-xl hover:bg-accent/5 transition-smooth"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                  className="flex-1 font-sans text-xs font-bold text-white bg-red-600 py-2.5 px-4 rounded-xl hover:bg-red-700 transition-smooth"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Drawer */}
      {showDrawer && (
        <>
          <div
            onClick={() => !submitting && setShowDrawer(false)}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs z-50 transition-opacity"
          />
          <section className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-canvas border-l border-accent/15 p-6 shadow-2xl overflow-y-auto animate-slide-left space-y-6">

            <div className="flex justify-between items-center border-b border-accent/10 pb-4 bg-card-bg -m-6 p-6 mb-0">
              <h3 className="font-serif text-lg font-bold text-charcoal">
                {editingBranch ? 'Editar Sede' : 'Registrar Nueva Sede'}
              </h3>
              <button
                onClick={() => !submitting && setShowDrawer(false)}
                className="p-1.5 text-charcoal-light hover:text-primary rounded-full hover:bg-canvas disabled:opacity-50"
                disabled={submitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 font-sans text-xs">

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-charcoal">Nombre de la Sede *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ej. Sede Centro"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal"
                  disabled={submitting}
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-charcoal">Dirección *</label>
                <textarea
                  name="address"
                  required
                  placeholder="Ej. Av. Principal 123, Lima"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal resize-none"
                  disabled={submitting}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-charcoal">Teléfono *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Ej. +51 999 999 999"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal"
                  disabled={submitting}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-charcoal">URL de Imagen</label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal"
                  disabled={submitting}
                />
              </div>

              {/* Maps URL */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-charcoal">URL de Google Maps</label>
                <input
                  type="url"
                  name="mapsUrl"
                  placeholder="https://maps.google.com/..."
                  value={formData.mapsUrl}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal"
                  disabled={submitting}
                />
              </div>

              {/* Hours */}
              <div className="space-y-3 border-t border-accent/10 pt-4">
                <label className="block font-bold uppercase tracking-wider text-charcoal">Horarios</label>
                {DAYS.map((day, idx) => {
                  const dayKey = DAY_KEYS[idx] as keyof typeof formData.hours;
                  return (
                    <div key={dayKey} className="space-y-1">
                      <label className="font-semibold text-charcoal-light">{day}</label>
                      <input
                        type="text"
                        placeholder="09:00 - 22:00"
                        value={formData.hours[dayKey] || ''}
                        onChange={(e) => handleHourChange(dayKey, e.target.value)}
                        className="block w-full px-4 py-2 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal text-[12px]"
                        disabled={submitting}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Active toggle */}
              <div className="space-y-1.5 border-t border-accent/10 pt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-accent/20 text-primary focus:ring-primary"
                    disabled={submitting}
                  />
                  <span className="font-bold uppercase tracking-wider text-charcoal">Sede Activa</span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 border-t border-accent/10">
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="flex-1 font-sans text-xs font-bold text-charcoal bg-canvas border border-accent/20 py-3 px-4 rounded-xl hover:bg-accent/5 transition-smooth disabled:opacity-50"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 font-sans text-xs font-bold text-white bg-primary hover:bg-primary-dark py-3 px-4 rounded-xl transition-smooth disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Guardando...' : editingBranch ? 'Actualizar' : 'Crear Sede'}
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
