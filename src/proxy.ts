import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "./lib/constants";

const protectedPrefixes = ["/api/admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    try {
      if (!process.env.JWT_SECRET) {
        return NextResponse.json(
          { error: "Error en configuración del servidor" },
          { status: 500 }
        );
      }
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: "Sesión inválida o expirada" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
