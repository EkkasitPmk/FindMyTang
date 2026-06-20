/*
  Warnings:

  - You are about to drop the column `currency` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SyncLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransactionAttachment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "SyncLog" DROP CONSTRAINT "SyncLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionAttachment" DROP CONSTRAINT "TransactionAttachment_transactionId_fkey";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "currency",
DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "attachmentUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'th',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Bangkok';

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "SyncLog";

-- DropTable
DROP TABLE "TransactionAttachment";
