import express, { type Express, type ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';

export interface HttpSecurityConfig {
  production: boolean;
  allowedOrigins: string[];
  rateLimitMax: number;
  rateLimitWindowMs: number;
  authRateLimitMax: number;
  authRateLimitWindowMs: number;
}

function positiveInteger(env: NodeJS.ProcessEnv, key: string, fallback: number, maximum = Number.MAX_SAFE_INTEGER): number {
  const raw = env[key];
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!/^\d+$/.test(raw) || !Number.isSafeInteger(value) || value < 1 || value > maximum) {
    throw new Error(`Invalid ${key}`);
  }
  return value;
}

export function readHttpSecurityConfig(env: NodeJS.ProcessEnv): HttpSecurityConfig {
  const production = env.NODE_ENV === 'production';
  const rawOrigins = env.HTTP_ALLOWED_ORIGINS ?? (production ? '' : 'http://localhost:3000');
  const allowedOrigins = rawOrigins.split(',').map((origin) => origin.trim());
  for (const origin of allowedOrigins) {
    try {
      const url = new URL(origin);
      if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin
        || origin.includes('*') || (production && url.protocol !== 'https:')) {
        throw new Error();
      }
    } catch {
      throw new Error('Invalid HTTP_ALLOWED_ORIGINS');
    }
  }
  return {
    production,
    allowedOrigins: [...new Set(allowedOrigins)],
    rateLimitMax: positiveInteger(env, 'HTTP_RATE_LIMIT_MAX', 300),
    rateLimitWindowMs: positiveInteger(env, 'HTTP_RATE_LIMIT_WINDOW_MS', 60_000, 2_147_483_647),
    authRateLimitMax: positiveInteger(env, 'HTTP_AUTH_RATE_LIMIT_MAX', 10),
    authRateLimitWindowMs: positiveInteger(env, 'HTTP_AUTH_RATE_LIMIT_WINDOW_MS', 900_000, 2_147_483_647),
  };
}

export function installHttpSecurity(app: Express, config: HttpSecurityConfig): void {
  app.set('trust proxy', false);
  app.use(morgan(':method :status :response-time ms'));
  app.use(helmet({
    strictTransportSecurity: config.production ? { includeSubDomains: false } : false,
    contentSecurityPolicy: {
      directives: { 'upgrade-insecure-requests': config.production ? [] : null },
    },
  }));
  app.use((req, res, next) => {
    res.vary('Origin');
    const origin = req.headers.origin;
    if (origin !== undefined && !config.allowedOrigins.includes(origin)) {
      res.status(403).json({ error: { code: 'ORIGIN_NOT_ALLOWED', message: 'Origin is not allowed' } });
      return;
    }
    next();
  });
  app.use(cors({
    origin: config.allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['RateLimit', 'RateLimit-Policy', 'Retry-After'],
    credentials: false,
  }));
  const limiter = (limit: number, windowMs: number, identifier: string) => rateLimit({
    limit,
    windowMs,
    identifier,
    requestPropertyName: identifier,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    passOnStoreError: false,
    validate: { xForwardedForHeader: false, forwardedHeader: false },
    logger: {
      error: () => console.error('HTTP rate limiter error'),
      warn: () => console.warn('HTTP rate limiter warning'),
    },
    message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
  });
  app.use('/api', limiter(config.rateLimitMax, config.rateLimitWindowMs, 'api'));
  app.use('/api/auth/resolve-phone', limiter(config.authRateLimitMax, config.authRateLimitWindowMs, 'resolve-phone'));
  app.use('/api/auth/signup', limiter(config.authRateLimitMax, config.authRateLimitWindowMs, 'signup'));
  app.use(express.json({ limit: '100kb' }));
}

export const httpErrorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(new Error('HTTP response failed'));
    return;
  }
  if (error instanceof URIError && 'status' in error && error.status === 400) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid request URL' } });
    return;
  }
  const type = error && typeof error === 'object' && 'type' in error ? error.type : undefined;
  if (type === 'entity.too.large') {
    res.status(413).json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large' } });
    return;
  }
  if (type === 'entity.parse.failed') {
    res.status(400).json({ error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } });
    return;
  }
  if (type === 'charset.unsupported' || type === 'encoding.unsupported') {
    res.status(415).json({ error: { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Unsupported request encoding' } });
    return;
  }
  if (type === 'request.aborted' || type === 'request.size.invalid') {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid request body' } });
    return;
  }
  console.error('HTTP request error');
  res.status(500).json({ error: 'Internal server error' });
};
