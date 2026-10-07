import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from './lib/session';
import { isBadBot } from './lib/antiBot';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userAgent = req.headers.get('user-agent');

  // 1. Silent Bot & Scraper Filter (Blocks aggressive scrapers & automated vulnerability bots)
  if (!pathname.startsWith('/_next') && !pathname.includes('.')) {
    if (isBadBot(userAgent)) {
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  // 2. If visiting admin login page and already logged in, redirect to dashboard
  if (pathname === '/admin/login') {
    if (session) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // 3. Protect /admin/* routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Attach Security Headers
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noarchive, noimageindex');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
