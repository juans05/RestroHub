import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dishUpdateSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = dishUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (parsed.data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: parsed.data.categoryId },
      });
      if (!category) {
        return NextResponse.json(
          { error: "Categoría no encontrada" },
          { status: 404 }
        );
      }
    }

    const dish = await prisma.dish.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(dish, { status: 200 });
  } catch (error) {
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json(
        { error: "Plato no encontrado" },
        { status: 404 }
      );
    }
    console.error("Error updating dish:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
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
    await prisma.dish.delete({ where: { id } });
    return NextResponse.json(
      { message: "Plato eliminado" },
      { status: 200 }
    );
  } catch (error) {
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json(
        { error: "Plato no encontrado" },
        { status: 404 }
      );
    }
    console.error("Error deleting dish:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
