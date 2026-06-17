/**
 * ponytail: self-check for createExpense business rules.
 * Run: npx ts-node --project tsconfig.json src/modules/transaction/__tests__/create-expense.selfcheck.ts
 *
 * This is a logic-level assertion check, not a full integration test.
 * It verifies the service throws on every business rule violation.
 */
import assert from "assert";
import { TransactionService } from "../services/transaction.service";
import { Decimal } from "@prisma/client/runtime/library";

// Minimal stubs that satisfy the service's dependency signatures
const makeStubAssetRepo = (overrides: any = {}) => ({
  findById: overrides.findById ?? (() => null),
  incrementBalance: () => {},
  decrementBalance: () => {},
  ...overrides,
});

const makeStubCategoryRepo = (overrides: any = {}) => ({
  findById: overrides.findById ?? (() => null),
  ...overrides,
});

const makeStubPrisma = () => ({
  $transaction: async (ops: any[]) => {
    const results = [];
    for (const op of ops) results.push(await op);
    return results;
  },
  transaction: {
    create: async (args: any) => ({ id: "tx-1", ...args.data }),
  },
  asset: {
    update: async (args: any) => ({ id: args.where.id }),
  },
});

const baseDto = {
  assetId: "asset-1",
  categoryId: "cat-1",
  amount: 100,
  transactionDate: "2026-06-17T12:00:00.000Z",
};

async function run() {
  // 1. Asset not found
  {
    const svc = new TransactionService(
      {} as any,
      makeStubAssetRepo() as any,
      makeStubCategoryRepo() as any,
      makeStubPrisma() as any,
    );
    await assert.rejects(
      () => svc.createExpense("user-1", baseDto),
      /Asset not found/,
    );
    console.log("✓ Asset not found");
  }

  // 2. Asset not owned by user
  {
    const svc = new TransactionService(
      {} as any,
      makeStubAssetRepo({
        findById: () => ({
          id: "asset-1",
          userId: "other-user",
          balance: new Decimal(1000),
        }),
      }) as any,
      makeStubCategoryRepo() as any,
      makeStubPrisma() as any,
    );
    await assert.rejects(
      () => svc.createExpense("user-1", baseDto),
      /do not own this asset/,
    );
    console.log("✓ Asset ownership check");
  }

  // 3. Category not found
  {
    const svc = new TransactionService(
      {} as any,
      makeStubAssetRepo({
        findById: () => ({
          id: "asset-1",
          userId: "user-1",
          balance: new Decimal(1000),
        }),
      }) as any,
      makeStubCategoryRepo() as any,
      makeStubPrisma() as any,
    );
    await assert.rejects(
      () => svc.createExpense("user-1", baseDto),
      /Category not found/,
    );
    console.log("✓ Category not found");
  }

  // 4. Category not owned by user
  {
    const svc = new TransactionService(
      {} as any,
      makeStubAssetRepo({
        findById: () => ({
          id: "asset-1",
          userId: "user-1",
          balance: new Decimal(1000),
        }),
      }) as any,
      makeStubCategoryRepo({
        findById: () => ({
          id: "cat-1",
          userId: "other-user",
          type: "EXPENSE",
        }),
      }) as any,
      makeStubPrisma() as any,
    );
    await assert.rejects(
      () => svc.createExpense("user-1", baseDto),
      /do not own this category/,
    );
    console.log("✓ Category ownership check");
  }

  // 5. Category type is not EXPENSE
  {
    const svc = new TransactionService(
      {} as any,
      makeStubAssetRepo({
        findById: () => ({
          id: "asset-1",
          userId: "user-1",
          balance: new Decimal(1000),
        }),
      }) as any,
      makeStubCategoryRepo({
        findById: () => ({
          id: "cat-1",
          userId: "user-1",
          type: "INCOME",
        }),
      }) as any,
      makeStubPrisma() as any,
    );
    await assert.rejects(
      () => svc.createExpense("user-1", baseDto),
      /must be of type EXPENSE/,
    );
    console.log("✓ Category type check");
  }

  // 6. Insufficient balance
  {
    const svc = new TransactionService(
      {} as any,
      makeStubAssetRepo({
        findById: () => ({
          id: "asset-1",
          userId: "user-1",
          balance: new Decimal(50),
        }),
      }) as any,
      makeStubCategoryRepo({
        findById: () => ({
          id: "cat-1",
          userId: "user-1",
          type: "EXPENSE",
        }),
      }) as any,
      makeStubPrisma() as any,
    );
    await assert.rejects(
      () => svc.createExpense("user-1", baseDto),
      /Insufficient asset balance/,
    );
    console.log("✓ Insufficient balance check");
  }

  // 7. Happy path succeeds
  {
    const svc = new TransactionService(
      {} as any,
      makeStubAssetRepo({
        findById: () => ({
          id: "asset-1",
          userId: "user-1",
          balance: new Decimal(1000),
        }),
      }) as any,
      makeStubCategoryRepo({
        findById: () => ({
          id: "cat-1",
          userId: "user-1",
          type: "EXPENSE",
        }),
      }) as any,
      makeStubPrisma() as any,
    );
    const result = await svc.createExpense("user-1", baseDto);
    assert.ok(result.id, "Transaction should have an id");
    console.log("✓ Happy path succeeds");
  }

  console.log("\nAll checks passed ✅");
}

run().catch((err) => {
  console.error("Self-check FAILED:", err);
  process.exit(1);
});
