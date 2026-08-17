import { TransactionRepository } from "./transaction.repository";
import type { Transaction } from "@prisma/client";

describe("TransactionRepository cursor direction", () => {
  const cursor = Buffer.from(
    JSON.stringify({
      date: "2026-08-01T00:00:00.000Z",
      createdAt: "2026-08-01T00:00:00.000Z",
      id: "transaction-1",
    }),
  ).toString("base64url");

  it("uses the opposite comparison when fetching the previous page", () => {
    const repository = Object.create(
      TransactionRepository.prototype,
    ) as TransactionRepository;
    const where = {};

    (
      repository as unknown as {
        applyCursorFilter: (
          filter: object,
          value: string,
          sort?: string,
          direction?: "next" | "previous",
        ) => void;
      }
    ).applyCursorFilter(where, cursor, "DATE_NEWEST", "previous");

    expect(where).toEqual({
      AND: [
        expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ date: { gt: expect.any(Date) } }),
          ]),
        }),
      ],
    });
  });

  it("returns the page immediately before the cursor in the normal order", async () => {
    const transaction = (id: string, date: string) =>
      ({ id, date: new Date(date), createdAt: new Date(date) }) as Transaction;
    const findMany = jest
      .fn()
      .mockResolvedValue([
        transaction("page-2-old", "2026-08-02T00:00:00.000Z"),
        transaction("page-2-new", "2026-08-03T00:00:00.000Z"),
        transaction("page-1-old", "2026-08-04T00:00:00.000Z"),
      ]);
    const repository = Object.create(
      TransactionRepository.prototype,
    ) as TransactionRepository;
    Object.assign(repository, { prisma: { transaction: { findMany } } });

    const result = await repository.findAllByUserId("user-1", {
      limit: 2,
      pagination: "cursor",
      cursor,
      cursorDirection: "previous",
      sortType: "DATE_NEWEST",
    });

    expect(result.items.map((item) => item.id)).toEqual([
      "page-2-new",
      "page-2-old",
    ]);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ date: "asc" }, { createdAt: "asc" }, { id: "asc" }],
      }),
    );
  });
});
