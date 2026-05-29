import { prisma } from "@/lib/prisma";
import { sliderUpdateSchema } from "@/lib/validations";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = sliderUpdateSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Datos inválidos", details: result.error.errors },
        { status: 400 }
      );
    }

    const slider = await prisma.slider.update({
      where: { id },
      data: result.data,
    });

    return Response.json(slider);
  } catch (error: any) {
    if (error.code === "P2025") {
      return Response.json(
        { error: "Slider no encontrado" },
        { status: 404 }
      );
    }
    return Response.json(
      { error: "Error al actualizar slider" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.slider.delete({
      where: { id },
    });

    return Response.json({ message: "Slider eliminado exitosamente" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return Response.json(
        { error: "Slider no encontrado" },
        { status: 404 }
      );
    }
    return Response.json(
      { error: "Error al eliminar slider" },
      { status: 500 }
    );
  }
}
