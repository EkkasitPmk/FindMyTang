-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "timezone",
ALTER COLUMN "language" SET DEFAULT 'en';

-- CreateIndex
CREATE INDEX "Asset_userId_idx" ON "Asset"("userId");

-- CreateIndex
CREATE INDEX "Asset_userId_deletedAt_idx" ON "Asset"("userId", "deletedAt");

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE INDEX "Category_userId_deletedAt_idx" ON "Category"("userId", "deletedAt");

-- CreateIndex
CREATE INDEX "Category_userId_type_idx" ON "Category"("userId", "type");

-- CreateIndex
CREATE INDEX "Transaction_categoryId_idx" ON "Transaction"("categoryId");

-- CreateIndex
CREATE INDEX "Transaction_userId_date_idx" ON "Transaction"("userId", "date" DESC);

-- CreateIndex
CREATE INDEX "Transaction_userId_deletedAt_idx" ON "Transaction"("userId", "deletedAt");
