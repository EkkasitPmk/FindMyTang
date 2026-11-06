import { Test, TestingModule } from "@nestjs/testing";
import { SummaryRepository } from "./summary.repository";
import { PrismaService } from "../../../prisma/prisma.service";

describe("SummaryRepository", () => {
  let repository: SummaryRepository;

  const mockPrismaService = {
    asset: {
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
    transaction: {
      aggregate: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummaryRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<SummaryRepository>(SummaryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTotalNetWorth and getExcludedNetWorth with savingsAmount", () => {
    it("correctly partitions spendable vs savings including partial splits and edge-cases", async () => {
      mockPrismaService.asset.findMany.mockResolvedValue([
        // Asset 1: Normal spendable account (฿50,000, no savings set)
        { balance: 50000, includeInSnapshot: true, savingsAmount: 0 },
        // Asset 2: 100% savings / excluded account (฿30,000)
        { balance: 30000, includeInSnapshot: false, savingsAmount: 0 },
        // Asset 3: Split account (฿100,000 balance, ฿40,000 savings)
        { balance: 100000, includeInSnapshot: true, savingsAmount: 40000 },
        // Asset 4: Shortfall account (฿10,000 balance, ฿25,000 savings target - clamped)
        { balance: 10000, includeInSnapshot: true, savingsAmount: 25000 },
        // Asset 5: Overdrawn account (-฿2,000 balance, ฿5,000 savings target)
        { balance: -2000, includeInSnapshot: true, savingsAmount: 5000 },
      ]);

      const totalNetWorth = await repository.getTotalNetWorth("user-1");
      const excludedNetWorth = await repository.getExcludedNetWorth("user-1");

      // Expected calculation:
      // Asset 1: spendable = 50,000, savings = 0
      // Asset 2: spendable = 0, savings = 30,000
      // Asset 3: spendable = 100,000 - 40,000 = 60,000, savings = 40,000
      // Asset 4: spendable = 10,000 - min(25000, 10000) = 0, savings = 10,000
      // Asset 5: spendable = -2,000 - min(5000, max(0, -2000)) = -2,000, savings = 0

      // TotalNetWorth = 50,000 + 60,000 + 0 - 2,000 = 108,000
      expect(totalNetWorth).toBe(108000);

      // ExcludedNetWorth = 30,000 + 40,000 + 10,000 + 0 = 80,000
      expect(excludedNetWorth).toBe(80000);

      // Conservation of balance check:
      // Total assets = 50,000 + 30,000 + 100,000 + 10,000 - 2,000 = 188,000
      // totalNetWorth + excludedNetWorth = 108,000 + 80,000 = 188,000!
      expect(totalNetWorth + excludedNetWorth).toBe(188000);
    });
  });
});
