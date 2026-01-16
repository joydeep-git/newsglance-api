/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guardianId]` on the table `NewsData` will be added. If there are existing duplicate values, this will fail.
  - Made the column `avatarId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_newsId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Payment" ALTER COLUMN "provider" SET DEFAULT 'dodopay';

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "avatarId" SET NOT NULL,
ALTER COLUMN "avatarId" SET DEFAULT 'cmjzooxly00003hnzan79m85n';

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "public"."Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_newsId_idx" ON "public"."Comment"("newsId");

-- CreateIndex
CREATE UNIQUE INDEX "File_url_key" ON "public"."File"("url");

-- CreateIndex
CREATE UNIQUE INDEX "NewsData_guardianId_key" ON "public"."NewsData"("guardianId");

-- CreateIndex
CREATE INDEX "NewsData_audioFileId_idx" ON "public"."NewsData"("audioFileId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "public"."Payment"("userId");

-- CreateIndex
CREATE INDEX "User_avatarId_idx" ON "public"."User"("avatarId");

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "public"."NewsData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
