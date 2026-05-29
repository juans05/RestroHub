import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sliderUpdateSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = sliderUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: result.error.issues },
        { status: 400 }
      );
    }

    const slider = await prisma.slider.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(slider);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Slider no encontrado" },
        { status: 404 }
      );
    }
    console.error("Error updating slider:", error);
    return NextResponse.json(
      { error: "Error al actualizar slider" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.slider.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Slider eliminado exitosamente" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Slider no encontrado" },
        { status: 404 }
      );
    }
    console.error("Error deleting slider:", error);
    return NextResponse.json(
      { error: "Error al eliminar slider" },
      { status: 500 }
    );
  }
}
