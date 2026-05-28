import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1).optional(),
  order: z.number().int().min(0).default(0),
});

export const categoryUpdateSchema = categorySchema.partial();

export const dishSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().nullable(),
  price: z.number().positive("El precio debe ser mayor a 0"),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().uuid("Categoría inválida"),
  order: z.number().int().min(0).default(0),
});

export const dishUpdateSchema = dishSchema.partial();

export const branchSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  imageUrl: z.string().optional().nullable(),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.string().min(1, "El teléfono es requerido"),
  hours: z.record(z.string(), z.string()),
  mapsUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const branchUpdateSchema = branchSchema.partial();

export const orderItemInputSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const publicOrderSchema = z.object({
  customerName: z.string().min(1, "El nombre es requerido"),
  customerPhone: z.string().min(1, "El teléfono es requerido"),
  branchId: z.string().uuid("Sede inválida"),
  eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha inválida",
  }),
  eventTime: z.string().min(1, "La hora es requerida"),
  peopleCount: z.number().int().positive("Debe haber al menos 1 persona"),
  notes: z.string().optional().nullable(),
  dishes: z.array(orderItemInputSchema).min(1, "Debe seleccionar al menos un plato"),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDIENTE", "CONFIRMADO", "EN_PREPARACION", "ENTREGADO", "CANCELADO"]),
});

export const settingsUpdateSchema = z.object({
  logoUrl: z.string().optional().nullable(),
  businessName: z.string().optional(),
  description: z.string().optional().nullable(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  currencySymbol: z.string().optional(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  timezone: z.string().optional(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  bannerTitle: z.string().optional().nullable(),
  bannerText: z.string().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  maxPeoplePerReservation: z.number().int().positive().optional(),
  minOrderAdvanceHours: z.number().int().nonnegative().optional(),
});
