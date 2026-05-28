# prompt_opencode_backend.md

> [!NOTE]
> Este archivo contiene el prompt ultra-optimizado centrado exclusivamente en el **Backend y Base de Datos** de la plataforma Resto-CMS. Diseñado para ser ejecutado por un agente de desarrollo de IA (**openCode**).

---

# INSTRUCCIONES DE DESARROLLO BACKEND: PLATAFORMA DE MENÚ, SEDES Y PEDIDOS (RESTO-CMS)

## 📋 CONTEXTO Y ROL
Actúas como un **Ingeniero de Software Backend Senior** especializado en **Next.js (API Routes/Route Handlers), TypeScript, Prisma ORM, PostgreSQL y servicios cloud**.
Tu objetivo es desarrollar la base de datos completa, los modelos de datos, la autenticación segura del administrador, las APIs de administración y las rutas de procesamiento de reservas para el sitio público.

Debes garantizar que todas las APIs sean eficientes, robustas, manejen correctamente los códigos de estado HTTP, validen los datos de entrada y utilicen TypeScript estricto.

---

## 🛠️ STACK TECNOLÓGICO DEL BACKEND
*   **Lenguaje y Framework:** Next.js (Route Handlers en App Router con TypeScript)
*   **Base de Datos:** PostgreSQL
*   **ORM:** Prisma
*   **Autenticación:** Sesión basada en Cookies seguras (JWT o NextAuth/Auth.js)
*   **Almacenamiento de Imágenes:** Integración con Cloudinary (o almacenamiento en Base64 local/S3 configurable en `.env`)
*   **Notificaciones:** Resend (Envío automatizado de correos electrónicos) y formateo de datos para mensajería de WhatsApp.

---

## 🗄️ ESQUEMA DE BASE DE DATOS (Prisma Model)

Crea e implementa el siguiente esquema en `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. Categorías del Menú
model Category {
  id        String   @id @default(uuid())
  name      String   @unique
  slug      String   @unique
  order     Int      @default(0) // Controla el orden de aparición en el menú
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  dishes    Dish[]
}

// 2. Platos / Productos del Menú
model Dish {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  imageUrl    String?
  isActive    Boolean  @default(true)
  isAvailable Boolean  @default(true) // Indicador de disponible / agotado
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  order       Int      @default(0) // Controla el orden dentro de la categoría
}

// 3. Sedes de la Empresa
model Branch {
  id          String   @id @default(uuid())
  name        String
  imageUrl    String?
  address     String
  phone       String   // Teléfono o WhatsApp directo de la sede
  hours       Json     // Objeto JSON con horario semanal: { "lun": "09:00 - 22:00", ... }
  mapsUrl     String?  // Link de Google Maps
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orders      Order[]
}

// 4. Pedidos y Reservas
model Order {
  id            String      @id @default(uuid())
  customerName  String
  customerPhone String
  branchId      String
  branch        Branch      @relation(fields: [branchId], references: [id])
  eventDate     DateTime
  eventTime     String
  peopleCount   Int
  status        OrderStatus @default(PENDIENTE)
  notes         String?     // Comentarios/indicaciones adicionales
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  items         OrderItem[]
}

model OrderItem {
  id       String   @id @default(uuid())
  orderId  String
  order    Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  dishName String   // Guardamos el nombre para que persista aunque el plato se elimine
  quantity Int
  price    Decimal  @db.Decimal(10, 2)
}

enum OrderStatus {
  PENDIENTE
  CONFIRMADO
  EN_PREPARACION
  ENTREGADO
  CANCELADO
}

// 5. Configuración General (CMS)
model SystemConfig {
  id            String   @id @default("global_config")
  logoUrl       String?
  businessName  String   @default("Mi Restaurante")
  description   String?
  primaryColor  String   @default("#FF5733") // Color principal de identidad
  secondaryColor String  @default("#1A1A1A")
  whatsapp      String?
  email         String?
  instagram     String?
  facebook      String?
  bannerTitle   String?  @default("Sabores que Enamoran")
  bannerText    String?  @default("Descubre nuestra carta y reserva en tu sede favorita.")
  seoTitle      String   @default("Mi Restaurante - Menú y Reservas")
  seoDescription String  @default("Disfruta de la mejor gastronomía y realiza tus pedidos en línea.")
  updatedAt     DateTime @updatedAt
}

// 6. Administrador
model AdminUser {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hash de la contraseña (bcrypt)
  name      String?
  createdAt DateTime @default(now())
}
```

---

## 🌐 ESPECIFICACIONES DE LAS RUTAS API (Endpoints)

Todas las respuestas deben tener formato JSON. Las rutas `/api/admin/*` deben requerir obligatoriamente autenticación mediante middleware o verificación del token de sesión.

### 🔑 1. Autenticación (`/api/auth`)
*   `POST /api/auth/login`:
    *   **Body:** `{ "email": "...", "password": "..." }`
    *   **Acción:** Valida credenciales, crea un token JWT firmado y lo establece en una cookie httpOnly segura (`token`).
*   `POST /api/auth/logout`:
    *   **Acción:** Expira y elimina la cookie del token de sesión.
*   `GET /api/auth/session`:
    *   **Acción:** Verifica la cookie y retorna la información básica del administrador autenticado.

### 🗂️ 2. Categorías (`/api/admin/categories`)
*   `GET`: Devuelve la lista completa de categorías ordenada por el campo `order`.
*   `POST`: Crea una nueva categoría. Genera automáticamente el `slug` a partir del nombre.
*   `PUT /api/admin/categories/[id]`: Actualiza nombre, slug y número de orden.
*   `DELETE /api/admin/categories/[id]`: Elimina la categoría y sus platos en cascada.

### 🍔 3. Platos (`/api/admin/dishes`)
*   `GET`: Lista todos los platos. Admite query parameter `?categoryId=...` para filtrar.
*   `POST`: Crea un plato asociado a una categoría válida.
*   `PUT /api/admin/dishes/[id]`: Actualiza los campos del plato, incluyendo el estado de disponibilidad y el orden.
*   `DELETE /api/admin/dishes/[id]`: Elimina el plato de la base de datos.

### 📍 4. Sedes (`/api/admin/branches`)
*   `GET`: Lista todas las sedes registradas.
*   `POST`: Registra una nueva sede con su estructura de horarios semanal (JSON).
*   `PUT /api/admin/branches/[id]`: Edita los datos de la sede.
*   `DELETE /api/admin/branches/[id]`: Elimina físicamente la sede.

### 📝 5. Pedidos y Reservas (`/api/public/orders` & `/api/admin/orders`)
*   `POST /api/public/orders` (Ruta Pública):
    *   **Body esperado:**
        ```json
        {
          "customerName": "Juan Pérez",
          "customerPhone": "+51987654321",
          "branchId": "uuid-de-la-sede",
          "eventDate": "2026-06-15T00:00:00.000Z",
          "eventTime": "20:30",
          "peopleCount": 4,
          "notes": "Mesa cerca de la ventana",
          "dishes": [
            { "id": "uuid-plato-1", "quantity": 2 },
            { "id": "uuid-plato-2", "quantity": 1 }
          ]
        }
        ```
    *   **Lógica Backend:**
        1.  Validar la existencia de la sede y que esté activa.
        2.  Guardar el registro de `Order`.
        3.  Consultar los nombres y precios actuales de los platos seleccionados para insertar en la tabla intermedia `OrderItem` con la cantidad elegida.
        4.  Generar una notificación de correo al administrador usando **Resend** (con el resumen del pedido).
        5.  **Construir y Retornar el Enlace de WhatsApp:** Retornar en la respuesta un enlace de API de WhatsApp codificado con el teléfono de la sede y un mensaje formateado como este:
            ```text
            https://api.whatsapp.com/send?phone=TELEFONO_SEDE&text=Hola%20*SEDE*,%20quiero%20confirmar%20mi%20reserva.%0A%0A*Cliente:*%20Juan%20Perez%0A*Fecha:*%2015/06/2026%0A*Hora:*%2020:30%0A*Personas:*%204%0A*Platos:*%202x%20Plato1,%201x%20Plato2.%0A*Notas:*%20Mesa%20cerca%20de%20la%20ventana
            ```
*   `GET /api/admin/orders` (Ruta Protegida):
    *   **Query Params:** `?branchId=...&status=...&date=...`
    *   **Acción:** Lista los pedidos con filtros aplicados y precarga la relación con `Branch` e `OrderItem`.
*   `PATCH /api/admin/orders/[id]` (Ruta Protegida):
    *   **Body:** `{ "status": "CONFIRMADO" }`
    *   **Acción:** Actualiza la columna `status` del pedido en base de datos.

### ⚙️ 6. Configuración CMS (`/api/admin/settings`)
*   `GET /api/public/settings` (Ruta Pública): Retorna la información de colores, logo y SEO para pintar el frontend.
*   `PUT /api/admin/settings` (Ruta Protegida): Actualiza los colores principales, datos de contacto, banner de bienvenida y metatags de SEO dinámico.

---

## 💾 CONFIGURACIÓN DE ENTORNOS (`.env.example`)

Asegúrate de documentar y crear un archivo `.env` con las variables requeridas:

```env
# 1. Base de datos (PostgreSQL)
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/restocms?schema=public"

# 2. Seguridad y JWT
JWT_SECRET="un_secreto_robusto_para_firmar_tokens_jwt"
ADMIN_DEFAULT_EMAIL="admin@restocms.com"
ADMIN_DEFAULT_PASSWORD="PasswordSeguro123!"

# 3. Cloudinary (Imágenes)
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"

# 4. Resend (Email)
RESEND_API_KEY="re_123456789"
NOTIFICATION_EMAIL_TO="admin@restocms.com"
NOTIFICATION_EMAIL_FROM="pedidos@tu-dominio.com"
```

---

## 🚀 PASOS DE IMPLEMENTACIÓN BACKEND (Checklist)

Sigue esta secuencia para levantar el backend paso a paso:

* [ ] **Inicializar Prisma:** Configurar el archivo `schema.prisma` con las tablas descritas.
* [ ] **Crear Base de Datos & Migración:** Ejecutar `npx prisma migrate dev --name init` para mapear el esquema a PostgreSQL.
* [ ] **Script de Semilla (Seed):** Crear `prisma/seed.ts` para poblar la base de datos con el primer usuario administrador (encriptando contraseña usando `bcryptjs`) y la configuración `SystemConfig` por defecto.
* [ ] **Configurar Auth API & Middleware:** Implementar las APIs de `/api/auth/*` utilizando cookies seguras httpOnly y crear el Middleware de Next.js para interceptar y proteger todas las rutas que comiencen con `/api/admin/*`.
* [ ] **Desarrollar CRUDs Administrativos:** Implementar las Route Handlers de Categorías, Platos y Sedes. Integrar validaciones robustas (Zod).
* [ ] **Crear Ruta de Recepción de Pedidos:** Implementar el `POST /api/public/orders`. Incluir la lógica transaccional de Prisma para insertar `Order` y sus `OrderItem` de manera atómica, y el formateador de URL de WhatsApp.
* [ ] **Integrar Envío de Emails (Resend):** Configurar el envío automático por correo electrónico a la dirección especificada en la configuración.
