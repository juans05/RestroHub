# Design System: Pastelería Divertida

## Visión
RestoCMS con un diseño visual cálido, divertido y totalmente personalizable. La plataforma permite que propietarios de pastelerías y restaurantes creen experiencias únicas sin tocar código.

---

## Color Palette (Rauletti Naranja - Default)

### Core Colors
| Color | Hex | RGB | Uso |
|-------|-----|-----|-----|
| **Primario (Naranja Cálido)** | #E8621A | rgb(232, 98, 26) | Botones, CTA, encabezados activos |
| **Primario Dark** | #C94E0F | rgb(201, 78, 15) | Hover, estados activos |
| **Acento (Rosa)** | #FF6B9D | rgb(255, 107, 157) | Detalles, badges, highlights |
| **Acento Secundario** | #F5B942 | rgb(245, 185, 66) | Enlaces, subrayados |

### Neutrals
| Color | Hex | RGB | Uso |
|-------|-----|-----|-----|
| **Canvas (Crema)** | #FFF5EF | rgb(255, 245, 239) | Fondo principal |
| **Card (Crema Blanca)** | #FFFBF7 | rgb(255, 251, 247) | Tarjetas, superficies |
| **Charcoal (Oscuro)** | #2B1B1E | rgb(43, 27, 30) | Texto principal |
| **Charcoal Light** | #6E5F61 | rgb(110, 95, 97) | Texto secundario |

---

## Typography

### Display Font: **Fredoka**
- **Peso**: 400, 500, 600, 700
- **Uso**: Títulos, headings, destacados
- **Personalidad**: Redondeada, juguetona, amigable
- **Alternativas disponibles**: Lobster, Poppins, Pacifico

### Body Font: **Nunito**
- **Peso**: 300, 400, 500, 600, 700
- **Uso**: Párrafos, etiquetas, navegación
- **Personalidad**: Legible, moderna, cálida
- **Alternativas disponibles**: Quicksand, Open Sans

### Scale
```
h1: 48px - 96px (clamp)
h2: 36px - 64px (clamp)
h3: 28px - 48px (clamp)
Body: 14px - 16px
Small: 12px - 14px
```

---

## Component Library

### Buttons
- **Primary**: bg-primary text-white, hover:bg-primary-dark
- **Secondary**: bg-accent text-charcoal, hover:bg-accent/90
- **Outline**: border border-primary text-primary

### Cards
- Rounded: 24px - 32px
- Border: 1px solid border-accent/15
- Padding: 24px (2rem)
- Shadow: subtle (hover:shadow-lg)

### Forms
- Input height: 44px minimum (touch target)
- Border radius: 12px
- Focus state: border-primary, shadow-sm

### Spacing Scale
```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
2xl: 32px
3xl: 48px
```

---

## Theme System (Admin-Configurable)

### Available Presets

#### 🍊 Rauletti Naranja (Default)
- Primary: #E8621A
- Accent: #FF6B9D
- Personalidad: Divertido, cálido, pastelería moderna

#### 🍷 Clásica Burdeos
- Primary: #6B1A2A
- Accent: #C5A059
- Personalidad: Elegante, premium, tradicional

#### ☕ Café Moderno
- Primary: #5C4033
- Accent: #A8C5A0
- Personalidad: Bistró, contemporáneo, acogedor

#### 🌸 Rosa Dulce
- Primary: #D63384
- Accent: #FFD700
- Personalidad: Femenino, delicado, pastelería gourmet

#### 🌿 Verde Natural
- Primary: #2D6A4F
- Accent: #F5B942
- Personalidad: Orgánico, saludable, eco-conscious

### Customization
Desde **Ajustes CMS** → **Tipografía & Tema Visual**, el admin puede:
- Seleccionar un preset predefinido
- Cambiar Color Primario (botones, títulos)
- Cambiar Color Acento (detalles, badges)
- Cambiar Fuente de Títulos (Fredoka, Lobster, Poppins, Pacifico)
- Cambiar Fuente de Cuerpo (Nunito, Quicksand, Open Sans)

Los cambios se aplican en **tiempo real** sin recargar.

---

## Motion & Animation

### Transition Timing
- Default: 300ms cubic-bezier(0.4, 0, 0.2, 1) (ease-in-out)
- Fast: 150ms-200ms
- Slow: 400ms-500ms

### Animation Types
- **Fade In**: opacity 0 → 1
- **Scale In**: scale 0.9 → 1 (bounce subtle)
- **Slide**: translateX/translateY
- **Reduced Motion**: Respeta `prefers-reduced-motion: reduce`

### Micro-interactions
- Botones: hover scale 1.05, active scale 0.98
- Cards: hover shadow-lg, translate-y -2px
- Badges: appear con scale-in suave

---

## Responsive Design

### Breakpoints
```
mobile: 0px
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Touch Targets
- Mínimo: 44px × 44px
- Óptimo: 48px × 48px
- Spacing: 8px mínimo entre targets

### Layout Patterns
- **Mobile First**: Diseño adapta de mobile → desktop
- **Flexible Grids**: `repeat(auto-fit, minmax(280px, 1fr))`
- **Max-width**: Contenedores limitados a 1280px (7xl)

---

## Accessibility

### WCAG AA Compliance
- Contraste mínimo: 4.5:1 (texto normal)
- Contraste: 3:1 (texto grande ≥18px)
- Focus indicators: Visible 2px outline
- Keyboard navigation: Tab, Enter, Escape funcionan en todo

### Color Blindness
- Paleta verificada para deuteranopia/protanopia
- No dependemos de color solo para significado
- Icons + color para estado/acción

---

## Files & Implementation

### Core Files
- `src/app/globals.css` - CSS variables, tokens, animations
- `src/lib/theme.ts` - Theme builder y aplicador
- `src/components/ThemeSync.tsx` - Real-time sync en cliente
- `src/app/layout.tsx` - Server-side theme injection
- `src/app/admin/settings/page.tsx` - Admin panel de temas

### Database
- `prisma/schema.prisma` - SystemConfig model con campos de tema
- `prisma/migrations/20260530022349_add_theme_fields/` - Migration applied

---

## Dev Notes

- **Next.js 16 + Tailwind CSS 4**: Usa `@theme` para tokens dinámicos
- **CSS Variables** `:root` se inyectan server-side y se actualizan en cliente
- **No compilación requerida**: Los cambios de color se aplican dinámicamente sin rebuild
- **Fallback**: Si DATABASE_URL no existe, usa mockDB (localStorage) con defaults
