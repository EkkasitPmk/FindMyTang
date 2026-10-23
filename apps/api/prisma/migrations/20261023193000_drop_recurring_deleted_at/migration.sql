-- DropIndex
DROP INDEX IF EXISTS "RecurringExpense_userId_deletedAt_idx";

-- AlterTable
ALTER TABLE "RecurringExpense" DROP COLUMN IF EXISTS "deletedAt";
