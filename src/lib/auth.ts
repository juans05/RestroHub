import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifyToken, createToken } from "./jwt";
import { AUTH_COOKIE_NAME } from "./constants";

export { createToken, verifyToken } from "./jwt";
export type { SessionPayload } from "./jwt";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getAuthenticatedAdmin() {
  const session = await getSession();
  if (!session) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true },
  });

  return admin;
}
