import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Number(searchParams.get('limit') || 3);

    const dishes = await prisma.dish.findMany({
      where: { isActive: true, isAvailable: true },
      take: limit,
      orderBy: { order: 'asc' },
      include: { category: true },
    });

    return NextResponse.json(dishes, { status: 200 });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
