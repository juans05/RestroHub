-- AlterTable
ALTER TABLE "SystemConfig" ADD COLUMN     "ctaButton" TEXT DEFAULT 'Comenzar Pedido',
ADD COLUMN     "ctaText" TEXT DEFAULT 'Pide online, recoge en tienda o pídelo a domicilio.',
ADD COLUMN     "ctaTitle" TEXT DEFAULT '¿Lista para el mejor postre?',
ADD COLUMN     "navLinks" JSONB NOT NULL DEFAULT '[{"label":"Menú","href":"/menu"},{"label":"Sedes","href":"/branches"},{"label":"Reservar","href":"/reservations"}]';

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);
