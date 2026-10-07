import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'gizli_anahtar_ilan_vitrini_super_secret_jwt_key_2026_xyz'
);

export const COOKIE_NAME = 'ilan_vitrini_session';

export interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

// JWT Token generation
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// JWT Token verification (Edge-safe)
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
