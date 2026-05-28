// System Configuration Defaults
export const DEFAULT_SYSTEM_CONFIG = {
  businessName: "Rauletti & Co.",
  description: "Repostería fina artesanal con ingredientes premium",
  primaryColor: "#6B1A2A",
  secondaryColor: "#C5A059",
  currencySymbol: "S/",
  timezone: "America/Lima",
  bannerTitle: "El arte de la repostería artesanal",
  bannerText: "Déjate enamorar por nuestras tortas, postres y bebidas exquisitas que preparamos con dedicación.",
  seoTitle: "Rauletti & Co. | Carta Digital de Repostería Fina",
  seoDescription: "Exquisita repostería artesanal con ingredientes premium. Reserva mesas y realiza pedidos en línea.",
  phone: "+51 987 654 321",
  email: "contacto@rauletti.com",
  whatsapp: "+51 987 654 321",
  instagram: "https://instagram.com/rauletti.co",
  facebook: "https://facebook.com/rauletti.co",
  twitter: "https://twitter.com/rauletti",
  tiktok: "https://tiktok.com/@rauletti",
  address: "Av. José Larco 745, Miraflores, Lima",
  maxPeoplePerReservation: 20,
  minOrderAdvanceHours: 2,
};

// Database & Auth Constants
export const SYSTEM_CONFIG_ID = "global_config";
export const AUTH_COOKIE_NAME = "token";
export const TOKEN_EXPIRY = "7d";
export const TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 604800 seconds

// API Response Messages
export const API_MESSAGES = {
  INVALID_DATA: "Datos inválidos",
  INVALID_CREDENTIALS: "Credenciales inválidas",
  SERVER_ERROR: "Error interno del servidor",
  CONFIG_NOT_FOUND: "Configuración del sistema no encontrada",
  UNAUTHORIZED: "No autorizado",
  SUCCESS: "Operación exitosa",
};
