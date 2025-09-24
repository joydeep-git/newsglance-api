/*
  Warnings:

  - You are about to drop the column `deleteAt` on the `RevokedToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."RevokedToken" DROP COLUMN "deleteAt";
