import jwt from "jsonwebtoken";
import { TOKEN_EXPIRY } from "./constants";

const JWT_SECRET = process.env.JWT_SECRET || "default_development_secret_key_123456789";

export interface SessionPayload {
  userId: string;
  email: string;
}

export function createToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}
