import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { featureSchema, featureUpdateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const features = await prisma.feature.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(features, { status: 200 });
  } catch (error) {
    console.error("Error fetching features:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = featureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const feature = await prisma.feature.create({
      data: parsed.data,
    });

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    console.error("Error creating feature:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
