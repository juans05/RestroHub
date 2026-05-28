import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  return NextResponse.json({ user: admin }, { status: 200 });
}
