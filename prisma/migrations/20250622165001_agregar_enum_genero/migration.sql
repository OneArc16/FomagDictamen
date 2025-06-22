/*
  Warnings:

  - Added the required column `genero` to the `Profesor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- AlterTable
ALTER TABLE "Profesor" ADD COLUMN     "genero" "Genero" NOT NULL;
