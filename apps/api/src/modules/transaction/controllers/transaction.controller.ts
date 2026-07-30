import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from "@nestjs/swagger";
import { TransactionService } from "../services/transaction.service";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";
import { TransactionQueryDto } from "../dto/transaction-query.dto";
import {
  TransactionResponseDto,
  PaginatedTransactionResponseDto,
} from "../dto/transaction-response.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { User, Transaction, Asset, Category } from "@prisma/client";

type TransactionWithRelations = Transaction & {
  asset?: Asset | null;
  toAsset?: Asset | null;
  category?: Category | null;
};

// ponytail: maps Prisma Transaction to a plain JSON-safe object (Decimal → number)
// and handles included relations if present
function toResponse(tx: TransactionWithRelations): TransactionResponseDto {
  return {
    id: tx.id,
    type: tx.type,
    amount: Number(tx.amount),
    note: tx.note,
    transactionDate: tx.date,
    assetId: tx.assetId,
    toAssetId: tx.toAssetId,
    categoryId: tx.categoryId,
    attachmentUrl: tx.attachmentUrl,
    asset: tx.asset
      ? {
          id: tx.asset.id,
          name: tx.asset.name,
          type: tx.asset.type,
          balance: Number(tx.asset.balance),
        }
      : undefined,
    toAsset: tx.toAsset
      ? {
          id: tx.toAsset.id,
          name: tx.toAsset.name,
          type: tx.toAsset.type,
          balance: Number(tx.toAsset.balance),
        }
      : undefined,
    category: tx.category
      ? {
          id: tx.category.id,
          name: tx.category.name,
          type: tx.category.type,
          color: tx.category.color,
          icon: tx.category.icon,
        }
      : undefined,
    createdAt: tx.createdAt,
    updatedAt: tx.updatedAt,
    deletedAt: tx.deletedAt,
  };
}

@ApiTags("Transaction")
@ApiBearerAuth()
@Controller("transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get("available-dates")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get available transaction dates",
    description:
      "Retrieves a list of unique dates (YYYY-MM-DD) on which the authenticated user has transactions.",
  })
  @ApiQuery({
    name: "assetId",
    required: false,
    type: String,
    description: "Filter dates by specific asset ID",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  })
  @ApiQuery({
    name: "isDeleted",
    required: false,
    type: String,
    description: "Set to 'true' to query soft-deleted transaction dates",
    example: "false",
  })
  @ApiResponse({
    status: 200,
    description: "Available dates grouped by year retrieved successfully.",
    schema: {
      type: "object",
      additionalProperties: {
        type: "array",
        items: { type: "string" },
      },
      example: { "2026": ["January", "June"] },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async getAvailableDates(
    @CurrentUser() user: User,
    @Query("assetId") assetId?: string,
    @Query("isDeleted") isDeleted?: string,
  ): Promise<Record<string, string[]>> {
    return this.transactionService.getAvailableDates(
      user.id,
      assetId,
      isDeleted === "true",
    );
  }

  @Get("years")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get available transaction years",
    description:
      "Retrieves a list of unique years in which the authenticated user has recorded transactions.",
  })
  @ApiResponse({
    status: 200,
    description: "Available years retrieved successfully.",
    type: [Number],
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async getAvailableYears(@CurrentUser() user: User): Promise<number[]> {
    return this.transactionService.getAvailableYears(user.id);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get a transaction by ID",
    description:
      "Fetches detailed information for a single transaction by its unique ID.",
  })
  @ApiParam({
    name: "id",
    description: "Unique transaction ID (UUID)",
    example: "t1u2v3w4-5678-90ab-cdef-1234567890ab",
  })
  @ApiResponse({
    status: 200,
    description: "Transaction details retrieved successfully.",
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  @ApiResponse({
    status: 404,
    description: "Transaction not found.",
  })
  async findOne(
    @CurrentUser() user: User,
    @Param("id") id: string,
  ): Promise<TransactionResponseDto> {
    return toResponse(await this.transactionService.findOne(user.id, id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  @ApiOperation({
    summary: "Create a new transaction",
    description:
      "Creates a new transaction (INCOME, EXPENSE, TRANSFER, or ADJUSTMENT) with optional file attachment upload.",
  })
  @ApiConsumes("multipart/form-data", "application/json")
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: "Transaction created successfully.",
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request (validation error or invalid asset/category).",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateTransactionDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<TransactionResponseDto> {
    return toResponse(await this.transactionService.create(user.id, dto, file));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get paginated transactions list",
    description:
      "Fetches a paginated list of transactions filtered by type, asset, category, keyword, and date range.",
  })
  @ApiResponse({
    status: 200,
    description: "Transactions retrieved successfully with pagination meta.",
    type: PaginatedTransactionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async findAll(
    @CurrentUser() user: User,
    @Query() query: TransactionQueryDto,
  ): Promise<PaginatedTransactionResponseDto> {
    const { items, total } = await this.transactionService.findAll(
      user.id,
      query,
    );
    const limit = query.limit || 20;
    const page = query.page || 1;

    return {
      items: items.map(toResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  @ApiOperation({
    summary: "Update a transaction",
    description:
      "Updates an existing transaction by ID with optional new file attachment upload.",
  })
  @ApiParam({
    name: "id",
    description: "Unique transaction ID (UUID)",
    example: "t1u2v3w4-5678-90ab-cdef-1234567890ab",
  })
  @ApiConsumes("multipart/form-data", "application/json")
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({
    status: 200,
    description: "Transaction updated successfully.",
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request (validation error).",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  @ApiResponse({
    status: 404,
    description: "Transaction not found.",
  })
  async update(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateTransactionDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<TransactionResponseDto> {
    return toResponse(
      await this.transactionService.update(id, user.id, dto, file),
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Delete a transaction",
    description:
      "Deletes a transaction by ID. Soft-deletes by default, or hard-deletes if query param hardDelete=true.",
  })
  @ApiParam({
    name: "id",
    description: "Unique transaction ID (UUID)",
    example: "t1u2v3w4-5678-90ab-cdef-1234567890ab",
  })
  @ApiQuery({
    name: "hardDelete",
    required: false,
    type: String,
    description: "Set to 'true' for permanent hard deletion",
    example: "true",
  })
  @ApiResponse({
    status: 200,
    description: "Transaction deleted successfully.",
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  @ApiResponse({
    status: 404,
    description: "Transaction not found.",
  })
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Query("hardDelete") hardDelete?: string,
  ): Promise<TransactionResponseDto> {
    const isHardDelete = hardDelete === "true";
    return toResponse(
      await this.transactionService.delete(id, user.id, isHardDelete),
    );
  }
}
