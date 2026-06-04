'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    logoUrl: '',
    primaryColor: '#E8621A',
    secondaryColor: '#C94E0F',
    accentColor: '#FF6B9D',
    fontDisplay: 'Fredoka',
    fontBody: 'Nunito',
    animationsEnabled: true,
    animationSpeed: 'normal' as 'slow' | 'normal' | 'fast',
    phone: '',
    address: '',
    whatsapp: '',
    email: '',
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
    bannerTitle: '',
    bannerText: '',
    seoTitle: '',
    seoDescription: '',
    currencySymbol: 'S/',
    timezone: 'America/Lima',
    maxPeoplePerReservation: 20,
    minOrderAdvanceHours: 0,
    ctaTitle: '',
    ctaText: '',
    ctaButton: '',
    navLinks: [
      { label: 'Menú', href: '/menu' },
      { label: 'Sedes', href: '/sedes' },
      { label: 'Reservar', href: '/reservar' },
    ],
    servicesTagline: 'Servicios Especiales',
    servicesTitle: 'Más allá de lo ordinario',
    servicesDescription: 'Servicios personalizados para cada ocasión. Desde tu fiesta más especial hasta las celebraciones de tu empresa.',
    categoriesTagline: 'Catálogo Completo',
    categoriesTitle: 'Explora Nuestras Categorías',
    bestsellersTagline: 'Bestsellers',
    bestsellersTitle: 'Antojos Más Aclamados',
    bestsellersDescription: 'Las recetas clásicas más solicitadas. Probadas y aprobadas por nuestros clientes.',
    branchesTagline: 'Visítanos',
    branchesTitle: 'Nuestras Sedes',
    branchesDescription: 'Encuentra la sucursal más cercana a ti.',
  });

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setNotification({ type: 'error', message: 'Error al cargar configuración' });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? null : Number(value) }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Filter out null values to avoid Zod validation errors
      const dataToSend = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== null)
      );

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        if (data.details) {
          console.error('Validation details:', JSON.stringify(data.details, null, 2));
        }
        throw new Error(data.error || 'Error al guardar');
      }

      setNotification({ type: 'success', message: 'Configuración guardada correctamente' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({ type: 'error', message: error instanceof Error ? error.message : 'Error al guardar la configuración' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-canvas min-h-screen">
      {/* Header */}
      <section className="bg-card-bg border-b border-accent/10 py-12 text-center space-y-3">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-3xl font-black text-charcoal">Ajustes CMS</h1>
          </div>
          <p className="font-sans text-sm text-charcoal-light max-w-lg mx-auto">
            Configura la identidad, colores, contacto y SEO de tu restaurante. Los cambios se reflejarán inmediatamente en el sitio público.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span className="text-sm font-sans">{notification.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Identidad del Negocio */}
          <div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">📋 Identidad del Negocio</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Nombre del Restaurante
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Logo (URL)
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl || ''}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/logo.png"
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Ej: Repostería artesanal con ingredientes premium..."
                className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm resize-none"
              />
            </div>
          </div>

          {/* Colores de Marca */}
          <div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">🎨 Colores de Marca</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Color Primario
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="h-12 w-20 rounded-lg cursor-pointer border border-accent/20"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.name = 'primaryColor')}
                    className="flex-1 px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Color Secundario
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    className="h-12 w-20 rounded-lg cursor-pointer border border-accent/20"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.name = 'secondaryColor')}
                    className="flex-1 px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Sección Tema Visual - Accent Color */}
            <div className="pt-4 border-t border-accent/10 space-y-6">
              <h3 className="font-serif text-base font-bold text-charcoal">✨ Color Acento (Rosa)</h3>
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Color de Acentos y Detalles
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="accentColor"
                    value={formData.accentColor || '#FF6B9D'}
                    onChange={handleChange}
                    className="h-12 w-20 rounded-lg cursor-pointer border border-accent/20"
                  />
                  <input
                    type="text"
                    value={formData.accentColor || '#FF6B9D'}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.name = 'accentColor')}
                    className="flex-1 px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fuentes y Tipografía */}
          <div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">🔤 Tipografía</h2>

            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                Fuente para Títulos
              </label>
              <select
                name="fontDisplay"
                value={formData.fontDisplay || 'Fredoka'}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
              >
                <option value="Fredoka">Fredoka (Redondeada, Divertida)</option>
                <option value="Lobster">Lobster (Elegante, Script)</option>
                <option value="Poppins">Poppins (Moderna, Limpia)</option>
                <option value="Pacifico">Pacifico (Tropical, Casual)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                Fuente para Cuerpo
              </label>
              <select
                name="fontBody"
                value={formData.fontBody || 'Nunito'}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
              >
                <option value="Nunito">Nunito (Amigable, Legible)</option>
                <option value="Quicksand">Quicksand (Redondeada, Ligera)</option>
                <option value="Open Sans">Open Sans (Profesional)</option>
              </select>
            </div>
          </div>

          {/* Animaciones y Movimiento */}
          <div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">🎬 Animaciones y Movimiento</h2>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="animationsEnabled"
                  checked={formData.animationsEnabled || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, animationsEnabled: e.target.checked }))}
                  className="w-5 h-5 text-primary cursor-pointer rounded"
                />
                <span className="font-sans text-sm font-bold text-charcoal">Activar animaciones dinámicas</span>
              </label>
              <p className="font-sans text-xs text-charcoal-light ml-8">
                Habilita parallax, fade-ins, escalas y otros efectos visuales en el sitio
              </p>
            </div>

            {formData.animationsEnabled && (
              <div className="space-y-1.5 pt-4 border-t border-accent/10">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Velocidad de Animaciones
                </label>
                <select
                  name="animationSpeed"
                  value={formData.animationSpeed || 'normal'}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
                >
                  <option value="slow">🐢 Lenta (más elegante)</option>
                  <option value="normal">⚡ Normal (equilibrado)</option>
                  <option value="fast">🚀 Rápida (dinámico)</option>
                </select>
              </div>
            )}
          </div>

          {/* Banner Principal */}
          <div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">📢 Banner Principal</h2>

            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                Título del Banner
              </label>
              <input
                type="text"
                name="bannerTitle"
                value={formData.bannerTitle || ''}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                Texto del Banner
              </label>
              <textarea
                name="bannerText"
                value={formData.bannerText || ''}
                onChange={handleChange}
                rows={3}
                className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm resize-none"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">🔍 SEO</h2>

            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                Título SEO
              </label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                maxLength={60}
                className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
              />
              <p className="text-xs text-charcoal-light/60">{formData.seoTitle.length}/60 caracteres</p>
            </div>

            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                Descripción SEO
              </label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                maxLength={160}
                rows={3}
                className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm resize-none"
              />
              <p className="text-xs text-charcoal-light/60">{formData.seoDescription.length}/160 caracteres</p>
            </div>
          </div>

          {/* Contacto y Redes */}
          <div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">📱 Contacto y Redes Sociales</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: 'phone', label: 'Teléfono', type: 'tel' },
                { name: 'whatsapp', label: 'WhatsApp', type: 'tel' },
                { name: 'email', label: 'Correo Electrónico', type: 'email' },
                { name: 'address', label: 'Dirección', type: 'text' },
                { name: 'instagram', label: 'Instagram', type: 'url' },
                { name: 'facebook', label: 'Facebook', type: 'url' },
                { name: 'twitter', label: 'Twitter', type: 'url' },
                { name: 'tiktok', label: 'TikTok', type: 'url' },
              ].map(field => (
                <div key={field.name} className="space-y-1.5">
                  <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={String(formData[field.name as keyof typeof formData] ?? '')}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">⚙️ Configuración</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Símbolo de Moneda
                </label>
                <input
                  type="text"
                  name="currencySymbol"
                  value={formData.currencySymbol}
                  onChange={handleChange}
                  maxLength={3}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Zona Horaria
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
                >
                  <option value="America/Lima">America/Lima (Perú)</option>
                  <option value="America/Mexico_City">America/Mexico_City (México)</option>
                  <option value="America/Bogota">America/Bogota (Colombia)</option>
                  <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires (Argentina)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Máximo de Personas por Reserva
                </label>
                <input
                  type="number"
                  name="maxPeoplePerReservation"
                  value={formData.maxPeoplePerReservation}
                  onChange={handleChange}
                  min={1}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Anticipación Mínima (horas)
                </label>
                <input
                  type="number"
                  name="minOrderAdvanceHours"
                  value={formData.minOrderAdvanceHours ?? ''}
                  onChange={handleChange}
                  min={0}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">🎯 Llamada a la Acción</h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Título CTA
                </label>
                <input
                  type="text"
                  name="ctaTitle"
                  value={formData.ctaTitle || ''}
                  onChange={handleChange}
                  placeholder="¿Lista para el mejor postre?"
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Texto CTA
                </label>
                <textarea
                  name="ctaText"
                  value={formData.ctaText || ''}
                  onChange={handleChange}
                  placeholder="Pide online, recoge en tienda o pídelo a domicilio."
                  rows={2}
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  name="ctaButton"
                  value={formData.ctaButton || ''}
                  onChange={handleChange}
                  placeholder="Comenzar Pedido"
                  className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm"
                />
              </div>
            </div>
          </div>

          {/* Secciones de la Página de Inicio */}
          <div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">🏡 Secciones de la Página de Inicio</h2>

            {/* Sección Categorías */}
            <div className="pt-4 border-t border-accent/10 space-y-4">
              <h3 className="font-serif text-base font-bold text-primary">📂 Sección: Categorías</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">Etiqueta de la Sección</label>
                  <input type="text" name="categoriesTagline" value={formData.categoriesTagline} onChange={handleChange} className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">Título de la Sección</label>
                  <input type="text" name="categoriesTitle" value={formData.categoriesTitle} onChange={handleChange} className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm" />
                </div>
              </div>
            </div>

            {/* Sección Servicios Especiales */}
            <div className="pt-4 border-t border-accent/10 space-y-4">
              <h3 className="font-serif text-base font-bold text-primary">✨ Sección: Servicios Especiales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">Etiqueta de la Sección</label>
                  <input type="text" name="servicesTagline" value={formData.servicesTagline} onChange={handleChange} className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">Título de la Sección</label>
                  <input type="text" name="servicesTitle" value={formData.servicesTitle} onChange={handleChange} className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">Descripción de la Sección</label>
                <textarea name="servicesDescription" value={formData.servicesDescription} onChange={handleChange} rows={2} className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm resize-none" />
              </div>
            </div>

            {/* Sección Antojos Destacados */}
            <div className="pt-4 border-t border-accent/10 space-y-4">
              <h3 className="font-serif text-base font-bold text-primary">⭐ Sección: Antojos Más Aclamados (Bestsellers)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">Etiqueta de la Sección</label>
                  <input type="text" name="bestsellersTagline" value={formData.bestsellersTagline} onChange={handleChange} className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">Título de la Sección</label>
                  <input type="text" name="bestsellersTitle" value={formData.bestsellersTitle} onChange={handleChange} className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">Descripción de la Sección</label>
                <textarea name="bestsellersDescription" value={formData.bestsellersDescription} onChange={handleChange} rows={2} className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm resize-none" />
              </div>
            </div>

            {/* Sección Sedes */}
            <div className="pt-4 border-t border-accent/10 space-y-4">
              <h3 className="font-serif text-base font-bold text-primary">📍 Sección: Nuestras Sedes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">Etiqueta de la Sección</label>
                  <input type="text" name="branchesTagline" value={formData.branchesTagline} onChange={handleChange} className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">Título de la Sección</label>
                  <input type="text" name="branchesTitle" value={formData.branchesTitle} onChange={handleChange} className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">Descripción de la Sección</label>
                <textarea name="branchesDescription" value={formData.branchesDescription} onChange={handleChange} rows={2} className="block w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none text-charcoal font-sans text-sm resize-none" />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">🔗 Menú de Navegación</h2>

            <div className="space-y-3">
              {Array.isArray(formData.navLinks) && formData.navLinks.map((link: any, idx: number) => (
                <div key={idx} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block font-sans text-xs font-bold text-charcoal mb-1">
                      Etiqueta
                    </label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...(formData.navLinks || [])];
                        newLinks[idx].label = e.target.value;
                        setFormData({...formData, navLinks: newLinks});
                      }}
                      placeholder="ej: Menú"
                      className="w-full px-3 py-2 bg-canvas border border-accent/20 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-sans text-xs font-bold text-charcoal mb-1">
                      URL
                    </label>
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => {
                        const newLinks = [...(formData.navLinks || [])];
                        newLinks[idx].href = e.target.value;
                        setFormData({...formData, navLinks: newLinks});
                      }}
                      placeholder="ej: /menu"
                      className="w-full px-3 py-2 bg-canvas border border-accent/20 rounded-lg text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newLinks = (formData.navLinks || []).filter((_: any, i: number) => i !== idx);
                      setFormData({...formData, navLinks: newLinks});
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newLinks = [...(formData.navLinks || []), { label: 'Nuevo', href: '/' }];
                  setFormData({...formData, navLinks: newLinks});
                }}
                className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg font-bold text-sm hover:bg-primary/5 transition"
              >
                + Agregar enlace
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark py-4 px-6 rounded-2xl shadow-md transition-smooth hover:scale-102 active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>

        </form>
      </main>
    </div>
  );
}
