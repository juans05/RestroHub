import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dishSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const where = categoryId ? { categoryId } : {};

    const dishes = await prisma.dish.findMany({
      where,
      orderBy: [{ categoryId: "asc" }, { order: "asc" }],
      include: { category: { select: { id: true, name: true } } },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = dishSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: parsed.data.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    const dish = await prisma.dish.create({ data: parsed.data });
    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error("Error creating dish:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
