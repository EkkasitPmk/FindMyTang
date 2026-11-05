import { Test, TestingModule } from "@nestjs/testing";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { SummaryService } from "./summary.service";
import { SummaryRepository } from "../repositories/summary.repository";
import { TransactionType } from "@prisma/client";

describe("SummaryService", () => {
  let service: SummaryService;
  let repository: SummaryRepository;

  const mockSummaryRepository = {
    getTodayAmount: jest.fn(),
    getThisMonthAmount: jest.fn(),
    getTotalNetWorth: jest.fn(),
    getExcludedNetWorth: jest.fn(),
    getTodayExternalTransferAmount: jest.fn(),
    getThisMonthExternalTransferAmount: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummaryService,
        {
          provide: SummaryRepository,
          useValue: mockSummaryRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<SummaryService>(SummaryService);
    repository = module.get<SummaryRepository>(SummaryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getThisMonthSummary", () => {
    it("should calculate summary including totalNetWorth and excludedNetWorth", async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockSummaryRepository.getThisMonthAmount.mockImplementation(
        (_userId: string, type: TransactionType) => {
          if (type === TransactionType.INCOME) return Promise.resolve(10000);
          if (type === TransactionType.EXPENSE) return Promise.resolve(4000);
          if (type === TransactionType.TRANSFER) return Promise.resolve(2000);
          if (type === TransactionType.ADJUSTMENT) return Promise.resolve(500);
          return Promise.resolve(0);
        },
      );
      mockSummaryRepository.getTotalNetWorth.mockResolvedValue(50000);
      mockSummaryRepository.getExcludedNetWorth.mockResolvedValue(25000);
      mockSummaryRepository.getThisMonthExternalTransferAmount.mockResolvedValue(
        1000,
      );

      const result = await service.getThisMonthSummary("user-1");

      expect(result).toEqual({
        income: 10000,
        expense: 4000,
        transfer: 2000,
        adjustment: 500,
        net: 5000,
        totalNetWorth: 50000,
        excludedNetWorth: 25000,
      });
      expect(repository.getTotalNetWorth).toHaveBeenCalledWith("user-1");
      expect(repository.getExcludedNetWorth).toHaveBeenCalledWith("user-1");
    });
  });
});
