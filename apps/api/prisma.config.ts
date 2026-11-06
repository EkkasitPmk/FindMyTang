import * as dotenv from "dotenv";
import * as path from "node:path";
import { defineConfig } from "prisma/config";

dotenv.config({ path: path.resolve(__dirname, ".env.local") });
dotenv.config({ path: path.resolve(__dirname, ".env") });

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
