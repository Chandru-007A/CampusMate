import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const isPublicPath = 
    path === '/' || 
    path === '/login' || 
    path === '/register' ||
    path.startsWith('/api/auth/login') ||
    path.startsWith('/api/auth/register') ||
    path.startsWith('/api/predict') ||
    path.startsWith('/api/chatbot') ||
    path.startsWith('/api/colleges');

  // For now, allow all paths (mock authentication mode)
  // In production, you would check for proper JWT tokens here
  // const token = request.cookies.get('token')?.value;
  // if (!isPublicPath && !token) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};