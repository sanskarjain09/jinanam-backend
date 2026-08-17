const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const e = await prisma.event.findFirst({ where: { OR: [{ id: "cmsvfazzk0002119ec7br6wqw" }, { publicId: "cmsvfazzk0002119ec7br6wqw" }] }});
  console.log(e);
}
main().catch(console.error).finally(() => prisma.$disconnect());
