'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, BookOpen, MapPin, Settings, LayoutDashboard, LogOut, ShieldAlert, Menu, X } from 'lucide-react';
import { mockDB } from '@/lib/mockData';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const config = mockDB.getConfig();

  // Client-side auth check via API
  useEffect(() => {
    // Exclude /admin/login from authentication check to avoid infinite redirect loops
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    // Verify session via API endpoint
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/admin/login');
    }
  };

  const menuLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Platos', href: '/admin/dishes', icon: BookOpen },
    { name: 'Sedes', href: '/admin/branches', icon: MapPin },
    { name: 'Ajustes CMS', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  // While checking auth state, show a clean loading indicator
  if (isAuthenticated === null) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-screen bg-canvas font-sans text-charcoal">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-3" />
        <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-light">Verificando Credenciales...</span>
      </div>
    );
  }

  // If path is login, bypass layout wrap
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex-1 flex min-h-screen bg-canvas font-sans text-charcoal">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-68 bg-primary text-white border-r border-accent/20 shrink-0">
        
        {/* Sidebar Header */}
        <div className="h-20 px-6 border-b border-white/10 flex items-center">
          <Link href="/admin" className="flex flex-col">
            <span className="font-serif text-lg font-black tracking-tight text-white">
              {config.businessName}
            </span>
            <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-accent font-semibold -mt-0.5">
              Administración CMS
            </span>
          </Link>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  active
                    ? 'bg-white/10 text-accent border-l-4 border-accent'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-300 hover:bg-red-500/10 hover:text-red-100 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </aside>

      {/* 2. Main content area wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Main Content Header */}
        <header className="h-20 bg-card-bg border-b border-accent/15 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-charcoal hover:bg-canvas transition-colors"
              aria-label="Abrir panel"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-serif text-lg font-black text-charcoal">
              Consola de Administración
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-block font-sans text-xs font-bold text-primary bg-primary/5 hover:bg-primary hover:text-white border border-primary/20 py-2.5 px-4 rounded-xl transition-smooth"
            >
              Ver Sitio Público
            </Link>
            <div className="h-9 w-9 rounded-full bg-accent/20 border border-accent/30 text-accent flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content Body view */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>

      </div>

      {/* 3. Mobile Sidebar Drawer overlay */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          />
          <aside className="fixed inset-y-0 left-0 w-68 bg-primary text-white border-r border-accent/20 z-50 flex flex-col justify-between lg:hidden animate-slide-right">
            <div>
              <div className="h-20 px-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-black text-white">{config.businessName}</span>
                  <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-accent font-semibold -mt-0.5">Admin CMS</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-full text-white/75 hover:text-white hover:bg-white/10 transition-colors" aria-label="Cerrar panel">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="p-4 space-y-2">
                {menuLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                        active
                          ? 'bg-white/10 text-accent border-l-4 border-accent'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-300 hover:bg-red-500/10 hover:text-red-100 transition-all duration-200"
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </aside>
        </>
      )}

    </div>
  );
}
