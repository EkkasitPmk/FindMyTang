import { beforeEach, describe, expect, it, vi } from "vitest";
import http from "@/shared/lib/api/http";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import {
  RecurringCycle,
  RecurringStatus,
  LocalRecurringExpense,
} from "@/shared/lib/storages/dexie.storage";
import {
  getRecurringExpensesApi,
  createRecurringExpenseApi,
  updateRecurringExpenseApi,
  deleteRecurringExpenseApi,
  logRecurringExpensePaymentApi,
} from "./recurring.service";
import type {
  TransactionResponse,
  TransactionType,
} from "@/shared/lib/types/transaction.type";
import * as transactionService from "@/features/transactions/services/transaction.service";

let mockRecurringList: LocalRecurringExpense[] = [];

vi.mock("@/shared/lib/api/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/shared/lib/storages/dexie.storage", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/shared/lib/storages/dexie.storage")
    >();
  return {
    ...actual,
    db: {
      recurringExpenses: {
        toArray: vi.fn(async () => [...mockRecurringList]),
        get: vi.fn(async (id: string) =>
          mockRecurringList.find((item) => item.id === id),
        ),
        add: vi.fn(async (item: LocalRecurringExpense) => {
          mockRecurringList.push(item);
        }),
        put: vi.fn(async (item: LocalRecurringExpense) => {
          const index = mockRecurringList.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            mockRecurringList[index] = item;
          } else {
            mockRecurringList.push(item);
          }
        }),
      },
      categories: {
        get: vi.fn(async (id: string) => ({
          id,
          name: "ความบันเทิง",
          type: "EXPENSE",
          color: "#E50914",
        })),
      },
      assets: {
        get: vi.fn(async (id: string) => ({
          id,
          name: "KBank",
          type: "BANK",
          balance: 5000,
        })),
      },
    },
  };
});

describe("recurring.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRecurringList = [];
    useGuestStore.setState({ isGuest: false });
  });

  describe("cloud mode (user logged in)", () => {
    it("calls http.get on getRecurringExpensesApi", async () => {
      vi.mocked(http.get).mockResolvedValueOnce({
        data: [
          {
            id: "cloud-1",
            name: "Netflix",
            amount: "419.00",
            billingCycle: RecurringCycle.MONTHLY,
            firstBillingDate: "2026-10-01T00:00:00.000Z",
            nextBillingDate: "2026-11-01T00:00:00.000Z",
            status: RecurringStatus.ACTIVE,
          },
        ],
      });

      const res = await getRecurringExpensesApi();
      expect(http.get).toHaveBeenCalledWith("/recurring", {
        params: { status: undefined, includeDeleted: "false" },
      });
      expect(res).toHaveLength(1);
      expect(res[0].amount).toBe(419);
    });

    it("calls http.post on createRecurringExpenseApi", async () => {
      vi.mocked(http.post).mockResolvedValueOnce({
        data: {
          id: "cloud-2",
          name: "Spotify",
          amount: "139.00",
          billingCycle: RecurringCycle.MONTHLY,
          firstBillingDate: "2026-10-01T00:00:00.000Z",
          nextBillingDate: "2026-11-01T00:00:00.000Z",
          status: RecurringStatus.ACTIVE,
        },
      });

      const res = await createRecurringExpenseApi({
        name: "Spotify",
        amount: 139,
        billingCycle: RecurringCycle.MONTHLY,
        firstBillingDate: "2026-10-01T00:00:00.000Z",
        nextBillingDate: "2026-11-01T00:00:00.000Z",
      });

      expect(http.post).toHaveBeenCalledWith("/recurring", expect.any(Object));
      expect(res.amount).toBe(139);
    });

    it("calls http.patch on updateRecurringExpenseApi", async () => {
      vi.mocked(http.patch).mockResolvedValueOnce({
        data: {
          id: "cloud-2",
          name: "Spotify Duo",
          amount: "189.00",
          billingCycle: RecurringCycle.MONTHLY,
          firstBillingDate: "2026-10-01T00:00:00.000Z",
          nextBillingDate: "2026-11-01T00:00:00.000Z",
          status: RecurringStatus.ACTIVE,
        },
      });

      const res = await updateRecurringExpenseApi("cloud-2", {
        name: "Spotify Duo",
        amount: 189,
      });

      expect(http.patch).toHaveBeenCalledWith(
        "/recurring/cloud-2",
        expect.any(Object),
      );
      expect(res.amount).toBe(189);
    });

    it("calls http.delete on deleteRecurringExpenseApi", async () => {
      vi.mocked(http.delete).mockResolvedValueOnce({ data: { success: true } });

      await deleteRecurringExpenseApi("cloud-2");
      expect(http.delete).toHaveBeenCalledWith("/recurring/cloud-2");
    });
  });

  describe("guest mode (local dexie)", () => {
    beforeEach(() => {
      useGuestStore.setState({ isGuest: true });
    });

    it("creates, reads, updates, and soft deletes items in Dexie", async () => {
      const created = await createRecurringExpenseApi({
        name: "Netflix",
        amount: 419,
        billingCycle: RecurringCycle.MONTHLY,
        firstBillingDate: "2026-10-01T00:00:00.000Z",
        nextBillingDate: "2026-11-01T00:00:00.000Z",
      });

      expect(created.id).toBeDefined();
      expect(created.amount).toBe(419);

      // Read
      const list = await getRecurringExpensesApi();
      expect(list).toHaveLength(1);
      expect(list[0].name).toBe("Netflix");

      // Update
      const updated = await updateRecurringExpenseApi(created.id, {
        amount: 449,
      });
      expect(updated.amount).toBe(449);

      // Soft delete
      await deleteRecurringExpenseApi(created.id);
      const listAfterDelete = await getRecurringExpensesApi(undefined, false);
      expect(listAfterDelete).toHaveLength(0);
    });
  });

  describe("logRecurringExpensePaymentApi", () => {
    it("creates an expense transaction and advances nextBillingDate", async () => {
      const spyCreateTx = vi
        .spyOn(transactionService, "createTransactionApi")
        .mockResolvedValueOnce({
          id: "tx-1",
          amount: 419,
          type: "EXPENSE" as TransactionType,
          date: "2026-10-22",
          assetId: "asset-1",
        } as unknown as TransactionResponse);

      vi.mocked(http.patch).mockResolvedValueOnce({
        data: {
          id: "rec-1",
          name: "Netflix",
          amount: 419,
          billingCycle: RecurringCycle.MONTHLY,
          firstBillingDate: "2026-09-22T00:00:00.000Z",
          nextBillingDate: "2026-11-22T00:00:00.000Z",
          status: RecurringStatus.ACTIVE,
        },
      });

      const item = {
        id: "rec-1",
        name: "Netflix",
        amount: 419,
        currency: "THB",
        billingCycle: RecurringCycle.MONTHLY,
        firstBillingDate: "2026-09-22T00:00:00.000Z",
        nextBillingDate: "2026-10-22T00:00:00.000Z",
        status: RecurringStatus.ACTIVE,
        createdAt: "2026-09-22T00:00:00.000Z",
        updatedAt: "2026-09-22T00:00:00.000Z",
      };

      const result = await logRecurringExpensePaymentApi(item, {
        amount: 419,
        paymentDate: "2026-10-22",
        assetId: "asset-1",
      });

      expect(spyCreateTx).toHaveBeenCalledWith(
        {
          amount: 419,
          transactionDate: "2026-10-22",
          assetId: "asset-1",
          categoryId: undefined,
          note: "Netflix",
        },
        "EXPENSE",
      );

      expect(result.transaction.id).toBe("tx-1");
      expect(http.patch).toHaveBeenCalledWith(
        "/recurring/rec-1",
        expect.objectContaining({
          nextBillingDate: expect.any(String),
        }),
      );
    });
  });
});
