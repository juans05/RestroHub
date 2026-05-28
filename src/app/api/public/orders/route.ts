import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicOrderSchema } from "@/lib/validations";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Resend } from "resend";
import { SYSTEM_CONFIG_ID } from "@/lib/constants";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = publicOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { customerName, customerPhone, branchId, eventDate, eventTime, peopleCount, notes, dishes } = parsed.data;

    const [branch, systemConfig] = await Promise.all([
      prisma.branch.findUnique({ where: { id: branchId } }),
      prisma.systemConfig.findUnique({ where: { id: SYSTEM_CONFIG_ID } }),
    ]);

    if (!branch) {
      return NextResponse.json(
        { error: "Sede no encontrada" },
        { status: 404 }
      );
    }

    if (!systemConfig) {
      console.error("SystemConfig not found");
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }

    if (!branch.isActive) {
      return NextResponse.json(
        { error: "La sede no está activa" },
        { status: 400 }
      );
    }

    const dishIds = dishes.map((d) => d.id);
    const existingDishes = await prisma.dish.findMany({
      where: { id: { in: dishIds }, isActive: true },
    });

    if (existingDishes.length !== dishIds.length) {
      return NextResponse.json(
        { error: "Uno o más platos no existen o no están disponibles" },
        { status: 400 }
      );
    }

    const dishMap = new Map(existingDishes.map((d) => [d.id, d]));

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerName,
          customerPhone,
          branchId,
          eventDate: new Date(eventDate),
          eventTime,
          peopleCount,
          notes: notes || null,
          items: {
            create: dishes.map((d) => {
              const dish = dishMap.get(d.id)!;
              return {
                dishName: dish.name,
                quantity: d.quantity,
                price: dish.price,
              };
            }),
          },
        },
        include: { items: true, branch: true },
      });

      return newOrder;
    });

    const whatsappUrl = buildWhatsAppUrl({
      branchName: branch.name,
      branchPhone: branch.phone,
      customerName,
      eventDate,
      eventTime,
      peopleCount,
      dishes: order.items.map((item) => ({
        name: item.dishName,
        quantity: item.quantity,
      })),
      notes,
    });

    if (resend) {
      const emailHtml = `
        <div style="font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF6F0; padding: 40px 20px; color: #2B1B1E; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid rgba(197, 160, 89, 0.25); box-shadow: 0 10px 30px rgba(43, 27, 30, 0.04);">
            
            <!-- Header banner with Guinda & Dorado accents -->
            <div style="background: linear-gradient(135deg, ${systemConfig.primaryColor}, #5C0618); padding: 40px 30px; text-align: center; color: #FFFFFF; border-bottom: 4px solid ${systemConfig.secondaryColor};">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: ${systemConfig.secondaryColor}; margin-bottom: 8px;">Resto-CMS · ${systemConfig.businessName}</div>
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">¡Nuevo Pedido Recibido!</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.85; font-weight: 500;">Sede seleccionada: ${branch.name}</p>
            </div>
            
            <!-- Customer & Event details -->
            <div style="padding: 40px 35px 25px 35px;">
              <h3 style="margin-top: 0; font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: ${systemConfig.primaryColor}; border-bottom: 1px solid rgba(197, 160, 89, 0.15); padding-bottom: 8px; margin-bottom: 20px;">📋 Datos de la Reserva</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
                <tr>
                  <td style="padding: 6px 0; color: #6E5F61; width: 120px; font-weight: 600; border-bottom: 1px dashed rgba(43, 27, 30, 0.05);">Cliente</td>
                  <td style="padding: 6px 0; color: #2B1B1E; font-weight: bold; border-bottom: 1px dashed rgba(43, 27, 30, 0.05);">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6E5F61; font-weight: 600; border-bottom: 1px dashed rgba(43, 27, 30, 0.05);">Teléfono</td>
                  <td style="padding: 6px 0; color: #2B1B1E; font-weight: bold; border-bottom: 1px dashed rgba(43, 27, 30, 0.05);"><a href="tel:${customerPhone}" style="color: ${systemConfig.primaryColor}; text-decoration: none;">${customerPhone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6E5F61; font-weight: 600; border-bottom: 1px dashed rgba(43, 27, 30, 0.05);">Fecha</td>
                  <td style="padding: 6px 0; color: #2B1B1E; font-weight: bold; border-bottom: 1px dashed rgba(43, 27, 30, 0.05);">${new Date(eventDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6E5F61; font-weight: 600; border-bottom: 1px dashed rgba(43, 27, 30, 0.05);">Hora</td>
                  <td style="padding: 6px 0; color: #2B1B1E; font-weight: bold; border-bottom: 1px dashed rgba(43, 27, 30, 0.05);">${eventTime}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6E5F61; font-weight: 600; border-bottom: 1px dashed rgba(43, 27, 30, 0.05);">Personas</td>
                  <td style="padding: 6px 0; color: #2B1B1E; font-weight: bold; border-bottom: 1px dashed rgba(43, 27, 30, 0.05);"><span style="background-color: rgba(107, 26, 42, 0.08); color: ${systemConfig.primaryColor}; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 800;">${peopleCount} personas</span></td>
                </tr>
                ${notes ? `
                <tr>
                  <td style="padding: 8px 0; color: #6E5F61; font-weight: 600; vertical-align: top;">Notas</td>
                  <td style="padding: 8px 0; color: #6E5F61; font-style: italic; font-size: 13px; line-height: 1.4;">"${notes}"</td>
                </tr>
                ` : ""}
              </table>
            </div>

            <!-- Items Table -->
            <div style="padding: 0 35px 35px 35px;">
              <h3 style="margin-top: 0; font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: ${systemConfig.primaryColor}; border-bottom: 1px solid rgba(197, 160, 89, 0.15); padding-bottom: 8px; margin-bottom: 20px;">🍽️ Platos Seleccionados</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr style="border-bottom: 2px solid rgba(197, 160, 89, 0.2); text-align: left;">
                    <th style="padding: 10px 0; color: #2B1B1E; font-weight: bold;">Plato</th>
                    <th style="padding: 10px 0; color: #2B1B1E; font-weight: bold; text-align: center; width: 60px;">Cant.</th>
                    <th style="padding: 10px 0; color: #2B1B1E; font-weight: bold; text-align: right; width: 90px;">Precio</th>
                    <th style="padding: 10px 0; color: #2B1B1E; font-weight: bold; text-align: right; width: 100px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map((item) => {
                    const price = Number(item.price);
                    const subtotal = price * item.quantity;
                    return `
                      <tr style="border-bottom: 1px solid rgba(197, 160, 89, 0.08);">
                        <td style="padding: 12px 0; color: #2B1B1E; font-weight: 600;">${item.dishName}</td>
                        <td style="padding: 12px 0; color: #6E5F61; text-align: center; font-weight: bold;">${item.quantity}</td>
                        <td style="padding: 12px 0; color: #6E5F61; text-align: right;">${systemConfig.currencySymbol} ${price.toFixed(2)}</td>
                        <td style="padding: 12px 0; color: ${systemConfig.primaryColor}; text-align: right; font-weight: bold;">S/ ${subtotal.toFixed(2)}</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>

              <!-- Total price -->
              <div style="margin-top: 25px; text-align: right; font-size: 16px;">
                <span style="color: #6E5F61; font-weight: 600; margin-right: 10px;">Total Estimado:</span>
                <span style="color: ${systemConfig.primaryColor}; font-family: Georgia, serif; font-size: 24px; font-weight: 900; border-bottom: 2px double ${systemConfig.secondaryColor}; padding-bottom: 2px;">
                  S/ ${order.items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            </div>
            
            <!-- Call to action / Admin Link -->
            <div style="background-color: #FAF6F0; padding: 30px; text-align: center; border-top: 1px solid rgba(197, 160, 89, 0.15);">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/admin" style="display: inline-block; background-color: ${systemConfig.primaryColor}; color: #FFFFFF; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(107, 26, 42, 0.15); transition: all 0.2s ease;">Gestionar en el Panel</a>
            </div>

            <!-- Footer -->
            <div style="background-color: #2B1B1E; padding: 25px; text-align: center; color: rgba(250, 246, 240, 0.6); font-size: 11px; font-weight: 500; letter-spacing: 0.5px;">
              &copy; ${new Date().getFullYear()} RESTO-CMS · DISEÑO Y EXCELENCIA PREMIUM
            </div>
          </div>
        </div>
      `;

      try {
        const fromEmail = process.env.NOTIFICATION_EMAIL_FROM;
        const toEmail = systemConfig.email;

        if (!fromEmail || !toEmail) {
          console.warn("Email notification skipped: missing configuration");
        } else {
          await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: `Nuevo pedido - ${branch.name} - ${customerName}`,
            html: emailHtml,
          });
        }
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
      }
    }

    return NextResponse.json(
      {
        message: "Pedido registrado exitosamente",
        orderId: order.id,
        whatsappUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
