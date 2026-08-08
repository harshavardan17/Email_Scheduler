const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const jobs = await prisma.emailJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  console.log(JSON.stringify(jobs, null, 2));
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
