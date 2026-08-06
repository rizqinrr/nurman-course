import { createClient as createBrowserClient } from './supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  
  // Ambil token JWT jika berada di browser
  if (typeof window !== 'undefined') {
    const supabase = createBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }
  }

  // Set header default JSON jika mengirim body
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${API_BASE_URL}${cleanPath}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    let message = 'Gagal memproses request.';
    if (typeof errorBody.error === 'string') {
      message = errorBody.error;
    } else if (errorBody.error?.message) {
      message = errorBody.error.message;
      if (errorBody.error.code === 'VALIDATION_ERROR' && errorBody.error.details?.fieldErrors) {
        const fieldErrors = errorBody.error.details.fieldErrors;
        const detailMsgs = Object.entries(fieldErrors)
          .map(([field, errs]) => `${field}: ${(errs as string[]).join(', ')}`)
          .join('; ');
        if (detailMsgs) {
          message = `${message} (${detailMsgs})`;
        }
      }
    } else {
      message = `HTTP error! status: ${response.status}`;
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
