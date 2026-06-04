-- AlterTable
ALTER TABLE "SystemConfig" ADD COLUMN     "animationSpeed" TEXT NOT NULL DEFAULT 'normal',
ADD COLUMN     "animationsEnabled" BOOLEAN NOT NULL DEFAULT true;
