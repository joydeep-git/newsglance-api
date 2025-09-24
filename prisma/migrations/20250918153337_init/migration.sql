/*
  Warnings:

  - Made the column `defaultCountry` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_avatarId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "avatarId" DROP NOT NULL,
ALTER COLUMN "defaultCountry" SET NOT NULL,
ALTER COLUMN "defaultCountry" SET DEFAULT 'IN';

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
