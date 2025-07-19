import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard'];
// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/auth/signin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('monkci_token')?.value;

  // Debug logging
  console.log('Middleware - Path:', pathname);
  console.log('Middleware - Token exists:', !!token);

  // For now, we'll just check if the token exists
  // The actual authentication will be handled by the backend API calls
  const hasToken = !!token;
  
  console.log('Middleware - Has token:', hasToken);

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (hasToken) {
      console.log('Middleware - Redirecting user with token from auth page to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!hasToken) {
      console.log('Middleware - Redirecting user without token from dashboard to signin');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
}; 