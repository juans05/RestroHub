/*
  Warnings:

  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Slider" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'HERO';

-- AlterTable
ALTER TABLE "SystemConfig" ADD COLUMN     "bestsellersDescription" TEXT NOT NULL DEFAULT 'Las recetas clásicas más solicitadas. Probadas y aprobadas por nuestros clientes.',
ADD COLUMN     "bestsellersTagline" TEXT NOT NULL DEFAULT 'Bestsellers',
ADD COLUMN     "bestsellersTitle" TEXT NOT NULL DEFAULT 'Antojos Más Aclamados',
ADD COLUMN     "branchesDescription" TEXT NOT NULL DEFAULT 'Encuentra la sucursal más cercana a ti.',
ADD COLUMN     "branchesTagline" TEXT NOT NULL DEFAULT 'Visítanos',
ADD COLUMN     "branchesTitle" TEXT NOT NULL DEFAULT 'Nuestras Sedes',
ADD COLUMN     "categoriesTagline" TEXT NOT NULL DEFAULT 'Catálogo Completo',
ADD COLUMN     "categoriesTitle" TEXT NOT NULL DEFAULT 'Explora Nuestras Categorías',
ADD COLUMN     "servicesDescription" TEXT NOT NULL DEFAULT 'Servicios personalizados para cada ocasión. Desde tu fiesta más especial hasta las celebraciones de tu empresa.',
ADD COLUMN     "servicesTagline" TEXT NOT NULL DEFAULT 'Servicios Especiales',
ADD COLUMN     "servicesTitle" TEXT NOT NULL DEFAULT 'Más allá de lo ordinario';

-- DropTable
DROP TABLE "Feature";
