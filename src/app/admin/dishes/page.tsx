'use client';

import React, { useState, useEffect } from 'react';
import { mockDB, Dish, Category } from '@/lib/mockData';
import { Plus, Search, Trash2, Edit, Save, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminDishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  // Form States for creating new dish
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setDishes(mockDB.getDishes());
    const cats = mockDB.getCategories();
    setCategories(cats);
    if (cats.length > 0) {
      setCategoryId(cats[0].id);
    }
  }, []);

  const handleToggleAvailable = (dish: Dish) => {
    const updatedDish = { ...dish, isAvailable: !dish.isAvailable };
    mockDB.saveDish(updatedDish);
    setDishes(mockDB.getDishes());
  };

  const handleToggleActive = (dish: Dish) => {
    const updatedDish = { ...dish, isActive: !dish.isActive };
    mockDB.saveDish(updatedDish);
    setDishes(mockDB.getDishes());
  };

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    const newDish: Dish = {
      id: `dish-${Date.now()}`,
      name,
      price: parseFloat(price),
      description,
      categoryId,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      isActive: true,
      isAvailable: true,
      order: dishes.length + 1
    };

    mockDB.saveDish(newDish);
    setDishes(mockDB.getDishes());

    // Reset Form
    setName('');
    setPrice('');
    setDescription('');
    setImageUrl('');
    setShowAddForm(false);
  };

  const handleDeleteDish = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este plato de la carta?')) {
      mockDB.deleteDish(id);
      setDishes(mockDB.getDishes());
    }
  };

  // Filter logic
  const filteredDishes = dishes.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategoryId === 'all' || d.categoryId === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Title & actions header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-black text-charcoal">Gestión de Platos</h1>
          <p className="font-sans text-xs text-charcoal-light mt-1">Crea, edita y administra el stock de los productos que visualiza el cliente en tu menú.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="font-sans text-xs font-bold text-white bg-primary hover:bg-primary-dark py-3 px-5 rounded-2xl shadow-sm transition-smooth hover:scale-102 active:scale-98 flex items-center space-x-1.5"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Añadir Nuevo Plato</span>
        </button>
      </div>

      {/* 1. Global search & category filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card-bg border border-accent/15 rounded-2xl p-4 shadow-sm">
        
        {/* Search */}
        <div className="relative sm:col-span-2">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar plato por nombre o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-2.5 font-sans text-xs text-charcoal bg-canvas border border-accent/10 rounded-xl focus:border-primary focus:outline-none placeholder-charcoal-light/50"
          />
        </div>

        {/* Category Dropdown Filter */}
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="block w-full px-4 py-2.5 font-sans text-xs text-charcoal bg-canvas border border-accent/10 rounded-xl focus:border-primary focus:outline-none"
        >
          <option value="all">Todas las Categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

      </div>

      {/* 2. Main Dishes Table */}
      <section className="bg-card-bg border border-accent/15 rounded-[32px] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-accent/10 text-charcoal uppercase tracking-wider font-bold">
                <th className="py-4 px-4">Plato</th>
                <th className="py-4 px-4">Precio</th>
                <th className="py-4 px-4">Categoría</th>
                <th className="py-4 px-4 text-center">Disponible (Stock)</th>
                <th className="py-4 px-4 text-center">Visible (Activo)</th>
                <th className="py-4 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/5 text-charcoal-light">
              {filteredDishes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">No se encontraron platos registrados que coincidan con la búsqueda.</td>
                </tr>
              ) : (
                filteredDishes.map((d) => {
                  const cat = categories.find(c => c.id === d.categoryId);
                  return (
                    <tr key={d.id} className="hover:bg-canvas/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={d.imageUrl}
                            alt={d.name}
                            className="h-10 w-10 object-cover rounded-xl border border-accent/10 bg-white"
                          />
                          <div>
                            <div className="font-serif text-sm font-bold text-charcoal">{d.name}</div>
                            <div className="text-[10px] text-charcoal-light max-w-sm line-clamp-1">{d.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-charcoal">S/. {d.price.toFixed(2)}</td>
                      <td className="py-4 px-4 font-semibold text-charcoal-light">{cat ? cat.name : 'Sin categoría'}</td>
                      
                      {/* Availability stock toggle */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleToggleAvailable(d)}
                            className="p-1 rounded-lg text-charcoal hover:bg-canvas transition-all"
                            title={d.isAvailable ? 'Hacer Agotado' : 'Hacer Disponible'}
                          >
                            {d.isAvailable ? (
                              <span className="flex items-center text-[#25D366] font-bold space-x-1.5 uppercase text-[9px]">
                                <ToggleRight className="h-7 w-7" />
                                <span>En Stock</span>
                              </span>
                            ) : (
                              <span className="flex items-center text-charcoal-light/50 font-bold space-x-1.5 uppercase text-[9px]">
                                <ToggleLeft className="h-7 w-7" />
                                <span>Agotado</span>
                              </span>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Active view toggle */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleToggleActive(d)}
                            className="p-1 rounded-lg text-charcoal hover:bg-canvas transition-all"
                            title={d.isActive ? 'Hacer Inactivo' : 'Hacer Activo'}
                          >
                            {d.isActive ? (
                              <span className="flex items-center text-primary font-bold space-x-1.5 uppercase text-[9px]">
                                <ToggleRight className="h-7 w-7" />
                                <span>Visible</span>
                              </span>
                            ) : (
                              <span className="flex items-center text-charcoal-light/50 font-bold space-x-1.5 uppercase text-[9px]">
                                <ToggleLeft className="h-7 w-7" />
                                <span>Oculto</span>
                              </span>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Delete actions */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleDeleteDish(d.id)}
                            className="p-2 text-charcoal-light hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Eliminar Plato"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Sliding Add Form Overlay (Modal) */}
      {showAddForm && (
        <>
          <div
            onClick={() => setShowAddForm(false)}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs z-50 transition-opacity"
          />
          <section className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-canvas border-l border-accent/15 p-6 shadow-2xl overflow-y-auto animate-slide-left space-y-6">
            
            <div className="flex justify-between items-center border-b border-accent/10 pb-4 bg-card-bg -m-6 p-6 mb-0">
              <h3 className="font-serif text-lg font-bold text-charcoal">Registrar Nuevo Plato</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1.5 text-charcoal-light hover:text-primary rounded-full hover:bg-canvas"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDish} className="space-y-5 font-sans text-xs">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-charcoal">Nombre del Plato *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pie de Limón de Olla"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal"
                />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-charcoal">Precio (S/.) *</label>
                <input
                  type="number"
                  step="0.10"
                  required
                  placeholder="Ej. 14.90"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal"
                />
              </div>

              {/* Category dropdown selection */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-charcoal">Categoría *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-charcoal">Descripción Corta</label>
                <textarea
                  rows={3}
                  placeholder="Ej. Exquisita masa quebrada cubierta de merengue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none resize-none text-charcoal"
                />
              </div>

              {/* Image URL link */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-charcoal">Enlace de la Foto (URL)</label>
                <input
                  type="text"
                  placeholder="Ej. https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark py-4 px-6 rounded-2xl shadow-md transition-smooth hover:scale-102 active:scale-98"
              >
                Registrar e Insertar
              </button>

            </form>

          </section>
        </>
      )}

    </div>
  );
}
