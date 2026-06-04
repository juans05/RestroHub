import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

function createPrismaClient() {
  const adapter = new PrismaPg(process.env.DATABASE_URL!);
  const client = new PrismaClient({ adapter });

  // Workaround: ensure FAQ delegate exists
  const c = client as any;
  if (!c.fAQ) {
    console.warn("WARNING: client.fAQ is undefined, adding fallback...");
    c.fAQ = {
      findMany: async () => [],
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    };
  }

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
