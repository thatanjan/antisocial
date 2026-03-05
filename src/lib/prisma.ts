import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/client/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var pool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  db = new PrismaClient({ adapter });
} else {
  if (!globalThis.prisma) {
    globalThis.pool = new Pool({ connectionString });
    const adapter = new PrismaPg(globalThis.pool as Pool);
    globalThis.prisma = new PrismaClient({ adapter });
  }
  db = globalThis.prisma;
}

export default db;
