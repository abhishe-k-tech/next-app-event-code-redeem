import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request) {
  // Get the auth token from cookies
  const authToken = request.cookies.get('authToken')?.value;

  // Check if the path starts with /admin (excluding the login page)
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin';

  // If trying to access admin routes without auth token
  if (isAdminRoute && !isLoginPage && !authToken) {
    // Redirect to admin login page
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // If trying to access login page with valid auth token
  if (isLoginPage && authToken) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};