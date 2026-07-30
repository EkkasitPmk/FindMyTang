import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool?: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      super({ adapter });
      this.pool = pool;
    } else {
      // ponytail: Fallback to empty config if DATABASE_URL is not present during build/testing
      super();
    }
  }

  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL is not set. Skipping database connection.");
      return;
    }
    try {
      await this.$connect();
      await this.$queryRawUnsafe("SELECT 1");
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      if (process.env.NODE_ENV === "production") {
        throw error;
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool?.end();
  }
}
