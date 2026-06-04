import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { ThemeSync } from "@/components/ThemeSync";
import { buildThemeCSS } from "@/lib/theme";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resto-CMS | Carta Digital & Reservas Premium",
  description: "Disfruta de la mejor experiencia gastronómica artesanal. Reserva en línea en nuestras sedes y arma tu pedido personalizado.",
};

async function getThemeConfig() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/public/settings`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Failed to fetch theme config:', error);
  }
  return null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeConfig = await getThemeConfig();
  const themeStyles = buildThemeCSS(themeConfig);

  return (
    <html
      lang="es"
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <head>
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeStyles }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-canvas text-charcoal">
        <ThemeSync />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

