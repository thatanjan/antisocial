import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/client/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const posts = await prisma.post.findMany({
  orderBy: { createdAt: "desc" },
  include: { author: { select: { name: true } } },
});

export default prisma;
