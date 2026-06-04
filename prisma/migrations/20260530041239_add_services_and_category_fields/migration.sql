-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "colorFrom" TEXT NOT NULL DEFAULT 'from-primary/40',
ADD COLUMN     "colorTo" TEXT NOT NULL DEFAULT 'to-accent/40',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
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

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
