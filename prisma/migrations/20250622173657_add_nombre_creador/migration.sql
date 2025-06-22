/*
  Warnings:

  - Added the required column `nombreCreador` to the `Profesor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profesor" ADD COLUMN     "nombreCreador" TEXT NOT NULL;
