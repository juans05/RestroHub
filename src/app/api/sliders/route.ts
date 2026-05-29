import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sliders = await prisma.slider.findMany({
      where: { isActive: true },
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
