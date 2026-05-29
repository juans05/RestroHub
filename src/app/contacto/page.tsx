'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeaderV2 } from '@/components/public/HeaderV2';
import { FooterV2 } from '@/components/public/FooterV2';
import { CartDrawer } from '@/components/public/CartDrawer';
import { useSystemConfig } from '@/hooks/useSystemConfig';
import { Mail, Phone, MapPin, MessageCircle, Clock, Check, ArrowRight } from 'lucide-react';

export default function ContactoPage() {
  const { config } = useSystemConfig();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const whatsappNumber = config?.whatsapp?.replace(/\D/g, '');
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=Hola%20me%20gustaría%20información`
    : '#';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Teléfono',
      value: config?.whatsapp || '+51 XXX XXX XXX',
      link: `tel:${config?.whatsapp?.replace(/\D/g, '')}`,
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      value: config?.email || 'contacto@restaurante.com',
      link: `mailto:${config?.email}`,
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Dirección',
      value: config?.address || 'Lima, Perú',
      link: '#',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Horarios',
      value: 'Lun-Dom: 9:00 AM - 8:00 PM',
      link: '#',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-canvas">
      <HeaderV2 />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:30px_30px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center space-x-2 font-sans text-[11px] tracking-[0.2em] uppercase text-accent font-bold bg-accent/20 px-4 py-2 rounded-full border border-accent/40">
              <MessageCircle className="h-4 w-4" />
              <span>Estamos Aquí Para Ti</span>
            </span>

            <h1 className="font-serif text-5xl md:text-6xl font-black leading-[1.1]">
              Contáctanos
            </h1>

            <p className="font-sans text-lg text-white/90 leading-relaxed max-w-2xl">
              ¿Tienes preguntas? Nos encantaría escucharte. Contacta con nosotros por cualquiera de nuestros canales.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-24 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="group bg-canvas border border-accent/15 rounded-[24px] p-6 hover:border-accent/35 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                  {info.icon}
                </div>
                <h3 className="font-serif text-lg font-extrabold text-charcoal mb-2">
                  {info.title}
                </h3>
                <p className="font-sans text-sm text-charcoal-light">
                  {info.value}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & WhatsApp */}
      <section className="py-24 md:py-32 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Form */}
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="font-serif text-4xl font-black text-charcoal">
                  Envíanos tu Mensaje
                </h2>
                <p className="font-sans text-base text-charcoal-light">
                  Completa el formulario y nos pondremos en contacto lo antes posible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block font-sans text-sm font-semibold text-charcoal mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-card-bg border border-accent/15 font-sans text-base outline-none focus:border-accent/50 transition-colors"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-semibold text-charcoal mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-card-bg border border-accent/15 font-sans text-base outline-none focus:border-accent/50 transition-colors"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-semibold text-charcoal mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-card-bg border border-accent/15 font-sans text-base outline-none focus:border-accent/50 transition-colors"
                    placeholder="+51 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-semibold text-charcoal mb-2">
                    Asunto
                  </label>
                  <select
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-card-bg border border-accent/15 font-sans text-base outline-none focus:border-accent/50 transition-colors"
                    required
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="pedido">Consulta sobre pedido</option>
                    <option value="catering">Catering para evento</option>
                    <option value="reserva">Reserva de mesa</option>
                    <option value="feedback">Sugerencia o comentario</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-sm font-semibold text-charcoal mb-2">
                    Mensaje
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-card-bg border border-accent/15 font-sans text-base outline-none focus:border-accent/50 transition-colors resize-none h-32"
                    placeholder="Tu mensaje aquí..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark py-3 rounded-xl shadow-md transition-smooth hover:scale-105 active:scale-97 flex items-center justify-center space-x-2"
                >
                  <span>Enviar Mensaje</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {submitted && (
                  <div className="bg-accent/20 border border-accent/40 rounded-xl p-4 flex items-center space-x-3 animate-fade-in">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <p className="font-sans text-sm text-charcoal font-semibold">
                      ¡Mensaje enviado! Nos pondremos en contacto pronto.
                    </p>
                  </div>
                )}

              </form>
            </div>

            {/* WhatsApp & Quick Links */}
            <div className="space-y-8">

              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-br from-[#25D366]/10 to-[#25D366]/5 border-2 border-[#25D366]/40 rounded-[28px] p-8 md:p-10 space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-black text-charcoal mb-2">
                    Contacta por WhatsApp
                  </h3>
                  <p className="font-sans text-base text-charcoal-light leading-relaxed">
                    Respuesta rápida y atención personalizada. Disponible todos los días.
                  </p>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 w-full font-sans text-sm font-bold text-white bg-[#25D366] hover:bg-[#20BA58] py-4 rounded-2xl transition-smooth hover:scale-105 active:scale-97 shadow-md"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Abrir WhatsApp</span>
                </a>

                <div className="bg-white/50 rounded-xl p-4">
                  <p className="font-sans text-xs text-charcoal text-center">
                    <strong>Respuesta en menos de 1 hora</strong>
                    <br />
                    Lun-Dom: 9:00 AM - 8:00 PM
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-black text-charcoal">
                  Otras Opciones
                </h3>

                <Link
                  href="/catering"
                  className="block p-4 bg-card-bg border border-accent/15 rounded-xl hover:border-accent/35 transition-colors text-left"
                >
                  <p className="font-sans font-semibold text-charcoal mb-1">Catering para Eventos</p>
                  <p className="font-sans text-sm text-charcoal-light">Solicita cotización de catering</p>
                </Link>

                <Link
                  href="/menu"
                  className="block p-4 bg-card-bg border border-accent/15 rounded-xl hover:border-accent/35 transition-colors text-left"
                >
                  <p className="font-sans font-semibold text-charcoal mb-1">Ver Nuestro Menú</p>
                  <p className="font-sans text-sm text-charcoal-light">Explora nuestra carta completa</p>
                </Link>

                <Link
                  href="/reservar"
                  className="block p-4 bg-card-bg border border-accent/15 rounded-xl hover:border-accent/35 transition-colors text-left"
                >
                  <p className="font-sans font-semibold text-charcoal mb-1">Reservar Mesa</p>
                  <p className="font-sans text-sm text-charcoal-light">Reserva tu lugar ahora</p>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Map Section (placeholder) */}
      <section className="relative h-96 bg-card-bg overflow-hidden">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.9024478658535!2d-77.03163!3d-12.0977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA1JzQyLjAiUyA3N8KwMDEnNTEuOCJX!5e0!3m2!1ses!2spe!4v1234567890`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <FooterV2 />
    </div>
  );
}
