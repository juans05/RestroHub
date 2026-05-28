import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { branchUpdateSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = branchUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(branch, { status: 200 });
  } catch (error) {
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json(
        { error: "Sede no encontrada" },
        { status: 404 }
      );
    }
    console.error("Error updating branch:", error);
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
    await prisma.branch.delete({ where: { id } });
    return NextResponse.json(
      { message: "Sede eliminada" },
      { status: 200 }
    );
  } catch (error) {
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json(
        { error: "Sede no encontrada" },
        { status: 404 }
      );
    }
    console.error("Error deleting branch:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
