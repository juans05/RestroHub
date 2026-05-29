# Rediseño Web - Guía de Implementación

## Resumen de Cambios

Se ha creado un rediseño completo basado en la estructura de **Maria Almenara** (https://www.mariaalmenara.pe/), manteniendo tu sistema de diseño actual e incorporando mejoras visuales y funcionales.

## Nuevos Componentes Creados

### 1. **HeaderV2** - Header Mejorado
- **Archivo**: `src/components/public/HeaderV2.tsx`
- **Cambios**:
  - ✅ Botón WhatsApp integrado y visible (verde oficial de WhatsApp)
  - ✅ Scroll effect: Header se vuelve más opaco/oscuro al hacer scroll
  - ✅ Navegación en desktop mejorada
  - ✅ Menú mobile expandido con WhatsApp
  - ✅ Logo y branding optimizados

### 2. **HeroCarousel** - Carrusel de Hero
- **Archivo**: `src/components/public/HeroCarousel.tsx`
- **Características**:
  - ✅ Carrusel automático con 5s de intervalo
  - ✅ Navegación con flechas y dots
  - ✅ Overlay gradiente para legibilidad
  - ✅ Resume autoplay después de interacción
  - ✅ Animaciones suaves

### 3. **FeaturedServices** - Servicios Destacados
- **Archivo**: `src/components/public/FeaturedServices.tsx`
- **Características**:
  - ✅ Dos servicios principales (Catering, Pedidos Corporativos)
  - ✅ Grid responsive (1 col mobile, 2 cols desktop)
  - ✅ Badges y highlights
  - ✅ Imagen de fondo con overlay
  - ✅ CTA diferenciados

### 4. **CategoriesShowcase** - Grid de Categorías
- **Archivo**: `src/components/public/CategoriesShowcase.tsx`
- **Características**:
  - ✅ 4 categorías principales: Tortas, Cumpleaños, Boxes, Postres
  - ✅ Grid 1-2-4 columnas responsive
  - ✅ Card interactivas con hover effects
  - ✅ Contador de productos
  - ✅ Links a menú filtrado

### 5. **FooterV2** - Footer Expandido
- **Archivo**: `src/components/public/FooterV2.tsx`
- **Características**:
  - ✅ Newsletter subscription
  - ✅ **FAQ Expandible** (4 preguntas frecuentes)
  - ✅ Mapa de sitio completo
  - ✅ Legales: Privacidad, ARCO, Términos
  - ✅ Rastreador de pedidos (placeholder)
  - ✅ Social media links
  - ✅ Contacto integrado

### 6. **PageV2** - Nueva Página de Inicio
- **Archivo**: `src/app/pageV2.tsx`
- **Flujo**:
  1. Header V2
  2. Hero Carousel
  3. Banner de propuesta de valor (Burgundy)
  4. Key Pillars (3 columnas)
  5. Featured Services
  6. Categories Showcase
  7. Featured Dishes (Bestsellers)
  8. Branches (Sedes)
  9. Final CTA (Call To Action)
  10. Footer V2

## Cómo Implementar

### Opción A: Reemplazar página actual (RECOMENDADO)

1. **Reemplaza el contenido de** `src/app/page.tsx`:
   ```bash
   # Guarda backup del original si lo deseas
   cp src/app/page.tsx src/app/page.backup.tsx
   
   # Reemplaza con el nuevo
   cp src/app/pageV2.tsx src/app/page.tsx
   ```

2. **Actualiza imports en** `src/app/layout.tsx`:
   ```tsx
   // Asegúrate que HeaderV2 y FooterV2 sean importados correctamente
   // O simplemente usa el nuevo page.tsx que incluye sus propios imports
   ```

3. **Verifica que todos los componentes están en su lugar**:
   ```
   src/components/public/
   ├── HeaderV2.tsx ✅
   ├── HeroCarousel.tsx ✅
   ├── FeaturedServices.tsx ✅
   ├── CategoriesShowcase.tsx ✅
   ├── FooterV2.tsx ✅
   ├── Header.tsx (anterior - opcional mantener)
   └── Footer.tsx (anterior - opcional mantener)
   ```

### Opción B: Usar en ruta separada

Si prefieres probar sin reemplazar:

```tsx
// src/app/preview/page.tsx
export { default } from '@/app/pageV2';
```

Luego accede a: `http://localhost:3000/preview`

## Cambios Técnicos Importantes

### Sistema de Colores (Mantenido)
```css
--primary: #6B1A2A (Burgundy)
--accent: #C5A059 (Gold)
--canvas: #FAFAF8 (Beige claro)
--charcoal: #1A1A1A (Negro)
```

### Nuevas Animaciones CSS

Los componentes usan animaciones existentes en tu proyecto:
- `animate-fade-in`
- `animate-scale-in`
- `transition-smooth`

Si no existen, añade a tu `globals.css`:

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in-out;
}

.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Configuración de Componentes

### HeaderV2
Utiliza automáticamente la configuración del sistema:
- `config.businessName`
- `config.description`
- `config.whatsapp`

### HeroCarousel
Personaliza los slides pasando un array:
```tsx
const heroSlides = [
  {
    id: '1',
    image: 'url-imagen',
    title: 'Tu título',
    subtitle: 'Subtítulo',
    description: 'Descripción',
    cta: {
      text: 'Botón',
      href: '/destino',
    },
  },
];

<HeroCarousel slides={heroSlides} autoplay={true} autoplayInterval={5000} />
```

### FeaturedServices
Personaliza servicios:
```tsx
const services = [
  {
    id: 'catering',
    title: 'Catering para Eventos',
    description: '...',
    image: 'url',
    icon: <Gift />,
    cta: { text: 'Solicitar', href: '#' },
    badge: 'Popular',
    highlight: true,
  },
];

<FeaturedServices services={services} />
```

### CategoriesShowcase
Personaliza categorías:
```tsx
const categories = [
  {
    id: 'tortas',
    name: 'Tortas',
    image: 'url',
    description: 'Desc',
    color: 'from-pink-600/40 to-rose-600/40',
    productCount: 24,
  },
];

<CategoriesShowcase categories={categories} />
```

## Testing & Verificación

### Desktop
- [ ] Header responsive y botón WhatsApp visible
- [ ] Carrusel funciona correctamente (flechas, dots, autoplay)
- [ ] Services section se muestra correctamente
- [ ] Categories grid se adapta (4 columnas)
- [ ] Footer FAQ es expandible
- [ ] Links funcionan correctamente

### Mobile
- [ ] Header se ve bien con menú mobile
- [ ] Carousel es tappable
- [ ] Services apiladas
- [ ] Categories grid: 1-2 columnas
- [ ] Footer legible y scrolleable

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1

**Optimizaciones implementadas**:
- Imágenes en Hero se pueden lazy-load
- Carousel no genera layout shift
- CSS modular y sin bloques de renderizado

## Diferencias vs. Maria Almenara

| Aspecto | Maria Almenara | Tu Nuevo Diseño |
|---------|---|---|
| Header | CTA en header | CTA en header + WhatsApp |
| Hero | Single image | Carrusel 3 slides |
| Propuesta | "Amor es compartir" | Tu tagline burgundy |
| Servicios | 2 destacados | 2 destacados (igual) |
| Categorías | Visible | Grid de 4 |
| FAQ | En footer | FAQ expandible |
| Branches | En mapa | Vitrina de 3 |
| Newsletter | Sí | Sí (mejorado) |

## Personalizaciones Recomendadas

### 1. **Imágenes Hero**
Reemplaza URLs en `pageV2.tsx`:
```tsx
image: 'https://tu-api.com/imagen-hero-1.jpg'
```

### 2. **Contenido FAQ**
Edita en `FooterV2.tsx`:
```tsx
const defaultFAQs = [
  {
    id: 'delivery',
    question: 'Tu pregunta',
    answer: 'Tu respuesta',
  },
];
```

### 3. **Colores Gradient**
Personaliza en `CategoriesShowcase.tsx`:
```tsx
color: 'from-[TU_COLOR]/40 to-[TU_COLOR2]/40'
```

### 4. **Rutas de Botones**
Reemplaza `#` en links a rutas reales:
```tsx
// En FeaturedServices
cta: { text: 'Solicitar', href: '/contacto' }
```

## Próximos Pasos Opcionales

1. **Página de Catering**: Crear `/app/catering/page.tsx`
2. **Página de Contacto**: Crear `/app/contacto/page.tsx`
3. **Rastreador de Pedidos**: Crear `/app/rastreador/page.tsx`
4. **Blog/News**: Para mantener contenido fresco
5. **Chat en vivo**: Para atención al cliente

## Soporte

Si necesitas:
- Cambiar colores: Edita `tailwind.config.ts`
- Agregar animaciones: Añade a `globals.css`
- Modificar layout: Edita los componentes directamente
- Integrar datos reales: Reemplaza `mockDB` en `pageV2.tsx`

---

**Fecha de creación**: 2024
**Versión**: 1.0
**Basado en**: Maria Almenara Design System
