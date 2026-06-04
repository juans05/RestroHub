import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sliderSchema } from "@/lib/validations";

export async function GET(_request: NextRequest) {
  try {
    const sliders = await prisma.slider.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(sliders);
  } catch (error) {
    console.error("Error fetching sliders:", error);
    return NextResponse.json(
      { error: "Error al obtener sliders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = sliderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: result.error.issues },
        { status: 400 }
      );
    }

    const slider = await prisma.slider.create({
      data: result.data,
    });

    return NextResponse.json(slider, { status: 201 });
  } catch (error) {
    console.error("Error creating slider:", error);
    return NextResponse.json(
      { error: "Error al crear slider" },
      { status: 500 }
    );
  }
}
