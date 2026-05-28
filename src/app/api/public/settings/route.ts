import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SYSTEM_CONFIG_ID } from "@/lib/constants";

export async function GET() {
  try {
    const settings = await prisma.systemConfig.findUnique({
      where: { id: SYSTEM_CONFIG_ID },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }

    const publicSettings = {
      logoUrl: settings.logoUrl,
      businessName: settings.businessName,
      description: settings.description,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      currencySymbol: settings.currencySymbol,
      phone: settings.phone,
      address: settings.address,
      timezone: settings.timezone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      instagram: settings.instagram,
      facebook: settings.facebook,
      twitter: settings.twitter,
      tiktok: settings.tiktok,
      bannerTitle: settings.bannerTitle,
      bannerText: settings.bannerText,
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
      maxPeoplePerReservation: settings.maxPeoplePerReservation,
      minOrderAdvanceHours: settings.minOrderAdvanceHours,
    };

    return NextResponse.json(publicSettings, { status: 200 });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
