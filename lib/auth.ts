import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySessionToken, SessionPayload } from './session';

export { COOKIE_NAME, createSessionToken, verifySessionToken, type SessionPayload } from './session';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Get current session from Next.js cookies
export async function getCurrentUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

// In-memory rate limiting for login attempts
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const loginAttempts = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string, maxAttempts = 5, windowMs = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxAttempts - entry.count };
}

// Clean up stale rate-limit entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    loginAttempts.forEach((entry, key) => {
      if (now > entry.resetTime) {
        loginAttempts.delete(key);
      }
    });
  }, 10 * 60 * 1000);
}
