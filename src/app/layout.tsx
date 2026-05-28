import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resto-CMS | Carta Digital & Reservas Premium",
  description: "Disfruta de la mejor experiencia gastronómica artesanal. Reserva en línea en nuestras sedes y arma tu pedido personalizado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-canvas text-charcoal">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

