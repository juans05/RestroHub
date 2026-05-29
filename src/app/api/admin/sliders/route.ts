import { prisma } from "@/lib/prisma";
import { sliderSchema } from "@/lib/validations";

export async function GET() {
  try {
    const sliders = await prisma.slider.findMany({
      orderBy: { order: "asc" },
    });
    return Response.json(sliders);
  } catch (error) {
    return Response.json(
      { error: "Error al obtener sliders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = sliderSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Datos inválidos", details: result.error.errors },
        { status: 400 }
      );
    }

    const slider = await prisma.slider.create({
      data: result.data,
    });

    return Response.json(slider, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Error al crear slider" },
      { status: 500 }
    );
  }
}
