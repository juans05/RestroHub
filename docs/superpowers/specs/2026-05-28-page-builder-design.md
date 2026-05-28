# RestroHub — Page Builder & Multi-Tenant SaaS
**Fecha:** 2026-05-28  
**Estado:** En diseño (secciones 2–5 pendientes de aprobación)

---

## Contexto del Proyecto

RestroHub es una plataforma de gestión para restaurantes con carta digital, reservas y panel admin. El objetivo es convertirla en un **SaaS multi-tenant** donde cada restaurante pueda diseñar visualmente su propio sitio web desde el admin, similar a Shopify/PrestaShop.

Stack actual: Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Prisma 7 · PostgreSQL

---

## Decisiones de Diseño (confirmadas por el usuario)

| Pregunta | Decisión |
|---|---|
| Nivel de personalización | Builder de secciones con panel + preview en tiempo real (no canvas libre) |
| Modelo de tenants | Multi-tenant SaaS — múltiples restaurantes independientes |
| Dominio público | Dominio propio por restaurante (`rauletti.com`, `lomosaltado.com`) |
| Alcance del builder | Todo el sitio: homepage, menú, reservas, sedes + páginas custom |
| Flujo de guardado | Draft → Preview privado (link compartible) → Publicar |
| Interfaz del builder | Panel lateral izquierdo con controles + iframe preview a la derecha |

---

## Sección 1 — Arquitectura General ✅ Aprobada

```
┌─────────────────────────────────────────────────────────┐
│                    RESTROHUB PLATFORM                    │
├──────────────────────┬──────────────────────────────────┤
│   Admin Panel        │   Sitio Público (por tenant)      │
│   /admin/*           │   rauletti.com  lomosaltado.com   │
│                      │                                   │
│  ┌────────────────┐  │  Next.js Middleware               │
│  │ Page Builder   │  │  lee Host header →                │
│  │ (panel+iframe) │  │  carga tenant desde DB            │
│  └────────────────┘  │                                   │
│  ┌────────────────┐  │  Renderiza bloques del JSON       │
│  │ CMS: dishes,   │  │  publicado del tenant             │
│  │ branches, etc  │  │                                   │
│  └────────────────┘  │                                   │
└──────────────────────┴──────────────────────────────────┘
              │                        │
              └──────── PostgreSQL ────┘
                    Tenant | Pages | Blocks
```

**Flujo central:**
1. El dueño entra a `restrohub.com/admin` con su cuenta de tenant
2. Edita su sitio en el builder → cambios guardados como **draft JSON** en DB
3. Puede ver preview privado en `su-dominio.com?preview=TOKEN`
4. Al publicar → draft se convierte en **published JSON**
5. Visitantes de `su-dominio.com` ven el published JSON renderizado

---

## Sección 2 — Modelo de Datos (pendiente de aprobación)

### Tablas principales

```sql
-- Un restaurante = un tenant
Tenant {
  id            String   @id
  slug          String   @unique        -- "rauletti"
  customDomain  String?  @unique        -- "rauletti.com"
  name          String
  plan          Plan     @default(FREE) -- FREE | PRO | ENTERPRISE
  createdAt     DateTime
}

-- Cada página del sitio del tenant
Page {
  id          String   @id
  tenantId    String
  slug        String                    -- "/" | "/menu" | "/sobre-nosotros"
  title       String
  isSystem    Boolean  @default(false)  -- true = página del sistema (no se puede borrar)
  draftJson   Json                      -- JSON con los bloques en edición
  publishedJson Json?                   -- JSON publicado (null = aún no publicado)
  previewToken String   @unique         -- token para acceso al preview
  updatedAt   DateTime
  publishedAt DateTime?
}

-- Configuración global del tenant (colores, fuentes, logo)
ThemeConfig {
  id           String  @id
  tenantId     String  @unique
  primaryColor String  @default("#6B1A2A")
  accentColor  String  @default("#C5A059")
  bgColor      String  @default("#FAF6F0")
  fontHeading  String  @default("Playfair Display")
  fontBody     String  @default("Outfit")
  logoUrl      String?
  faviconUrl   String?
  draftJson    Json    -- versión draft del theme
  publishedJson Json?  -- versión publicada del theme
}
```

### Estructura del JSON de bloques

Cada página tiene un array de bloques. Ejemplo de `draftJson`:

```json
{
  "blocks": [
    {
      "id": "block-1",
      "type": "HeroBlock",
      "visible": true,
      "order": 1,
      "props": {
        "title": "La mejor pastelería de Lima",
        "subtitle": "Repostería artesanal desde 1998",
        "imageUrl": "https://...",
        "ctaText": "Ver Carta",
        "ctaHref": "/menu",
        "layout": "image-right"
      }
    },
    {
      "id": "block-2",
      "type": "FeaturedDishesBlock",
      "visible": true,
      "order": 2,
      "props": {
        "title": "Nuestros Favoritos",
        "dishIds": ["dish-1", "dish-2", "dish-3"],
        "columns": 3
      }
    },
    {
      "id": "block-3",
      "type": "CTABannerBlock",
      "visible": true,
      "order": 3,
      "props": {
        "title": "¿Planeas un evento?",
        "subtitle": "Reserva tu mesa en 3 clics",
        "buttonText": "Reservar Ahora",
        "buttonHref": "/reservar",
        "bgStyle": "dark"
      }
    }
  ]
}
```

---

## Sección 3 — Tipos de Bloques Disponibles (pendiente)

### Bloques de página

| Bloque | Descripción | Props editables |
|---|---|---|
| `HeroBlock` | Banner principal con imagen y CTA | Título, subtítulo, imagen, CTA, layout (imagen izq/der/fondo) |
| `PillarsBlock` | 3 columnas de íconos + texto | Título, 3 items (ícono, título, texto) |
| `FeaturedDishesBlock` | Grid de platos destacados | Título, selección de platos, columnas |
| `CTABannerBlock` | Banner de llamada a acción | Título, subtítulo, botón, estilo (dark/light/accent) |
| `BranchesBlock` | Cards de sedes | Título, sedes seleccionadas |
| `TestimonialsBlock` | Reseñas de clientes | Array de testimonios (texto, autor, rating) |
| `GalleryBlock` | Galería de imágenes | Grid de fotos, columnas |
| `RichTextBlock` | Texto libre (Sobre nosotros, etc.) | Contenido HTML sanitizado |
| `ContactFormBlock` | Formulario de contacto | Campos visibles, email destino |
| `SpacerBlock` | Separador visual | Altura, estilo (línea/espacio) |

### Componentes globales (no son bloques, aplican a todo el sitio)

- **Header**: Logo, links de navegación, colores, botón CTA
- **Footer**: Columnas, links, redes sociales, copyright
- **Theme**: Colores primarios, fuentes, border-radius global

---

## Sección 4 — Builder UI (pendiente)

### Layout del builder

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: [← Volver] [Nombre del sitio] [Preview] [Publicar]    │
├───────────────────┬─────────────────────────────────────────────┤
│  PANEL IZQUIERDO  │              IFRAME PREVIEW                 │
│  (320px fijo)     │         (resto del ancho)                   │
│                   │                                             │
│  Tabs:            │   ┌─────────────────────────────────────┐  │
│  [Páginas][Theme] │   │                                     │  │
│                   │   │    Render del sitio en tiempo real  │  │
│  Lista de bloques │   │    con los cambios del draft        │  │
│  en la página     │   │                                     │  │
│  actual:          │   │                                     │  │
│                   │   └─────────────────────────────────────┘  │
│  ▼ Hero           │                                             │
│  ▼ Platos dest.   │   Controles de viewport:                   │
│  ▼ CTA Banner     │   [📱 Móvil] [💻 Tablet] [🖥 Desktop]      │
│                   │                                             │
│  [+ Añadir bloque]│                                             │
│                   │                                             │
│  Al seleccionar   │                                             │
│  un bloque →      │                                             │
│  muestra sus      │                                             │
│  props editables  │                                             │
└───────────────────┴─────────────────────────────────────────────┘
```

### Comunicación panel ↔ iframe

El panel y el iframe se comunican via `postMessage`:

```
Panel edita prop → postMessage({ type: 'UPDATE_BLOCK', blockId, props })
                 → iframe recibe y re-renderiza solo ese bloque
                 → sin reload completo (UX fluida)
```

---

## Sección 5 — Multi-Tenant Routing (pendiente)

### Next.js Middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  
  // Ignorar admin y API
  if (hostname === 'restrohub.com') return NextResponse.next()
  
  // Resolver tenant por dominio custom
  // → busca en DB/cache el tenant con customDomain = hostname
  // → inyecta tenantId en header para que las páginas lo lean
  request.headers.set('x-tenant-id', resolvedTenantId)
  return NextResponse.next()
}
```

### DNS y dominio custom

El restaurante apunta su dominio a RestroHub:
```
rauletti.com  →  CNAME  →  sites.restrohub.com
```

En el admin, el dueño configura su dominio y RestroHub verifica ownership via TXT record.

---

## Trabajo en Paralelo — Plan Acordado

| Stream | Descripción |
|---|---|
| **Stream A** (Builder) | Implementar el page builder + multi-tenant |
| **Stream B** (Admin UI) | Mejorar el admin panel actual (orders, dishes, branches) — independiente del builder |

Las mejoras al sitio público (homepage, menú, etc.) van dentro del Stream A como parte del sistema de bloques.

---

## Próximos Pasos

1. ✅ Aprobar secciones 2–5 del diseño
2. Escribir plan de implementación detallado
3. Comenzar implementación en paralelo (Stream A + Stream B)
