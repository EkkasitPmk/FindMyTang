import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL is not set. Skipping database connection.");
      return;
    }
    try {
      await this.$connect();
    } catch (error) {
      console.error("Failed to connect to the database:", error);
    }
  }
}
