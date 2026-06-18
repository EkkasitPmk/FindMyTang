/*
  Warnings:

  - The values [CREDIT_CARD] on the enum `AssetType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `firstName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AssetType_new" AS ENUM ('CASH', 'BANK', 'E_WALLET', 'INVESTMENT', 'CRYPTO', 'OTHER');
ALTER TABLE "Asset" ALTER COLUMN "type" TYPE "AssetType_new" USING ("type"::text::"AssetType_new");
ALTER TYPE "AssetType" RENAME TO "AssetType_old";
ALTER TYPE "AssetType_new" RENAME TO "AssetType";
DROP TYPE "public"."AssetType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'ADJUSTMENT';

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "color" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'THB',
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'th',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Bangkok';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "toAssetId" TEXT;

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_assetId_idx" ON "Transaction"("assetId");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAssetId_fkey" FOREIGN KEY ("toAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
