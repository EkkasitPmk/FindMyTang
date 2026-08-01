import { Test, TestingModule } from "@nestjs/testing";
import { AssetService } from "./asset.service";
import { AssetRepository } from "../repositories/asset.repository";
import { CreateAssetDto } from "../dto/create-asset.dto";
import { AssetType } from "@prisma/client";
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";

import { StorageService } from "../../../common/storage/storage.service";

describe("AssetService", () => {
  let service: AssetService;
  let repository: AssetRepository;

  const mockAssetRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAny: jest.fn(),
    findAllActiveByUserId: jest.fn(),
    findAllIncludingDeletedByUserId: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    hardDelete: jest.fn(),
    restore: jest.fn(),
  };

  const mockStorageService = {
    uploadFile: jest.fn(),
    getSignedUrl: jest.fn(),
    removeFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        {
          provide: AssetRepository,
          useValue: mockAssetRepository,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<AssetService>(AssetService);
    repository = module.get<AssetRepository>(AssetRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should successfully create an asset after trimming the name", async () => {
      const dto: CreateAssetDto = {
        name: "  Savings Account  ",
        type: AssetType.BANK,
        balance: 1000,
      };

      const expectedResult = {
        id: "asset-123",
        name: "Savings Account",
        type: AssetType.BANK,
        balance: 1000,
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      mockAssetRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create("user-123", dto);

      expect(result).toEqual(expectedResult);
      expect(repository.create).toHaveBeenCalledWith("user-123", {
        name: "Savings Account",
        type: AssetType.BANK,
        balance: 1000,
      });
    });

    it("should throw BadRequestException if name becomes empty after trimming", async () => {
      const dto: CreateAssetDto = {
        name: "    ",
        type: AssetType.CASH,
      };

      await expect(service.create("user-123", dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe("findAllActive", () => {
    it("should return active assets belonging to the user", async () => {
      const expectedAssets = [
        {
          id: "asset-1",
          name: "Cash",
          type: AssetType.CASH,
          balance: 1000,
          userId: "user-123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as any;

      mockAssetRepository.findAllActiveByUserId.mockResolvedValue(
        expectedAssets,
      );

      const result = await service.findAllActive("user-123");

      expect(result).toEqual(expectedAssets);
      expect(repository.findAllActiveByUserId).toHaveBeenCalledWith("user-123");
    });
  });

  describe("findAllIncludingDeleted", () => {
    it("should return all assets including soft-deleted ones", async () => {
      const expectedAssets = [
        {
          id: "asset-1",
          name: "Cash",
          type: AssetType.CASH,
          balance: 1000,
          userId: "user-123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as any;

      mockAssetRepository.findAllIncludingDeletedByUserId.mockResolvedValue(
        expectedAssets,
      );

      const result = await service.findAllIncludingDeleted("user-123");

      expect(result).toEqual(expectedAssets);
      expect(repository.findAllIncludingDeletedByUserId).toHaveBeenCalledWith(
        "user-123",
      );
    });
  });

  describe("update", () => {
    it("should successfully update an asset after trimming name", async () => {
      const asset = {
        id: "asset-123",
        name: "Old Name",
        type: AssetType.BANK,
        balance: 1000,
        userId: "user-123",
      } as any;

      const dto = {
        name: "  New Name  ",
        balance: 1500,
      };

      const expectedUpdated = {
        ...asset,
        name: "New Name",
        balance: 1500,
      };

      mockAssetRepository.findByIdAny.mockResolvedValue(asset);
      mockAssetRepository.update.mockResolvedValue(expectedUpdated);

      const result = await service.update("asset-123", "user-123", dto);

      expect(result).toEqual(expectedUpdated);
      expect(repository.findByIdAny).toHaveBeenCalledWith("asset-123");
      expect(repository.update).toHaveBeenCalledWith("asset-123", "user-123", {
        name: "New Name",
        balance: 1500,
        deletedAt: null,
      });
    });

    it("should resurrect a soft-deleted asset when edited later", async () => {
      const asset = {
        id: "asset-deleted",
        name: "Old Name",
        type: AssetType.BANK,
        userId: "user-123",
        deletedAt: new Date(),
      } as any;

      mockAssetRepository.findByIdAny.mockResolvedValue(asset);
      mockAssetRepository.update.mockResolvedValue({
        ...asset,
        name: "Restored Name",
        deletedAt: null,
      });

      await service.update("asset-deleted", "user-123", {
        name: "Restored Name",
      });

      expect(repository.update).toHaveBeenCalledWith(
        "asset-deleted",
        "user-123",
        { name: "Restored Name", deletedAt: null },
      );
    });

    it("should throw NotFoundException if asset does not exist", async () => {
      mockAssetRepository.findByIdAny.mockResolvedValue(null);

      await expect(
        service.update("invalid-id", "user-123", { name: "Test" }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw ForbiddenException if asset belongs to another user", async () => {
      const asset = {
        id: "asset-123",
        name: "Cash",
        userId: "user-999",
      } as any;

      mockAssetRepository.findByIdAny.mockResolvedValue(asset);

      await expect(
        service.update("asset-123", "user-123", { name: "Test" }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw BadRequestException if update name is empty or spaces only", async () => {
      const asset = {
        id: "asset-123",
        name: "Cash",
        userId: "user-123",
      } as any;

      mockAssetRepository.findByIdAny.mockResolvedValue(asset);

      await expect(
        service.update("asset-123", "user-123", { name: "   " }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("softDelete", () => {
    it("should successfully soft delete an asset matching id and userId", async () => {
      const asset = {
        id: "asset-123",
        name: "Cash",
        userId: "user-123",
      } as any;

      mockAssetRepository.findById.mockResolvedValue(asset);
      mockAssetRepository.softDelete.mockResolvedValue(asset);

      const result = await service.softDelete("asset-123", "user-123");

      expect(result).toEqual(asset);
      expect(repository.findById).toHaveBeenCalledWith("asset-123");
      expect(repository.softDelete).toHaveBeenCalledWith(
        "asset-123",
        "user-123",
      );
    });

    it("should throw NotFoundException if asset does not exist", async () => {
      mockAssetRepository.findById.mockResolvedValue(null);

      await expect(
        service.softDelete("invalid-id", "user-123"),
      ).rejects.toThrow(NotFoundException);
      expect(repository.softDelete).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenException if asset belongs to another user", async () => {
      const asset = {
        id: "asset-123",
        name: "Cash",
        userId: "user-999",
      } as any;

      mockAssetRepository.findById.mockResolvedValue(asset);

      await expect(service.softDelete("asset-123", "user-123")).rejects.toThrow(
        ForbiddenException,
      );
      expect(repository.softDelete).not.toHaveBeenCalled();
    });
  });
});
