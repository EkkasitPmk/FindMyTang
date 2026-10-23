import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { RecurringExpense, RecurringStatus, Prisma } from "@prisma/client";
import { CreateRecurringDto } from "../dto/create-recurring.dto";
import { UpdateRecurringDto } from "../dto/update-recurring.dto";

@Injectable()
export class RecurringRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: CreateRecurringDto,
  ): Promise<RecurringExpense> {
    return this.prisma.recurringExpense.create({
      data: {
        name: data.name,
        amount: new Prisma.Decimal(data.amount),
        currency: data.currency ?? "THB",
        billingCycle: data.billingCycle,
        nextBillingDate: new Date(data.nextBillingDate),
        assetId: data.assetId ?? null,
        categoryId: data.categoryId ?? null,
        status: data.status ?? RecurringStatus.ACTIVE,
        note: data.note ?? null,
        userId,
      },
      include: {
        category: true,
        asset: true,
      },
    });
  }

  async findById(id: string, userId: string): Promise<RecurringExpense | null> {
    return this.prisma.recurringExpense.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
        asset: true,
      },
    });
  }

  async findAll(
    userId: string,
    status?: RecurringStatus,
  ): Promise<RecurringExpense[]> {
    return this.prisma.recurringExpense.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      include: {
        category: true,
        asset: true,
      },
      orderBy: [{ nextBillingDate: "asc" }, { createdAt: "desc" }],
    });
  }

  private mapRelation(id?: string | null) {
    if (id === undefined) return undefined;
    return id ? { connect: { id } } : { disconnect: true };
  }

  private buildUpdateInput(
    data: UpdateRecurringDto,
  ): Prisma.RecurringExpenseUpdateInput {
    const { amount, nextBillingDate, assetId, categoryId, ...directFields } =
      data;

    const updateData: Prisma.RecurringExpenseUpdateInput = {
      ...directFields,
    };

    if (amount !== undefined) {
      updateData.amount = new Prisma.Decimal(amount);
    }
    if (nextBillingDate !== undefined) {
      updateData.nextBillingDate = new Date(nextBillingDate);
    }

    const assetRelation = this.mapRelation(assetId);
    if (assetRelation) updateData.asset = assetRelation;

    const categoryRelation = this.mapRelation(categoryId);
    if (categoryRelation) updateData.category = categoryRelation;

    return updateData;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateRecurringDto,
  ): Promise<RecurringExpense> {
    const existing = await this.prisma.recurringExpense.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new Error("Recurring expense not found or access denied");
    }

    return this.prisma.recurringExpense.update({
      where: { id },
      data: this.buildUpdateInput(data),
      include: {
        category: true,
        asset: true,
      },
    });
  }

  async delete(id: string, userId: string): Promise<RecurringExpense> {
    const existing = await this.prisma.recurringExpense.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new Error("Recurring expense not found or access denied");
    }
    return this.prisma.recurringExpense.delete({
      where: { id },
    });
  }
}
