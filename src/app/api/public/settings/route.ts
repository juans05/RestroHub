import { NextResponse } from "next/server";
import { mockDB } from "@/lib/mockData";

export async function GET() {
  try {
    // Try Prisma only when DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      const { prisma } = await import("@/lib/prisma");
      const { SYSTEM_CONFIG_ID } = await import("@/lib/constants");

      const settings = await prisma.systemConfig.findUnique({
        where: { id: SYSTEM_CONFIG_ID },
      });

      if (settings) {
        return NextResponse.json({
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
        }, { status: 200 });
      }
    }

    // Fallback to mockDB when no database is configured
    const config = mockDB.getConfig();
    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Last resort: return mockDB data so the UI never breaks
    const config = mockDB.getConfig();
    return NextResponse.json(config, { status: 200 });
  }
}
