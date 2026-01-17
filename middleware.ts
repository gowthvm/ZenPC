import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old app routes to the unified builder
  if (pathname === '/app' || pathname === '/app/') {
    return NextResponse.redirect(new URL('/builder', request.url));
  }

  // Redirect old guide page to builder with guide tab
  if (pathname === '/guide' || pathname === '/guide/') {
    return NextResponse.redirect(new URL('/builder?tab=guide', request.url));
  }

  // Redirect old account page to builder with account tab
  if (pathname === '/app/account' || pathname === '/app/account/') {
    return NextResponse.redirect(new URL('/builder?tab=profile', request.url));
  }

  // Redirect old dashboard to builder
  if (pathname === '/app/dashboard' || pathname === '/app/dashboard/') {
    return NextResponse.redirect(new URL('/builder', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/app/:path*',
    '/guide',
    '/dashboard',
  ],
};
