# prompt_opencode_frontend.md

> [!NOTE]
> Este archivo contiene el prompt ultra-optimizado centrado exclusivamente en el **Frontend y Diseño Visual (UI/UX)** de la plataforma Resto-CMS. Diseñado para ser ejecutado por un agente de desarrollo de IA (**openCode**).

---

# INSTRUCCIONES DE DESARROLLO FRONTEND: PLATAFORMA DE MENÚ, SEDES Y PEDIDOS (RESTO-CMS)

## 📋 CONTEXTO Y ROL
Actúas como un **Diseñador y Programador Frontend Senior** especializado en **Next.js (App Router), React, Tailwind CSS y animaciones fluidas**.
Tu objetivo es diseñar e implementar la interfaz del sitio público (Landing, Menú, Sedes, Reservas) y el panel administrador (Dashboard).

El frontend debe emular la experiencia premium y elegante de **Maria Almenara** utilizando los colores distintivos de **Rauletti**. Debe ser responsivo, rápido, accesible y contar con micro-interacciones suaves.

---

## 🎨 DISEÑO VISUAL Y SISTEMA DE ESTILOS

### 🌟 1. Paleta de Colores Exclusiva (Identidad Rauletti)
Debes configurar Tailwind CSS para incorporar la siguiente paleta de colores sofisticada:
*   **Fondo Principal (Lienzo):** Crema suave / Blanco roto cálido (`#FAF6F0` o `#FDFBF7`) que aporta una sensación artesanal, acogedora y de alta gama (evitar blanco puro frío).
*   **Color Primario (Vino/Guinda):** Borgoña / Guinda profundo (`#6B1A2A` o `#5C0618`) aplicado en botones de acción principal, encabezados destacados, enlaces importantes y estados seleccionados.
*   **Color Secundario / Acento (Oro Cálido):** Dorado ocre refinado (`#C5A059` o `#D4AF37`) utilizado para badges, bordes activos, iconos de realce, líneas de categoría activa y acentos ornamentales.
*   **Texto Principal:** Carbón marrón muy oscuro (`#2B1B1E` o `#1E1A1A`) para una lectura sumamente cómoda y sofisticada (evitar negro puro `#000`).
*   **Texto Secundario:** Marrón topo suave (`#6E5F61`) para descripciones secundarias y precios.

### 📐 2. Estilo y Arquitectura de UI (Identidad Maria Almenara)
*   **Header / Navegación Sticky:** Barra superior fija con fondo translúcido (`backdrop-blur-md bg-[#FAF6F0]/80`) y una sombra tenue. Incluye el logotipo estilizado y un botón de **Bolsa de Pedidos (Carrito)** en la esquina superior derecha con un contador redondo animado en color Oro Cálido.
*   **Categorías Deslizables (Sticky Category Slider):** En la página del menú, un menú horizontal fijo de categorías (`sticky top-[nav-height] z-40 bg-[#FAF6F0]/95`) con scroll horizontal fluido en móvil, iconos minimalistas y una barra inferior de color Oro Cálido que se desliza suavemente sobre la categoría activa.
*   **Tarjetas de Platos Ultra-redondeadas (Rounded Cards):** Esquinas extremadamente redondeadas (`rounded-3xl` o `rounded-[32px]`), fondo de tarjeta blanco puro contrastando con el fondo crema, bordes ultrafinos color dorado muy claro (`border border-[#C5A059]/15`), con sombras sutiles y elevación al pasar el mouse (`hover:-translate-y-1 hover:shadow-xl transition-all duration-300`).
*   **Imágenes Inmersivas:** El contenedor de la imagen del plato debe ocupar el 100% de la tarjeta con zoom lento al pasar el cursor (`scale-105 transition-transform duration-700 overflow-hidden`).
*   **Detalle en Drawer Lateral (Carrito y Platos):** Al hacer clic a un plato o al presionar la "Bolsa de Pedidos", debe deslizarse un panel lateral desde la derecha (Drawer) para añadir comentarios, ajustar cantidades o revisar el pedido actual de manera fluida sin salir del menú.

### ✍️ 3. Tipografía
*   **Títulos de Secciones / Nombres de Platos Destacados:** Serif de alta gama (`Playfair Display` o `Cinzel` mediante Google Fonts).
*   **Cuerpo de Texto, Descripciones y Formularios:** Sans-serif moderna e impecable (`Outfit` o `Inter`).

---

## 📂 PÁGINAS DEL SITIO PÚBLICO

### 1. Inicio (`/`)
*   **Hero Section:** Banner grande con fotografía de alta calidad, título y texto configurados dinámicamente desde el CMS.
*   **Botones Call to Action:** "Explorar Carta" (botón principal Guinda) y "Reservar en Sede" (botón secundario transparente con borde Oro).
*   **Nuestra Filosofía:** Sección elegante de introducción con tipografía serif grande y elementos visuales superpuestos.

### 2. Menú Digital (`/menu`)
*   **Pestañas de Categoría:** El slider horizontal fijado en la parte superior.
*   **Grilla de Productos:** Columnas adaptables (1 en móvil, 2 en tablet, 3 o 4 en desktop).
*   **Información del Plato:** Nombre del plato, descripción detallada, precio estilizado (ej. `S/. 24.90`), estado de disponibilidad ("Agotado" deshabilita el botón) y botón redondo elegante con icono de `Plus` (`+`) para agregar a la Bolsa de Pedidos.
*   **Bolsa de Pedidos (Carrito Integrado):** Permite ir sumando cantidades y guarda temporalmente los items seleccionados en el `localStorage` o en un estado de React.

### 3. Sedes (`/sedes`)
*   **Grid de Cards de Sedes:** Cada tarjeta incluye una hermosa foto de la fachada de la sede, nombre destacado, dirección exacta con botón "Cómo llegar" (enlace a Google Maps), y un colapsable estético para desplegar el horario día por día.
*   **Contacto Directo:** Botón de llamada telefónica directa y botón verde de WhatsApp con icono.

### 4. Reservas / Checkout (`/reservar`)
*   **Resumen de la Bolsa de Pedidos:** Listado de platos elegidos, permitiendo editar cantidades o remover platos antes de enviar el formulario.
*   **Formulario de Datos:** Inputs estilizados y con validación en tiempo real para: Nombre completo, Teléfono de contacto, Sede de preferencia (dropdown dinámico de sedes activas), Fecha, Hora, Cantidad de personas y Notas.
*   **Pantalla de Confirmación:** Tras enviar con éxito el formulario, el usuario es redirigido a una página de éxito que muestra un botón grande: **"Finalizar Confirmación por WhatsApp"** que abre el enlace retornado por la API con el texto formateado.

---

## 🛡️ INTERFAZ DEL PANEL ADMINISTRADOR (Dashboard)

El diseño del panel debe ser limpio, en modo claro con contrastes elegantes, ordenado y pensado para pantallas de laptop y tablet.

### 📁 Vistas del Panel Administrador
1.  **Inicio de Sesión (`/admin/login`):**
    *   Formulario centrado y elegante, con fondo blanco crema, bordes redondeados amplios y sombras.
2.  **Layout General del Panel (`/admin/*`):**
    *   Barra lateral de navegación (Sidebar) retráctil en color Guinda oscuro con iconos minimalistas en dorado suave.
    *   Barra superior con saludo al usuario y botón estético para "Cerrar Sesión".
3.  **Dashboard Principal (`/admin`):**
    *   Indicadores rápidos: Tarjetas con bordes suaves que reportan pedidos del día, sedes activas y estado general.
    *   Lista de últimos pedidos recibidos con código de color según el estado (`Pendiente` -> Amarillo, `Confirmado` -> Azul, `En preparación` -> Naranja, `Entregado` -> Verde, `Cancelado` -> Rojo).
4.  **Gestor de Categorías (`/admin/categories`):**
    *   Formulario rápido para añadir categorías.
    *   Lista de categorías existentes con botones de flecha (Arriba / Abajo) para ordenar la visualización en el menú público.
5.  **Gestor de Platos (`/admin/dishes`):**
    *   Buscador interactivo y selector de categoría para filtrado rápido.
    *   Tabla responsiva de platos con previsualización de imágenes redondas, precio, categoría y un interruptor (switch) rápido para activar/desactivar la disponibilidad de stock en el sitio público.
6.  **Gestor de Sedes (`/admin/branches`):**
    *   Listado de sedes. Formulario de creación con selectores de horas (de apertura a cierre) organizados por cada día de la semana de forma sumamente sencilla para el usuario final.
7.  **Centro de Control de Pedidos (`/admin/orders`):**
    *   Filtros visuales por sede, fecha y estado del pedido.
    *   Acceso detallado en modal o cajón lateral del pedido mostrando los platos seleccionados, subtotales, notas de preparación y datos completos del cliente.
    *   Botón de cambio rápido de estado.
8.  **Personalización del CMS (`/admin/settings`):**
    *   Campos para modificar textos de cabecera, logo, número de contacto general, enlaces a redes sociales y metatags SEO directamente.

---

## 🚀 PASOS DE IMPLEMENTACIÓN FRONTEND (Checklist)

* [ ] **Configurar Tailwind CSS:** Añadir la paleta de colores de **Rauletti** y cargar las fuentes tipográficas `Playfair Display` y `Outfit` de Google Fonts.
* [ ] **Maquetar el Layout Público:** Crear el Header Sticky con el botón flotante del carrito animado y el Footer con la información general de contacto.
* [ ] **Crear Estado Global de la Bolsa de Pedidos:** Programar un contexto de React (`CartContext`) o Zustand para almacenar, actualizar y eliminar platos de la bolsa, guardando el estado en `localStorage`.
* [ ] **Desarrollar Página de Menú (`/menu`):** Diseñar el slider horizontal de categorías y la grilla de platos ultra-redondeados con transiciones fluidas.
* [ ] **Implementar el Drawer de Detalles / Carrito:** Maquetar la barra lateral derecha que se despliega suavemente mostrando los platos seleccionados, subtotales y el enlace para ir a reservar.
* [ ] **Desarrollar Páginas de Sedes e Inicio:** Crear las tarjetas de sedes con los colapsables de horarios semanales e integrar el mapa interactivo de Google Maps.
* [ ] **Desarrollar Formulario de Reserva (`/reservar`):** Implementar la vista del formulario integrado con la lista de platos de la Bolsa de Pedidos y la pantalla de éxito con el botón final para abrir la API de WhatsApp.
* [ ] **Maquetar el Panel Administrador:** Desarrollar el Sidebar responsivo y las pantallas CRUD de categorías, platos, sedes, pedidos y ajustes de marca del CMS.
