import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { faqSchema } from "@/lib/validations";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = faqSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const faq = await prisma.faq.create({
      data: parsed.data,
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
