import "dotenv/config";
import { PrismaClient, CategoryType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { DEFAULT_CATEGORIES } from "../src/common/constants/default-categories";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding system data...");

  // 1. Create or get System User
  // We use a fixed email to identify the system user
  const systemEmail = "system@pocketnote.io";
  const systemUser = await prisma.user.upsert({
    where: { email: systemEmail },
    update: {},
    create: {
      email: systemEmail,
      isGuest: false,
      displayName: "System",
      language: "th",
    },
  });

  console.log(`👤 System user: ${systemUser.id}`);

  // 2. Seed Default Categories for System User
  let createdCount = 0;
  let skippedCount = 0;

  for (const cat of DEFAULT_CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: {
        name: cat.name,
        type: cat.type,
        userId: systemUser.id,
        deletedAt: null,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          type: cat.type,
          color: cat.color,
          icon: cat.icon,
          userId: systemUser.id,
          isSystem: true,
          displayOrder: cat.displayOrder,
        },
      });
      createdCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`✅ Seeding completed. Created: ${createdCount}, Skipped: ${skippedCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
