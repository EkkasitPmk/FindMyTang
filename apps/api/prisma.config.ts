import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
  datasource: {
    // Generate/build can run without a database; migrate commands still require DATABASE_URL.
    url: process.env.DATABASE_URL,
  },
});
