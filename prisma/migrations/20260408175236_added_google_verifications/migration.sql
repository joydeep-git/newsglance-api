-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isGoogle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNumVerified" BOOLEAN NOT NULL DEFAULT true;
