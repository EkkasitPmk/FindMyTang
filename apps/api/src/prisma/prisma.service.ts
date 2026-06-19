import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      super({ adapter });
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
    } catch (error) {
      console.error("Failed to connect to the database:", error);
    }
  }
}
