import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';
import { isContentReturnPath, safeReturnPath } from './lib/navigation';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const path = request.nextUrl.pathname;

  // Proteksi rute /app (LMS)
  if (path.startsWith('/app')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectedFrom', `${path}${request.nextUrl.search}`);
      return NextResponse.redirect(url);
    }

    const role = user.user_metadata?.role || 'wali';

    if (role !== 'admin') {
      if (role === 'wali') {
        if (path === '/app' || path.startsWith('/app/admin') || path.startsWith('/app/tentor')) {
          const url = request.nextUrl.clone();
          url.pathname = '/app/dashboard';
          return NextResponse.redirect(url);
        }
      }

      if (role === 'tentor') {
        const isTentorPath = path.startsWith('/app/tentor') || path === '/app/materi';
        if (!isTentorPath) {
          const url = request.nextUrl.clone();
          url.pathname = '/app/tentor/dashboard';
          return NextResponse.redirect(url);
        }
      }
    }
  }

  // Redirect jika sudah login tapi coba buka /login
  if (path === '/login' && user) {
    const requestedReturn = safeReturnPath(request.nextUrl.searchParams.get('next') ?? request.nextUrl.searchParams.get('redirectedFrom'));
    if (requestedReturn && isContentReturnPath(requestedReturn)) {
      return NextResponse.redirect(new URL(requestedReturn, request.url));
    }
    const role = user.user_metadata?.role || 'wali';
    let redirectPath = '/app/dashboard';
    if (role === 'admin') {
      redirectPath = '/app/admin';
    } else if (role === 'tentor') {
      redirectPath = '/app/tentor/dashboard';
    }
    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/app/:path*',
    '/login',
  ],
};
