import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './src/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic = path === '/login' || path === '/register' || path === '/';

  const token = request.cookies.get('token')?.value;

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      const payload = await verifyJWT(token);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.id);
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch {
      if (!isPublic) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};