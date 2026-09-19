import { AnalyticsService } from "./analytics.service";
import { AnalyticsRepository } from "../repositories/analytics.repository";

describe("AnalyticsService & AnalyticsRepository", () => {
  describe("AnalyticsRepository.getTransactionsForYear", () => {
    it("queries transactions for the entire year without restricting transaction types", async () => {
      const findMany = jest.fn().mockResolvedValue([]);
      const repository = new AnalyticsRepository({
        transaction: { findMany },
      } as any);

      await repository.getTransactionsForYear("user-1", 2026);

      expect(findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
          date: {
            gte: new Date(2026, 0, 1),
            lt: new Date(2027, 0, 1),
          },
          deletedAt: null,
        },
        select: {
          amount: true,
          type: true,
          date: true,
        },
      });
    });
  });

  describe("AnalyticsService.getMonthlyTrends", () => {
    it("accumulates income, expense, transfer, and adjustment properly", async () => {
      const mockRepo = {
        getTransactionsForYear: jest.fn().mockResolvedValue([
          { date: new Date(2026, 2, 15), amount: 1000, type: "INCOME" },
          { date: new Date(2026, 2, 16), amount: 300, type: "EXPENSE" },
          { date: new Date(2026, 2, 17), amount: 500, type: "TRANSFER" },
          { date: new Date(2026, 2, 18), amount: 50, type: "ADJUSTMENT" },
        ]),
      };

      const service = new AnalyticsService(mockRepo as any);
      const result = await service.getMonthlyTrends("user-1", 2026);

      expect(result.year).toBe(2026);
      expect(result.months[2]).toEqual({
        month: 3,
        income: 1000,
        expense: 300,
        transfer: 500,
        adjust: 50,
        net: 700,
      });
    });
  });
});
