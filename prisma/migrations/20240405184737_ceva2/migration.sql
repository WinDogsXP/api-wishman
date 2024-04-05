/*
  Warnings:

  - Added the required column `method` to the `Endpoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Endpoint" ADD COLUMN     "method" TEXT NOT NULL;
