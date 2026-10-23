import { Test, TestingModule } from "@nestjs/testing";
import { RecurringService } from "./recurring.service";
import { RecurringRepository } from "../repositories/recurring.repository";
import { RecurringCycle } from "@prisma/client";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("RecurringService", () => {
  let service: RecurringService;

  const mockRecurringRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecurringService,
        {
          provide: RecurringRepository,
          useValue: mockRecurringRepository,
        },
      ],
    }).compile();

    service = module.get<RecurringService>(RecurringService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a recurring expense successfully", async () => {
      const dto = {
        name: "Netflix",
        amount: 419,
        billingCycle: RecurringCycle.MONTHLY,
        nextBillingDate: "2026-10-22T00:00:00.000Z",
      };
      const createdItem = { id: "rec-1", ...dto, userId: "user-1" };
      mockRecurringRepository.create.mockResolvedValue(createdItem);

      const result = await service.create("user-1", dto);
      expect(result).toEqual(createdItem);
      expect(mockRecurringRepository.create).toHaveBeenCalledWith(
        "user-1",
        dto,
      );
    });

    it("should throw BadRequestException if name is empty", async () => {
      const dto = {
        name: "",
        amount: 419,
        billingCycle: RecurringCycle.MONTHLY,
        nextBillingDate: "2026-10-22T00:00:00.000Z",
      };

      await expect(service.create("user-1", dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should throw BadRequestException if amount is <= 0", async () => {
      const dto = {
        name: "Netflix",
        amount: -10,
        billingCycle: RecurringCycle.MONTHLY,
        nextBillingDate: "2026-10-22T00:00:00.000Z",
      };

      await expect(service.create("user-1", dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("findById", () => {
    it("should return the item if found", async () => {
      const item = { id: "rec-1", name: "Netflix", userId: "user-1" };
      mockRecurringRepository.findById.mockResolvedValue(item);

      const result = await service.findById("rec-1", "user-1");
      expect(result).toEqual(item);
    });

    it("should throw NotFoundException if item not found", async () => {
      mockRecurringRepository.findById.mockResolvedValue(null);

      await expect(service.findById("rec-999", "user-1")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("update", () => {
    it("should update a recurring expense successfully", async () => {
      const existing = { id: "rec-1", name: "Netflix", userId: "user-1" };
      mockRecurringRepository.findById.mockResolvedValue(existing);
      mockRecurringRepository.update.mockResolvedValue({
        ...existing,
        amount: 450,
      });

      const result = await service.update("rec-1", "user-1", { amount: 450 });
      expect(result.amount).toBe(450);
      expect(mockRecurringRepository.update).toHaveBeenCalledWith(
        "rec-1",
        "user-1",
        { amount: 450 },
      );
    });
  });

  describe("delete", () => {
    it("should delete a recurring expense successfully", async () => {
      const existing = { id: "rec-1", name: "Netflix", userId: "user-1" };
      mockRecurringRepository.findById.mockResolvedValue(existing);
      mockRecurringRepository.delete.mockResolvedValue(existing);

      const result = await service.delete("rec-1", "user-1");
      expect(result).toEqual(existing);
    });
  });
});
