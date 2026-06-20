-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastSyncStatus" TEXT,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3);
