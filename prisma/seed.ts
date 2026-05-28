import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { DEFAULT_SYSTEM_CONFIG, SYSTEM_CONFIG_ID } from "../src/lib/constants";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const schema = extractSchema(connectionString);
const adapter = new PrismaPg(connectionString, schema ? { schema } : undefined);
const prisma = new PrismaClient({ adapter });

function extractSchema(url: string): string | null {
  try {
    const parsed = new URL(url.replace("postgresql://", "https://").replace("postgres://", "https://"));
    return parsed.searchParams.get("schema");
  } catch {
    return null;
  }
}

async function main() {
  if (!process.env.ADMIN_DEFAULT_EMAIL) {
    throw new Error("ADMIN_DEFAULT_EMAIL environment variable is required");
  }
  if (!process.env.ADMIN_DEFAULT_PASSWORD) {
    throw new Error("ADMIN_DEFAULT_PASSWORD environment variable is required");
  }

  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL;
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Administrador",
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
  }

  const existingConfig = await prisma.systemConfig.findUnique({
    where: { id: SYSTEM_CONFIG_ID },
  });

  if (!existingConfig) {
    await prisma.systemConfig.create({
      data: {
        id: SYSTEM_CONFIG_ID,
        ...DEFAULT_SYSTEM_CONFIG,
      },
    });
    console.log("Default SystemConfig created");
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
