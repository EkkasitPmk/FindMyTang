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
import { TransactionService } from "../services/transaction.service";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { CreateExpenseDto } from "../dto/create-expense.dto";
import { CreateIncomeDto } from "../dto/create-income.dto";
import { CreateTransferDto } from "../dto/create-transfer.dto";
import { CreateAdjustmentDto } from "../dto/create-adjustment.dto";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { TransactionType } from "@prisma/client";
import type { User, Transaction, Asset, Category } from "@prisma/client";
import { TransactionQueryDto } from "../dto/transaction-query.dto";

type TransactionWithRelations = Transaction & {
  asset?: Asset | null;
  toAsset?: Asset | null;
  category?: Category | null;
};

// ponytail: maps Prisma Transaction to a plain JSON-safe object (Decimal → number)
// and handles included relations if present
function toResponse(tx: TransactionWithRelations) {
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
  };
}

@Controller("transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post("income")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async createIncome(
    @CurrentUser() user: User,
    @Body() dto: CreateIncomeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return toResponse(
      await this.transactionService.create(
        user.id,
        {
          ...dto,
          type: TransactionType.INCOME,
          date: dto.transactionDate,
        },
        file,
      ),
    );
  }

  @Post("expense")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async createExpense(
    @CurrentUser() user: User,
    @Body() dto: CreateExpenseDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return toResponse(
      await this.transactionService.create(
        user.id,
        {
          ...dto,
          type: TransactionType.EXPENSE,
          date: dto.transactionDate,
        },
        file,
      ),
    );
  }

  @Post("transfer")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async createTransfer(
    @CurrentUser() user: User,
    @Body() dto: CreateTransferDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return toResponse(
      await this.transactionService.create(
        user.id,
        {
          ...dto,
          type: TransactionType.TRANSFER,
          date: dto.transactionDate,
        },
        file,
      ),
    );
  }

  @Post("adjustment")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async createAdjustment(
    @CurrentUser() user: User,
    @Body() dto: CreateAdjustmentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return toResponse(
      await this.transactionService.create(
        user.id,
        {
          ...dto,
          type: TransactionType.ADJUSTMENT,
          date: dto.transactionDate,
        },
        file,
      ),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: User, @Body() dto: CreateTransactionDto) {
    return toResponse(await this.transactionService.create(user.id, dto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Query() query: TransactionQueryDto,
  ) {
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
  @UseInterceptors(FileInterceptor("file"))
  async update(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateTransactionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return toResponse(
      await this.transactionService.update(id, user.id, dto, file),
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string, @CurrentUser() user: User) {
    return toResponse(await this.transactionService.delete(id, user.id));
  }
}
