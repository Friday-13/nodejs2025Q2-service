import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {}

main()
  .then(() => {
    console.log('Seed finished');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
