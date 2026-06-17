import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Session } from "@prisma/client";

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ponytail: directly returning prisma client types. If custom mapper pattern is needed later, map to domain entities.
  async create(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<Session> {
    return this.prisma.session.create({
      data,
    });
  }

  async findById(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: { id },
    });
  }

  async findByToken(token: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: { token },
    });
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: { userId },
    });
  }

  async delete(id: string): Promise<Session> {
    return this.prisma.session.delete({
      where: { id },
    });
  }

  async update(
    id: string,
    data: { token?: string; expiresAt?: Date },
  ): Promise<Session> {
    return this.prisma.session.update({
      where: { id },
      data,
    });
  }

  async deleteAllByUserId(userId: string): Promise<{ count: number }> {
    return this.prisma.session.deleteMany({
      where: { userId },
    });
  }
}
