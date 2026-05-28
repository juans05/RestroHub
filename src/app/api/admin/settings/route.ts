import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { settingsUpdateSchema } from "@/lib/validations";
import { SYSTEM_CONFIG_ID } from "@/lib/constants";

export async function GET() {
  try {
    const settings = await prisma.systemConfig.findUnique({
      where: { id: SYSTEM_CONFIG_ID },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = settingsUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const settings = await prisma.systemConfig.upsert({
      where: { id: SYSTEM_CONFIG_ID },
      update: parsed.data,
      create: {
        id: SYSTEM_CONFIG_ID,
        ...parsed.data,
      },
    });

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
