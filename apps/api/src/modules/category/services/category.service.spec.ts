import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "../repositories/category.repository";
import { CategoryType } from "@prisma/client";
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";

describe("CategoryService", () => {
  let service: CategoryService;
  let repository: CategoryRepository;

  const mockCategoryRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<CategoryRepository>(CategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("update", () => {
    it("should successfully update a category", async () => {
      const category = {
        id: "cat-123",
        name: "Food",
        type: CategoryType.EXPENSE,
        userId: "user-123",
        color: "#FFF",
        icon: "food",
      } as any;

      const dto = {
        name: "  Food & Drinks  ",
        color: "#000",
      };

      const expectedUpdated = {
        ...category,
        name: "Food & Drinks",
        color: "#000",
      };

      mockCategoryRepository.findById.mockResolvedValue(category);
      mockCategoryRepository.update.mockResolvedValue(expectedUpdated);

      const result = await service.update("cat-123", "user-123", dto);

      expect(result).toEqual(expectedUpdated);
      expect(repository.findById).toHaveBeenCalledWith("cat-123");
      expect(repository.update).toHaveBeenCalledWith("cat-123", "user-123", {
        name: "Food & Drinks",
        color: "#000",
      });
    });

    it("should throw NotFoundException if category does not exist", async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(
        service.update("invalid-id", "user-123", { name: "Test" }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw ForbiddenException if category belongs to another user", async () => {
      const category = {
        id: "cat-123",
        name: "Food",
        userId: "user-999",
      } as any;

      mockCategoryRepository.findById.mockResolvedValue(category);

      await expect(
        service.update("cat-123", "user-123", { name: "Test" }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw BadRequestException if name is empty or whitespaces", async () => {
      const category = {
        id: "cat-123",
        name: "Food",
        userId: "user-123",
      } as any;

      mockCategoryRepository.findById.mockResolvedValue(category);

      await expect(
        service.update("cat-123", "user-123", { name: "   " }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("delete", () => {
    it("should successfully delete a category", async () => {
      const category = {
        id: "cat-123",
        name: "Food",
        type: CategoryType.EXPENSE,
        userId: "user-123",
      } as any;

      mockCategoryRepository.findById.mockResolvedValue(category);
      mockCategoryRepository.delete.mockResolvedValue(category);

      const result = await service.delete("cat-123", "user-123");

      expect(result).toEqual(category);
      expect(repository.findById).toHaveBeenCalledWith("cat-123");
      expect(repository.delete).toHaveBeenCalledWith("cat-123", "user-123");
    });

    it("should throw NotFoundException if category does not exist", async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(service.delete("invalid-id", "user-123")).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findById).toHaveBeenCalledWith("invalid-id");
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenException if category belongs to another user", async () => {
      const category = {
        id: "cat-123",
        name: "Food",
        userId: "user-999",
      } as any;

      mockCategoryRepository.findById.mockResolvedValue(category);

      await expect(service.delete("cat-123", "user-123")).rejects.toThrow(
        ForbiddenException,
      );
      expect(repository.findById).toHaveBeenCalledWith("cat-123");
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
