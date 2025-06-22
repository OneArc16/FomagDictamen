/*
  Warnings:

  - Added the required column `apellido` to the `Profesor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profesor_correo_key";

-- AlterTable
ALTER TABLE "Profesor" ADD COLUMN     "apellido" TEXT NOT NULL;
