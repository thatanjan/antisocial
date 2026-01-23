import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton client instance.
 * Prevents multiple instances of PrismaClient from being created in development.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
