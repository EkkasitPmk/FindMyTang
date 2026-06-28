import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const assets = await prisma.asset.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  console.log(JSON.stringify(assets, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
