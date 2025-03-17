import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Skip auth check for public routes and static assets
    if (
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/static') ||
      request.nextUrl.pathname === '/favicon.ico'
    ) {
      return res;
    }

    // Handle auth callback separately
    if (request.nextUrl.pathname.startsWith('/auth/callback')) {
      return res;
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Auth routes handling
    if (session) {
      // Redirect authenticated users away from auth pages and landing
      if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      // Redirect unauthenticated users away from protected routes
      if (!request.nextUrl.pathname.startsWith('/auth') && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 