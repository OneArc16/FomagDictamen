-- AlterTable
ALTER TABLE "Dictamen" ADD COLUMN     "firmado" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "contenido" DROP NOT NULL;
