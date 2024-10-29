import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/sign-in', '/sign-up']
const protectedRoutes = [
  '/dashboard',
  '/process',
  '/settings',
]

function matchRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => 
    pathname === route || 
    pathname.startsWith(`${route}/`)
  )
}

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const normalizedPath = pathname.replace(/\/$/, '');
    const isProtectedPath = matchRoute(normalizedPath, protectedRoutes);
    const isPublicPath = matchRoute(normalizedPath, publicRoutes);

    const authSession = request.cookies.get('a_session');

    if (isProtectedPath && !authSession?.value) {
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.set({
        name: 'redirectTo',
        value: pathname,
        path: '/',
        maxAge: 60 * 5,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return response;
    }

    if (isPublicPath && authSession?.value) {
      const redirectTo = request.cookies.get('redirectTo');
      const destination = redirectTo?.value || '/dashboard';
      const response = NextResponse.redirect(new URL(destination, request.url));
      
      if (redirectTo) response.cookies.delete('redirectTo');
      
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
