-- CreateEnum
CREATE TYPE "RecurringCycle" AS ENUM ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "RecurringStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED');

-- CreateTable
CREATE TABLE "RecurringExpense" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "billingCycle" "RecurringCycle" NOT NULL DEFAULT 'MONTHLY',
    "firstBillingDate" TIMESTAMP(3) NOT NULL,
    "nextBillingDate" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    "assetId" TEXT,
    "status" "RecurringStatus" NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,
    "userId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringExpense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecurringExpense_userId_idx" ON "RecurringExpense"("userId");

-- CreateIndex
CREATE INDEX "RecurringExpense_userId_status_idx" ON "RecurringExpense"("userId", "status");

-- CreateIndex
CREATE INDEX "RecurringExpense_userId_nextBillingDate_idx" ON "RecurringExpense"("userId", "nextBillingDate");

-- CreateIndex
CREATE INDEX "RecurringExpense_userId_deletedAt_idx" ON "RecurringExpense"("userId", "deletedAt");

-- AddForeignKey
ALTER TABLE "RecurringExpense" ADD CONSTRAINT "RecurringExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringExpense" ADD CONSTRAINT "RecurringExpense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringExpense" ADD CONSTRAINT "RecurringExpense_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
