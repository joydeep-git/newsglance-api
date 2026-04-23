-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('image', 'audio');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCESS', 'FAILED', 'PENDING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "planExpiryDate" TIMESTAMP(3),
    "newsBalance" INTEGER NOT NULL DEFAULT 2,
    "audioBalance" INTEGER NOT NULL DEFAULT 2,
    "isGoogle" BOOLEAN NOT NULL DEFAULT false,
    "isNumVerified" BOOLEAN NOT NULL DEFAULT true,
    "defaultCountry" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileSize" DOUBLE PRECISION NOT NULL,
    "type" "FileType" NOT NULL,
    "duration" DOUBLE PRECISION,
    "isDefaultFile" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "newsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("userId","newsId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "NewsData" (
    "newsId" TEXT NOT NULL,
    "summarization" TEXT,
    "audioFileId" TEXT,

    CONSTRAINT "NewsData_pkey" PRIMARY KEY ("newsId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "User_avatarId_idx" ON "User"("avatarId");

-- CreateIndex
CREATE UNIQUE INDEX "File_url_key" ON "File"("url");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "NewsData_audioFileId_idx" ON "NewsData"("audioFileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsData" ADD CONSTRAINT "NewsData_audioFileId_fkey" FOREIGN KEY ("audioFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
