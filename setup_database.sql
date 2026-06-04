-- ===================================
-- SCRIPT SQL COMPLETO - RESTAURANTE BD
-- ===================================

-- Crear ENUM para OrderStatus
CREATE TYPE "OrderStatus" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO');

-- Tabla Category
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "order" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "description" TEXT,
    "colorFrom" TEXT NOT NULL DEFAULT 'from-primary/40',
    "colorTo" TEXT NOT NULL DEFAULT 'to-accent/40',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

-- Tabla Dish
CREATE TABLE "Dish" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla Branch
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "hours" JSONB NOT NULL,
    "mapsUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

-- Tabla Order
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventTime" TEXT NOT NULL,
    "peopleCount" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDIENTE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla OrderItem
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "dishName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla SystemConfig (Configuración Global)
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL DEFAULT 'global_config',
    "logoUrl" TEXT,
    "businessName" TEXT NOT NULL DEFAULT 'Rauletti & Co.',
    "description" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#E8621A',
    "secondaryColor" TEXT NOT NULL DEFAULT '#C94E0F',
    "accentColor" TEXT NOT NULL DEFAULT '#FF6B9D',
    "fontDisplay" TEXT NOT NULL DEFAULT 'Fredoka',
    "fontBody" TEXT NOT NULL DEFAULT 'Nunito',
    "animationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "animationSpeed" TEXT NOT NULL DEFAULT 'normal',
    "currencySymbol" TEXT NOT NULL DEFAULT 'S/',
    "phone" TEXT,
    "address" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'America/Lima',
    "whatsapp" TEXT,
    "email" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "tiktok" TEXT,
    "bannerTitle" TEXT DEFAULT 'El arte de la repostería artesanal',
    "bannerText" TEXT DEFAULT 'Déjate enamorar por nuestras tortas, postres y bebidas exquisitas que preparamos con dedicación.',
    "seoTitle" TEXT NOT NULL DEFAULT 'Rauletti & Co. | Carta Digital de Repostería Fina',
    "seoDescription" TEXT NOT NULL DEFAULT 'Exquisita repostería artesanal con ingredientes premium. Reserva mesas y realiza pedidos en línea.',
    "maxPeoplePerReservation" INTEGER NOT NULL DEFAULT 20,
    "minOrderAdvanceHours" INTEGER,
    "ctaTitle" TEXT DEFAULT '¿Lista para el mejor postre?',
    "ctaText" TEXT DEFAULT 'Pide online, recoge en tienda o pídelo a domicilio.',
    "ctaButton" TEXT DEFAULT 'Comenzar Pedido',
    "navLinks" JSONB NOT NULL DEFAULT '[{"label":"Menú","href":"/menu"},{"label":"Sedes","href":"/branches"},{"label":"Reservar","href":"/reservations"}]',
    "servicesTagline" TEXT NOT NULL DEFAULT 'Servicios Especiales',
    "servicesTitle" TEXT NOT NULL DEFAULT 'Más allá de lo ordinario',
    "servicesDescription" TEXT NOT NULL DEFAULT 'Servicios personalizados para cada ocasión. Desde tu fiesta más especial hasta las celebraciones de tu empresa.',
    "categoriesTagline" TEXT NOT NULL DEFAULT 'Catálogo Completo',
    "categoriesTitle" TEXT NOT NULL DEFAULT 'Explora Nuestras Categorías',
    "bestsellersTagline" TEXT NOT NULL DEFAULT 'Bestsellers',
    "bestsellersTitle" TEXT NOT NULL DEFAULT 'Antojos Más Aclamados',
    "bestsellersDescription" TEXT NOT NULL DEFAULT 'Las recetas clásicas más solicitadas. Probadas y aprobadas por nuestros clientes.',
    "branchesTagline" TEXT NOT NULL DEFAULT 'Visítanos',
    "branchesTitle" TEXT NOT NULL DEFAULT 'Nuestras Sedes',
    "branchesDescription" TEXT NOT NULL DEFAULT 'Encuentra la sucursal más cercana a ti.',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

-- Tabla AdminUser
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

-- Tabla Slider
CREATE TABLE "Slider" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "ctaText" TEXT,
    "ctaHref" TEXT,
    "type" TEXT NOT NULL DEFAULT 'HERO',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

-- Tabla Feature
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'heart',
    "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

-- Tabla Service
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "icon" TEXT NOT NULL DEFAULT 'gift',
    "ctaText" TEXT,
    "ctaHref" TEXT,
    "badge" TEXT,
    "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

-- Tabla FAQ (Preguntas Frecuentes)
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

-- Crear índices
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- ===================================
-- FIN DEL SCRIPT
-- ===================================
