import { createClient as createBrowserClient } from './supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

interface CacheEntry {
  data: any;
  timestamp: number;
}

const getCache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000; // 1 Jam dalam milidetik

function invalidateCache(mutatedPath: string) {
  const cleanMutated = mutatedPath.toLowerCase();
  const keysToRemove: string[] = [];

  if (cleanMutated.includes('invoice') || cleanMutated.includes('payment') || cleanMutated.includes('notification')) {
    getCache.forEach((_, key) => {
      const cleanKey = key.toLowerCase();
      if (cleanKey.includes('invoice') || cleanKey.includes('notification') || cleanKey.includes('payment')) {
        keysToRemove.push(key);
      }
    });
  } else if (cleanMutated.includes('report') || cleanMutated.includes('laporan')) {
    getCache.forEach((_, key) => {
      const cleanKey = key.toLowerCase();
      if (cleanKey.includes('report') || cleanKey.includes('laporan')) {
        keysToRemove.push(key);
      }
    });
  } else if (cleanMutated.includes('session') || cleanMutated.includes('jadwal')) {
    getCache.forEach((_, key) => {
      const cleanKey = key.toLowerCase();
      if (cleanKey.includes('session') || cleanKey.includes('jadwal')) {
        keysToRemove.push(key);
      }
    });
  } else if (cleanMutated.includes('profile') || cleanMutated.includes('user') || cleanMutated.includes('me')) {
    getCache.forEach((_, key) => {
      const cleanKey = key.toLowerCase();
      if (cleanKey.includes('profile') || cleanKey.includes('user') || cleanKey.includes('me')) {
        keysToRemove.push(key);
      }
    });
  } else {
    getCache.forEach((_, key) => {
      if (key.toLowerCase().includes(cleanMutated) || cleanMutated.includes(key.toLowerCase())) {
        keysToRemove.push(key);
      }
    });
  }

  keysToRemove.forEach((key) => getCache.delete(key));
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { bypassCache?: boolean } = {}
): Promise<T> {
  const { bypassCache, ...fetchOptions } = options;
  const method = fetchOptions.method || 'GET';
  const isGet = method.toUpperCase() === 'GET';

  if (isGet && !bypassCache) {
    const cached = getCache.get(path);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    }
  }

  if (!isGet) {
    invalidateCache(path);
  }

  const headers = new Headers(fetchOptions.headers);
  
  // Ambil token JWT jika berada di browser
  if (typeof window !== 'undefined') {
    const supabase = createBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }
  }

  // Set header default JSON jika mengirim body
  if (fetchOptions.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${API_BASE_URL}${cleanPath}`, {
    ...fetchOptions,
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

  const data = await response.json();

  if (isGet && !bypassCache) {
    getCache.set(path, { data, timestamp: Date.now() });
  }

  return data as T;
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
