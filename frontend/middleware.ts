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

    const role = user.user_metadata?.role || 'wali';

    if (role !== 'admin') {
      // 1. User biasa ber-role 'wali'
      if (role === 'wali') {
        // Wali dilarang mengakses /app (portal selector), /app/admin/*, dan /app/tentor/*
        if (path === '/app' || path.startsWith('/app/admin') || path.startsWith('/app/tentor')) {
          const url = request.nextUrl.clone();
          url.pathname = '/app/dashboard';
          return NextResponse.redirect(url);
        }
      }

      // 2. User biasa ber-role 'tentor'
      if (role === 'tentor') {
        // Tentor hanya boleh mengakses /app/tentor/*
        // Dilarang mengakses /app (portal selector), /app/admin/*, dan halaman wali
        const isTentorPath = path.startsWith('/app/tentor');
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
