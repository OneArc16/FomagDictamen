/*
  Warnings:

  - You are about to drop the column `edad` on the `Profesor` table. All the data in the column will be lost.
  - Added the required column `fechaNacimiento` to the `Profesor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profesor" DROP COLUMN "edad",
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3) NOT NULL;
