import { NextResponse, type NextRequest } from 'next/server';
import { isContentReturnPath, roleHomePath, safeReturnPath } from './lib/navigation';

async function fetchDbRole(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:5000'}/api/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { user?: { role?: string } };
    return body.user?.role ?? null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value ?? null;
  const path = request.nextUrl.pathname;

  // Proteksi rute /app (LMS)
  if (path.startsWith('/app')) {
    if (!accessToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectedFrom', `${path}${request.nextUrl.search}`);
      return NextResponse.redirect(url);
    }

    const role = await fetchDbRole(accessToken);
    if (!role) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectedFrom', `${path}${request.nextUrl.search}`);
      return NextResponse.redirect(url);
    }

    if (role === 'member') {
      if (path !== '/app/materi') {
        const url = request.nextUrl.clone();
        url.pathname = '/app/materi';
        return NextResponse.redirect(url);
      }
    } else if (role !== 'admin') {
      if (role === 'wali' || role === 'siswa') {
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
  if (path === '/login' && accessToken && request.nextUrl.searchParams.get('mode') !== 'register') {
    const requestedReturn = safeReturnPath(request.nextUrl.searchParams.get('next') ?? request.nextUrl.searchParams.get('redirectedFrom'));
    if (requestedReturn && isContentReturnPath(requestedReturn)) {
      return NextResponse.redirect(new URL(requestedReturn, request.url));
    }
    const role = await fetchDbRole(accessToken);
    if (!role) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = roleHomePath(role);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/app/:path*',
    '/login',
  ],
};
