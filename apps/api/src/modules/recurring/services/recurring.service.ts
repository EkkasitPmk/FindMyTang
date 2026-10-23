import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { RecurringRepository } from "../repositories/recurring.repository";
import { CreateRecurringDto } from "../dto/create-recurring.dto";
import { UpdateRecurringDto } from "../dto/update-recurring.dto";
import { RecurringExpense, RecurringStatus } from "@prisma/client";

@Injectable()
export class RecurringService {
  constructor(private readonly recurringRepository: RecurringRepository) {}

  async create(
    userId: string,
    dto: CreateRecurringDto,
  ): Promise<RecurringExpense> {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new BadRequestException("Name is required");
    }
    if (dto.amount <= 0) {
      throw new BadRequestException("Amount must be greater than zero");
    }
    return this.recurringRepository.create(userId, dto);
  }

  async findAll(
    userId: string,
    status?: RecurringStatus,
  ): Promise<RecurringExpense[]> {
    return this.recurringRepository.findAll(userId, status);
  }

  async findById(id: string, userId: string): Promise<RecurringExpense> {
    const item = await this.recurringRepository.findById(id, userId);
    if (!item) {
      throw new NotFoundException(`Recurring expense with ID ${id} not found`);
    }
    return item;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateRecurringDto,
  ): Promise<RecurringExpense> {
    await this.findById(id, userId);
    return this.recurringRepository.update(id, userId, dto);
  }

  async delete(id: string, userId: string): Promise<RecurringExpense> {
    await this.findById(id, userId);
    return this.recurringRepository.delete(id, userId);
  }
}
