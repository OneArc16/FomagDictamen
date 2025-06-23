/*
  Warnings:

  - You are about to drop the column `firmado` on the `Dictamen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dictamen" DROP COLUMN "firmado",
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'PENDIENTE';
