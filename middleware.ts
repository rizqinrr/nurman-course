import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const path = request.nextUrl.pathname;

  // Proteksi rute /app (LMS)
  if (path.startsWith('/app')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectedFrom', path);
      return NextResponse.redirect(url);
    }

    // Proteksi rute admin /app/admin
    if (path.startsWith('/app/admin')) {
      const role = user.user_metadata?.role || 'peserta';
      if (role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/app/dashboard';
        return NextResponse.redirect(url);
      }
    }
  }

  // Redirect jika sudah login tapi coba buka /login
  if (path === '/login' && user) {
    const role = user.user_metadata?.role || 'peserta';
    const redirectPath = role === 'admin' ? '/app/admin' : '/app/dashboard';
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
