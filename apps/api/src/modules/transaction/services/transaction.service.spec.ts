import { TransactionService } from "./transaction.service";
import { TransactionType } from "@prisma/client";

describe("TransactionService Last Write Wins", () => {
  it("resurrects a soft-deleted transaction when a later edit commits", async () => {
    const deletedAt = new Date("2026-08-01T00:00:00.000Z");
    const deletedTransaction = {
      id: "tx-1",
      userId: "user-1",
      type: TransactionType.EXPENSE,
      amount: 100,
      date: new Date("2026-07-31T00:00:00.000Z"),
      assetId: "asset-1",
      toAssetId: null,
      categoryId: "category-1",
      attachmentUrl: null,
      note: "old",
      deletedAt,
    } as any;
    const updatedTransaction = {
      ...deletedTransaction,
      note: "edited later",
      deletedAt: null,
    };
    const transactionUpdate = jest.fn().mockResolvedValue(updatedTransaction);
    const assetUpdate = jest.fn().mockResolvedValue({});
    const prismaTransaction = {
      asset: { update: assetUpdate },
      transaction: { update: transactionUpdate },
    };

    const service = Object.create(
      TransactionService.prototype,
    ) as TransactionService;
    Object.assign(service, {
      transactionRepository: {
        findById: jest.fn().mockResolvedValue(deletedTransaction),
      },
      prisma: {
        $transaction: jest.fn((callback: (tx: unknown) => unknown) =>
          callback(prismaTransaction),
        ),
      },
      storageService: { getSignedUrl: jest.fn() },
      cacheManager: { del: jest.fn().mockResolvedValue(undefined) },
    });

    const result = await service.update("tx-1", "user-1", {
      note: "edited later",
    });

    expect(result).toEqual(updatedTransaction);
    expect(assetUpdate).toHaveBeenCalledWith({
      where: { id: "asset-1" },
      data: { balance: { decrement: 100 } },
    });
    expect(transactionUpdate).toHaveBeenCalledWith({
      where: { id: "tx-1" },
      data: expect.objectContaining({
        note: "edited later",
        deletedAt: null,
      }),
    });
  });

  it("handles external transfer by deducting source asset only", async () => {
    const assetUpdate = jest.fn().mockResolvedValue({});
    const transactionCreate = jest.fn().mockImplementation(({ data }) =>
      Promise.resolve({
        id: "tx-ext-1",
        ...data,
      }),
    );
    const prismaTransaction = {
      asset: { update: assetUpdate },
      transaction: { create: transactionCreate },
    };

    const service = Object.create(
      TransactionService.prototype,
    ) as TransactionService;
    Object.assign(service, {
      assetRepository: {
        findById: jest
          .fn()
          .mockResolvedValue({ id: "asset-1", userId: "user-1" }),
      },
      categoryRepository: {
        findById: jest
          .fn()
          .mockResolvedValue({ id: "cat-1", userId: "user-1" }),
      },
      prisma: {
        $transaction: jest.fn((callback: (tx: unknown) => unknown) =>
          callback(prismaTransaction),
        ),
      },
      storageService: { getSignedUrl: jest.fn((url) => Promise.resolve(url)) },
      cacheManager: { del: jest.fn().mockResolvedValue(undefined) },
    });

    const result = await service.create("user-1", {
      type: TransactionType.TRANSFER,
      amount: 500,
      assetId: "asset-1",
      date: "2026-11-06T00:00:00.000Z",
      note: "Transfer to friend",
      categoryId: "cat-1",
    });

    expect(result).toMatchObject({
      id: "tx-ext-1",
      type: TransactionType.TRANSFER,
      amount: 500,
      assetId: "asset-1",
      toAssetId: null,
      categoryId: "cat-1",
      note: "Transfer to friend",
    });

    expect(assetUpdate).toHaveBeenCalledTimes(1);
    expect(assetUpdate).toHaveBeenCalledWith({
      where: { id: "asset-1" },
      data: { balance: { decrement: 500 } },
    });
  });
});
