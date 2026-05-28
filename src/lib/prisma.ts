import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const schema = extractSchema(connectionString);
  const adapter = new PrismaPg(connectionString, schema ? { schema } : undefined);
  return new PrismaClient({ adapter });
}

function extractSchema(url: string): string | null {
  try {
    const parsed = new URL(url.replace("postgresql://", "https://").replace("postgres://", "https://"));
    return parsed.searchParams.get("schema");
  } catch {
    return null;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
