# Plan: RestoCMS — Dinamismo Total (100% Administrable)

## Contexto

RestoCMS tiene secciones hardcodeadas y usa `mockDB` (localStorage) como fuente de datos. El objetivo es hacer que **todo el contenido del sitio sea configurable desde el panel admin**, sin tocar código. Este plan está escrito para que cualquier IA (u humano) pueda ejecutar cada tarea de forma independiente.

**Estado actual (ya dinámico):** Hero Sliders, Features, Header (businessName/whatsapp), Footer (redes/contacto), Settings/Tema

**Falta dinamizar:** FeaturedServices, CategoriesShowcase, Banner (usa mockDB), Bestsellers (usa mockDB), Sedes en home (usa mockDB), FAQs footer, NavLinks header, CTA section

---

## Arquitectura — patrón que se repite en TODO el proyecto

```
Prisma Model
  → /api/admin/<model>       (GET, POST — con auth)
  → /api/admin/<model>/[id]  (PUT, DELETE — con auth)
  → /api/public/<model>      (GET — sin auth, para el frontend)
  → src/components/public/<Component>.tsx  (fetch /api/public/<model> + fallback)
  → src/app/admin/<model>/page.tsx         (CRUD admin UI)
  → entrada en menuLinks de src/app/admin/layout.tsx
```

### Archivos de referencia para copiar patrones

| Qué | Archivo fuente |
|-----|---------------|
| API admin CRUD | `src/app/api/admin/features/route.ts` + `[id]/route.ts` |
| API pública | `src/app/api/public/features/route.ts` |
| Componente con fetch | `src/components/public/FeaturesSection.tsx` |
| Página admin CRUD | `src/app/admin/features/page.tsx` |
| Schema Zod | `featureSchema` en `src/lib/validations.ts` |
| Prisma model | `Feature` en `prisma/schema.prisma` |

---

## TAREA 1 — Migrar Banner + Bestsellers + Sedes a API real

**Impacto:** Elimina mockDB de la homepage

**Archivo principal:** `src/app/page.tsx` (líneas 27-29 usan mockDB)

### Pasos:

1. **Crear `src/app/api/public/dishes/route.ts`:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Number(searchParams.get('limit') || 3);

    const dishes = await prisma.dish.findMany({
      where: { isActive: true, isAvailable: true },
      take: limit,
      orderBy: { order: 'asc' },
      include: { category: true },
    });

    return NextResponse.json(dishes, { status: 200 });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
```

2. **Crear `src/app/api/public/branches/route.ts`:**
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(branches, { status: 200 });
  } catch (error) {
    console.error("Error fetching branches:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
```

3. **Modificar `src/app/page.tsx`** (líneas 26-29):
   
   Reemplazar:
   ```typescript
   const config = mockDB.getConfig();
   const branches = mockDB.getBranches();
   const featuredDishes = mockDB.getDishes().slice(0, 3);
   ```

   Por:
   ```typescript
   const [config, setConfig] = useState<any>({});
   const [featuredDishes, setFeaturedDishes] = useState<any[]>([]);
   const [branches, setBranches] = useState<any[]>([]);

   useEffect(() => {
     Promise.all([
       fetch('/api/public/settings').then(r => r.json()),
       fetch('/api/public/dishes?limit=3').then(r => r.json()),
       fetch('/api/public/branches').then(r => r.json()),
     ]).then(([conf, dishes, segs]) => {
       setConfig(conf);
       setFeaturedDishes(dishes);
       setBranches(segs);
     });
   }, []);
   ```

4. **Eliminar `import { mockDB }`** de page.tsx

### Verificación:
- ✅ `npm run dev` inicia sin errores
- ✅ Homepage carga platos y sedes desde BD real
- ✅ mockDB ya no se importa en page.tsx

---

## TAREA 2 — FeaturedServices dinámico (Catering, Corporativo, etc.)

**Nuevo modelo:** `Service` en Prisma

### Pasos:

1. **Modificar `prisma/schema.prisma`** — agregar al final:
```prisma
model Service {
  id            String   @id @default(uuid())
  title         String
  description   String
  imageUrl      String?
  icon          String   @default("gift")
  ctaText       String?
  ctaHref       String?
  badge         String?
  isHighlighted Boolean  @default(false)
  isActive      Boolean  @default(true)
  order         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

   Ejecutar migración:
   ```bash
   npx prisma migrate dev --name add_services_table
   npx prisma generate
   ```

2. **Modificar `src/lib/validations.ts`** — agregar al final:
```typescript
export const serviceSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  imageUrl: z.string().optional().nullable(),
  icon: z.string().default("gift"),
  ctaText: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  isHighlighted: z.boolean().default(false),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const serviceUpdateSchema = serviceSchema.partial();
```

3. **Crear `src/app/api/admin/services/route.ts`:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validations";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = serviceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: parsed.data,
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
```

4. **Crear `src/app/api/admin/services/[id]/route.ts`:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceUpdateSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const parsed = serviceUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const service = await prisma.service.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.service.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
```

5. **Crear `src/app/api/public/services/route.ts`:**
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
```

6. **Modificar `src/components/public/FeaturedServices.tsx`** — agregar al componente:
```typescript
'use client';

import React, { useState, useEffect } from 'react';
// ... otros imports ...

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({
  services = defaultServices,
  tagline = 'Servicios Especiales',
}) => {
  const [loadedServices, setLoadedServices] = useState(services);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/public/services');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setLoadedServices(data);
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="...">
      {/* resto del componente usa loadedServices en lugar de services */}
    </section>
  );
};
```

7. **Crear `src/app/admin/services/page.tsx`:**
   - Copiar estructura completa de `src/app/admin/features/page.tsx`
   - Cambiar campos: title, description, imageUrl, icon, ctaText, ctaHref, badge, isHighlighted
   - Cambiar endpoint de `/api/admin/features` a `/api/admin/services`

8. **Modificar `src/app/admin/layout.tsx`** — en el array `menuLinks` (línea ~54):
```typescript
import { Gift } from 'lucide-react';

const menuLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Platos', href: '/admin/dishes', icon: BookOpen },
  { name: 'Sedes', href: '/admin/branches', icon: MapPin },
  { name: 'Sliders', href: '/admin/sliders', icon: Images },
  { name: 'Características', href: '/admin/features', icon: Sparkles },
  { name: 'Servicios', href: '/admin/services', icon: Gift },  // ← Agregar esta línea
  { name: 'Ajustes CMS', href: '/admin/settings', icon: Settings },
];
```

### Verificación:
- ✅ `/admin/services` permite crear, editar, eliminar servicios
- ✅ Homepage muestra servicios dinámicamente desde BD
- ✅ El fallback (`defaultServices`) se muestra si BD está vacía

---

## TAREA 3 — CategoriesShowcase dinámico

**Nota:** El modelo `Category` YA existe — solo ampliar con nuevos campos

### Pasos:

1. **Modificar `prisma/schema.prisma`** — el modelo `Category` (alrededor de línea 10):
```prisma
model Category {
  id        String   @id @default(uuid())
  name      String   @unique
  slug      String   @unique
  order     Int      @default(0)
  imageUrl    String?
  description String?
  colorFrom   String  @default("from-primary/40")
  colorTo     String  @default("to-accent/40")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  dishes    Dish[]
}
```

   Ejecutar migración:
   ```bash
   npx prisma migrate dev --name add_category_image_desc
   npx prisma generate
   ```

2. **Crear `src/app/api/public/categories/route.ts`:**
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { 
        _count: { 
          select: { 
            dishes: { where: { isActive: true } } 
          } 
        },
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
```

3. **Modificar `src/components/public/CategoriesShowcase.tsx`** — agregar fetch:
```typescript
const [loadedCategories, setLoadedCategories] = useState(defaultCategories);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/public/categories');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setLoadedCategories(data.map((c: any) => ({
            id: c.id,
            name: c.name,
            image: c.imageUrl || '',
            description: c.description || '',
            productCount: c._count?.dishes || 0,
            color: `${c.colorFrom} ${c.colorTo}`,
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  fetchCategories();
}, []);
```

4. **Crear `src/app/admin/categories/page.tsx`:**
   - Copiar estructura de `src/app/admin/features/page.tsx`
   - Campos: name, slug, imageUrl, description, colorFrom, colorTo, order
   - Endpoint: `/api/admin/categories`

5. **Modificar `src/app/admin/layout.tsx`** — agregar a menuLinks:
```typescript
import { Tag } from 'lucide-react';

{ name: 'Categorías', href: '/admin/categories', icon: Tag },
```

### Verificación:
- ✅ `/admin/categories` permite editar imágenes y descripciones
- ✅ CategoriesShowcase carga dinámicamente desde BD
- ✅ Los colores de gradiente se aplican correctamente

---

## TAREA 4 — FAQs del Footer dinámicas

### Pasos:

1. **Modificar `prisma/schema.prisma`** — agregar modelo al final:
```prisma
model FAQ {
  id        String   @id @default(uuid())
  question  String
  answer    String
  isActive  Boolean  @default(true)
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

   Ejecutar migración:
   ```bash
   npx prisma migrate dev --name add_faqs_table
   npx prisma generate
   ```

2. **Modificar `src/lib/validations.ts`** — agregar:
```typescript
export const faqSchema = z.object({
  question: z.string().min(1, "La pregunta es requerida"),
  answer: z.string().min(1, "La respuesta es requerida"),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const faqUpdateSchema = faqSchema.partial();
```

3. **Crear `src/app/api/admin/faqs/route.ts` y `[id]/route.ts`:**
   - Copiar de `src/app/api/admin/features/` — cambiar model a `prisma.faq`

4. **Crear `src/app/api/public/faqs/route.ts`:**
   - Copiar de `src/app/api/public/features/route.ts` — cambiar model a `prisma.faq`

5. **Modificar `src/components/public/FooterV2.tsx`** — agregar fetch de FAQs:
```typescript
const [faqs, setFaqs] = useState(defaultFAQs);

useEffect(() => {
  fetch('/api/public/faqs')
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setFaqs(data);
      }
    });
}, []);
```

6. **Crear `src/app/admin/faqs/page.tsx`:**
   - Copiar de `src/app/admin/features/page.tsx`
   - Campos: question, answer, order
   - Endpoint: `/api/admin/faqs`

7. **Modificar `src/app/admin/layout.tsx`:**
```typescript
import { HelpCircle } from 'lucide-react';

{ name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
```

### Verificación:
- ✅ `/admin/faqs` permite crear/editar/eliminar preguntas
- ✅ Footer muestra FAQs dinámicamente

---

## TAREA 5 — CTA Section configurable

**Mínimo esfuerzo — solo agregar campos a SystemConfig**

### Pasos:

1. **Modificar `prisma/schema.prisma`** — en `SystemConfig`, agregar:
```prisma
ctaTitle  String? @default("¿Lista para el mejor postre?")
ctaText   String? @default("Pide online, recoge en tienda o pídelo a domicilio.")
ctaButton String? @default("Comenzar Pedido")
```

   Ejecutar migración:
   ```bash
   npx prisma migrate dev --name add_cta_config
   npx prisma generate
   ```

2. **Modificar `src/lib/validations.ts`** — en `settingsUpdateSchema`, agregar:
```typescript
ctaTitle: z.string().optional().nullable(),
ctaText: z.string().optional().nullable(),
ctaButton: z.string().optional().nullable(),
```

3. **Modificar `src/app/page.tsx`** — en la sección CTA (busca "Ready" o "postre"), reemplazar textos hardcodeados por:
```typescript
config.ctaTitle, config.ctaText, config.ctaButton
```

4. **Modificar `src/app/admin/settings/page.tsx`** — agregar nueva sección:
```typescript
{/* CTA Section */}
<div className="bg-card-bg border border-accent/15 rounded-[24px] p-6 space-y-6">
  <h2 className="font-serif text-lg font-bold text-charcoal">🎯 Llamada a la Acción</h2>

  <div className="space-y-4">
    <div>
      <label className="block font-sans text-sm font-bold text-charcoal mb-2">
        Título CTA
      </label>
      <input
        type="text"
        name="ctaTitle"
        value={formData.ctaTitle || ''}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
      />
    </div>

    <div>
      <label className="block font-sans text-sm font-bold text-charcoal mb-2">
        Texto CTA
      </label>
      <textarea
        name="ctaText"
        value={formData.ctaText || ''}
        onChange={handleChange}
        rows={2}
        className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none resize-none"
      />
    </div>

    <div>
      <label className="block font-sans text-sm font-bold text-charcoal mb-2">
        Texto del Botón
      </label>
      <input
        type="text"
        name="ctaButton"
        value={formData.ctaButton || ''}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-canvas border border-accent/20 rounded-xl focus:border-primary focus:outline-none"
      />
    </div>
  </div>
</div>
```

### Verificación:
- ✅ `/admin/settings` tiene campos para CTA
- ✅ Cambios se reflejan inmediatamente en homepage

---

## TAREA 6 — NavLinks del Header dinámicos

### Pasos:

1. **Modificar `prisma/schema.prisma`** — en `SystemConfig`, agregar:
```prisma
navLinks Json @default("[{\"label\":\"Menú\",\"href\":\"/menu\"},{\"label\":\"Sedes\",\"href\":\"/branches\"},{\"label\":\"Reservar\",\"href\":\"/reservations\"}]")
```

   Ejecutar migración:
   ```bash
   npx prisma migrate dev --name add_nav_links
   npx prisma generate
   ```

2. **Modificar `src/lib/validations.ts`** — en `settingsUpdateSchema`:
```typescript
navLinks: z.array(
  z.object({ label: z.string().min(1), href: z.string().min(1) })
).optional(),
```

3. **Modificar `src/components/public/HeaderV2.tsx`** — reemplazar `navLinks` hardcodeado:
```typescript
const { config } = useSystemConfig();
const navLinks = Array.isArray(config?.navLinks) ? config.navLinks : [
  { label: 'Menú', href: '/menu' },
  { label: 'Sedes', href: '/branches' },
  { label: 'Reservar', href: '/reservations' },
];
```

4. **Modificar `src/app/admin/settings/page.tsx`** — agregar editor de NavLinks (sección "🔗 Menú de Navegación"):
```typescript
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
              const newLinks = [...formData.navLinks];
              newLinks[idx].label = e.target.value;
              setFormData({...formData, navLinks: newLinks});
            }}
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
              const newLinks = [...formData.navLinks];
              newLinks[idx].href = e.target.value;
              setFormData({...formData, navLinks: newLinks});
            }}
            className="w-full px-3 py-2 bg-canvas border border-accent/20 rounded-lg text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            const newLinks = formData.navLinks.filter((_: any, i: number) => i !== idx);
            setFormData({...formData, navLinks: newLinks});
          }}
          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
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
      className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg font-bold text-sm hover:bg-primary/5"
    >
      + Agregar enlace
    </button>
  </div>
</div>
```

### Verificación:
- ✅ `/admin/settings` permite editar menú de navegación
- ✅ Header muestra los links dinámicamente

---

## Orden de ejecución recomendado

| # | Tarea | Esfuerzo | Impacto | Dependencias |
|---|-------|----------|---------|------------|
| 1 | Migrar mockDB → API real | 🟡 Medio | 🔴 Alto | Ninguna |
| 2 | CategoriesShowcase | 🟢 Bajo | 🔴 Alto | Ninguna |
| 3 | FeaturedServices | 🟡 Medio | 🔴 Alto | Ninguna |
| 4 | CTA Section | 🟢 Bajo | 🟡 Medio | Ninguna |
| 5 | FAQs Footer | 🟡 Medio | 🟡 Medio | Ninguna |
| 6 | NavLinks Header | 🟡 Medio | 🟢 Bajo | Ninguna |

---

## Notas importantes para ejecutar este plan

- **No eliminar mockDB** hasta que TAREA 1 esté 100% completa
- **Siempre crear `/api/public/`** además del admin — el público no usa auth
- **Siempre mantener fallback** en componentes: si BD está vacía, mostrar datos por defecto
- **Ejecutar `npx prisma generate`** después de cada migración
- El modelo `Category` y sus APIs admin YA existen — usar `/api/admin/categories/` existente
- **Stack:** Next.js 16 + React 19 + Tailwind CSS 4 + Prisma + PostgreSQL
- **Auth:** cookie `session` verificada en `/api/auth/session` — las rutas públicas no necesitan auth
- **Ruta del proyecto:** `d:\Proyecto_juans_\Restuarante`

---

## Cómo compartir este plan con otra IA

1. Copia este archivo completo
2. Pégalo en el chat con la IA (OpenCode, ChatGPT, etc.)
3. Especifica cuál tarea quieres que implemente: *"Implementa la TAREA 1"*
4. O: *"Implementa todas las TAREAS en orden"*

✅ **El plan está listo para ser ejecutado por cualquier IA sin contexto adicional.**
