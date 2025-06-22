/*
  Warnings:

  - A unique constraint covering the columns `[correo]` on the table `Profesor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `correo` to the `Profesor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profesor" ADD COLUMN     "correo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_correo_key" ON "Profesor"("correo");
