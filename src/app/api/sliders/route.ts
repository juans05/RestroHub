import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const sliders = await prisma.slider.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(sliders);
  } catch (error) {
    console.error("Error fetching public sliders:", error);
    return NextResponse.json(
      { error: "Error al obtener sliders" },
      { status: 500 }
    );
  }
}
