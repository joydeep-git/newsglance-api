/*
  Warnings:

  - The primary key for the `NewsData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `guardianId` on the `NewsData` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `NewsData` table. All the data in the column will be lost.
  - Added the required column `newsId` to the `NewsData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_newsId_fkey";

-- DropIndex
DROP INDEX "Bookmark_newsId_key";

-- DropIndex
DROP INDEX "NewsData_guardianId_key";

-- AlterTable
ALTER TABLE "NewsData" DROP CONSTRAINT "NewsData_pkey",
DROP COLUMN "guardianId",
DROP COLUMN "id",
ADD COLUMN     "newsId" TEXT NOT NULL,
ADD CONSTRAINT "NewsData_pkey" PRIMARY KEY ("newsId");

-- AlterTable
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("orderId");

-- DropIndex
DROP INDEX "Payment_orderId_key";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "NewsData"("newsId") ON DELETE CASCADE ON UPDATE CASCADE;
