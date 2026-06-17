import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Transaction, TransactionType } from "@prisma/client";

export interface CreateTransactionData {
  type: TransactionType;
  amount: number;
  note?: string;
  date: Date;
  assetId: string;
  categoryId?: string;
}

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: CreateTransactionData,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: { ...data, userId },
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  async findAllByUserId(userId: string): Promise<Transaction[]> {
    // ponytail: no pagination yet — ceiling ~10k rows; upgrade to cursor-based pagination
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<CreateTransactionData>,
  ): Promise<Transaction> {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!tx) throw new Error("Transaction not found or access denied");
    return this.prisma.transaction.update({ where: { id }, data });
  }

  async delete(id: string, userId: string): Promise<Transaction> {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!tx) throw new Error("Transaction not found or access denied");
    return this.prisma.transaction.delete({ where: { id } });
  }
}
