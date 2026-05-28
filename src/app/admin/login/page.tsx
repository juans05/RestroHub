'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Award } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setIsLoading(false);
        return;
      }

      router.push('/admin');
    } catch (err) {
      setError('Error al conectar con el servidor');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center min-h-screen bg-canvas px-4 py-12 relative overflow-hidden">
      
      {/* Absolute backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl z-0" />

      <main className="w-full max-w-md bg-card-bg border border-accent/15 rounded-[40px] p-8 md:p-10 shadow-2xl z-10 space-y-8 animate-scale-in">
        
        {/* Brand details */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 bg-primary/5 text-accent rounded-full border border-accent/15 flex items-center justify-center">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-black text-charcoal">
              Panel Administrador
            </h1>
            <p className="font-sans text-[10px] uppercase tracking-wider text-accent font-semibold">
              Resto-CMS Management
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-sans leading-relaxed">
              {error}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                placeholder="admin@restocms.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 font-sans text-sm text-charcoal bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none placeholder-charcoal-light/45"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block font-sans text-xs font-bold text-charcoal uppercase tracking-wider">
                Contraseña
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 font-sans text-sm text-charcoal bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none placeholder-charcoal-light/45"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-sans text-sm font-bold text-white bg-primary hover:bg-primary-dark py-4 px-6 rounded-2xl shadow-md transition-smooth hover:scale-102 active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Iniciando Sesión...' : 'Entrar al Panel'}</span>
            </button>
          </div>

        </form>

        <div className="text-center pt-2">
          <Link href="/" className="font-sans text-xs font-semibold text-charcoal-light hover:text-primary transition-colors">
            ← Volver al Sitio Público
          </Link>
        </div>

      </main>
    </div>
  );
}
