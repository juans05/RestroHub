-- AlterTable
ALTER TABLE "SystemConfig" ADD COLUMN     "accentColor" TEXT NOT NULL DEFAULT '#FF6B9D',
ADD COLUMN     "fontBody" TEXT NOT NULL DEFAULT 'Nunito',
ADD COLUMN     "fontDisplay" TEXT NOT NULL DEFAULT 'Fredoka',
ALTER COLUMN "primaryColor" SET DEFAULT '#E8621A',
ALTER COLUMN "secondaryColor" SET DEFAULT '#C94E0F';
