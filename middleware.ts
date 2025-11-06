import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-this'
);

// Define route permissions
const routePermissions: Record<string, string[]> = {
  '/admin': ['admin'],
  '/reports': ['admin'],
  '/': ['kasir'],
  '/cart': ['kasir'],
  '/receipt': ['kasir'],
  '/riwayat': ['kasir'],
};

async function verifyToken(token: string): Promise<{ userId: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      role: payload.role as string,
    };
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (pathname === '/login' || pathname.startsWith('/api/auth/login')) {
    return NextResponse.next();
  }

  // Get session token from cookie
  const token = request.cookies.get('session_token')?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check route permissions
  for (const [route, allowedRoles] of Object.entries(routePermissions)) {
    if (pathname === route || (route !== '/' && pathname.startsWith(route))) {
      if (!allowedRoles.includes(payload.role)) {
        // Redirect to appropriate page based on role
        const redirectUrl = payload.role === 'admin' ? '/admin' : '/';
        
        // Prevent redirect loop - don't redirect if already on target page
        if (pathname !== redirectUrl) {
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
      }
      // If role is allowed, continue
      return NextResponse.next();
    }
  }

  // For routes not in routePermissions, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
