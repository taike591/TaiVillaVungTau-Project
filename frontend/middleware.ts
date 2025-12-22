import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/taike-manage')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Redirect to admin if already logged in and trying to access login
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/taike-manage', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/taike-manage/:path*', '/login'],
};
