import express, { type ErrorRequestHandler } from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getUser, findUnique, sessionFindMany, sessionFindUnique, createUser, prismaCreate, openTestServer,
} from './setup';
import { app } from '../src/index';
import {
  readHttpSecurityConfig, installHttpSecurity, httpErrorHandler, type HttpSecurityConfig,
} from '../src/middleware/http-security';

function expectConfigError(env: NodeJS.ProcessEnv, variable: string) {
  let thrown: unknown;
  try {
    readHttpSecurityConfig(env);
  } catch (error) {
    thrown = error;
  }
  expect(thrown).toBeInstanceOf(Error);
  if (!(thrown instanceof Error)) throw new Error(`Expected configuration error for ${variable}`);
  expect(thrown.message).toContain(variable);
  const value = env[variable];
  if (value?.trim()) expect(thrown.message).not.toContain(value);
}

function headerTokens(value: string | undefined) {
  return (value ?? '').split(',').map((token) => token.trim().toLowerCase()).filter(Boolean).sort();
}

function rateLimitedApp(rateLimitMax = 2) {
  const fixture = express();
  installHttpSecurity(fixture, {
    production: false,
    allowedOrigins: ['http://localhost:3000'],
    rateLimitMax,
    rateLimitWindowMs: 60_000,
    authRateLimitMax: 1,
    authRateLimitWindowMs: 900_000,
  });
  fixture.get('/api/health', (_req, res) => { res.json({ status: 'ok' }); });
  fixture.post('/api/auth/resolve-phone', (_req, res) => { res.json({ resolved: true }); });
  fixture.get('/api/users/me', (_req, res) => { res.json({ profile: 'fixture' }); });
  return fixture;
}

function captureHttpLogs() {
  const stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  return {
    stdout,
    error,
    text: () => [...stdout.mock.calls, ...error.mock.calls].flat().map(String).join('\n'),
    restore: () => { stdout.mockRestore(); error.mockRestore(); },
  };
}

afterEach(() => {
  for (const boundary of [getUser, findUnique, sessionFindMany, sessionFindUnique, createUser, prismaCreate]) {
    expect.soft(boundary).not.toHaveBeenCalled();
  }
});

describe('readHttpSecurityConfig', () => {
  it('defaults development and test to the approved local origin and per-process quotas', () => {
    for (const NODE_ENV of [undefined, 'development', 'test']) {
      expect(readHttpSecurityConfig({ NODE_ENV })).toEqual({
        production: false,
        allowedOrigins: ['http://localhost:3000'],
        rateLimitMax: 300,
        rateLimitWindowMs: 60_000,
        authRateLimitMax: 10,
        authRateLimitWindowMs: 900_000,
      });
    }
  });

  it('reads explicit production origins and all four custom quota settings from the supplied environment', () => {
    expect(readHttpSecurityConfig({
      NODE_ENV: 'production',
      HTTP_ALLOWED_ORIGINS: 'https://portal.example.test,https://admin.example.test:8443',
      HTTP_RATE_LIMIT_MAX: '120',
      HTTP_RATE_LIMIT_WINDOW_MS: '30000',
      HTTP_AUTH_RATE_LIMIT_MAX: '5',
      HTTP_AUTH_RATE_LIMIT_WINDOW_MS: '600000',
    })).toEqual({
      production: true,
      allowedOrigins: ['https://portal.example.test', 'https://admin.example.test:8443'],
      rateLimitMax: 120,
      rateLimitWindowMs: 30_000,
      authRateLimitMax: 5,
      authRateLimitWindowMs: 600_000,
    });
  });

  it('requires an explicit nonempty production allowlist instead of using the local default', () => {
    for (const HTTP_ALLOWED_ORIGINS of [undefined, '', '   ', ',']) {
      expectConfigError({ NODE_ENV: 'production', HTTP_ALLOWED_ORIGINS }, 'HTTP_ALLOWED_ORIGINS');
    }
  });

  it('rejects every production allowlist containing a non-HTTPS origin', () => {
    for (const HTTP_ALLOWED_ORIGINS of [
      'http://localhost:3000',
      'http://portal.example.test',
      'https://portal.example.test,http://admin.example.test',
    ]) {
      expectConfigError({ NODE_ENV: 'production', HTTP_ALLOWED_ORIGINS }, 'HTTP_ALLOWED_ORIGINS');
    }
  });

  it('rejects malformed or non-exact origins in every mode without echoing configuration values', () => {
    for (const NODE_ENV of ['development', 'test', 'production']) {
      for (const HTTP_ALLOWED_ORIGINS of [
        '*',
        'null',
        'not-an-origin',
        'ftp://portal.example.test',
        'https://*.example.test',
        'https://portal.example.test/',
        'https://portal.example.test/path',
        'https://portal.example.test?private-query=fixture',
        'https://portal.example.test#private-fragment',
        'https://config-user-fixture:config-password-fixture@portal.example.test',
        'https://portal.example.test,https://admin.example.test/path',
      ]) {
        expectConfigError({ NODE_ENV, HTTP_ALLOWED_ORIGINS }, 'HTTP_ALLOWED_ORIGINS');
      }
    }
  });

  it.each([
    'HTTP_RATE_LIMIT_MAX',
    'HTTP_RATE_LIMIT_WINDOW_MS',
    'HTTP_AUTH_RATE_LIMIT_MAX',
    'HTTP_AUTH_RATE_LIMIT_WINDOW_MS',
  ])('rejects invalid %s values rather than falling back or exposing their contents', (variable) => {
    const invalid = ['', ' ', '0', '-1', '1.5', 'NaN', 'Infinity', '9007199254740992', 'limit-private-fixture'];
    if (variable.endsWith('_WINDOW_MS')) invalid.push('2147483648');
    for (const value of invalid) {
      expectConfigError({ NODE_ENV: 'test', [variable]: value }, variable);
    }
  });

  it('accepts one as the minimum and safe integer or timer maximum boundaries', () => {
    for (const [maximum, window] of [[1, 1], [Number.MAX_SAFE_INTEGER, 2_147_483_647]]) {
      expect(readHttpSecurityConfig({
        NODE_ENV: 'test',
        HTTP_RATE_LIMIT_MAX: String(maximum),
        HTTP_RATE_LIMIT_WINDOW_MS: String(window),
        HTTP_AUTH_RATE_LIMIT_MAX: String(maximum),
        HTTP_AUTH_RATE_LIMIT_WINDOW_MS: String(window),
      })).toEqual({
        production: false,
        allowedOrigins: ['http://localhost:3000'],
        rateLimitMax: maximum,
        rateLimitWindowMs: window,
        authRateLimitMax: maximum,
        authRateLimitWindowMs: window,
      });
    }
  });
});

describe('HTTP security on the real app', () => {
  it('adds security headers and removes Express disclosure from health responses', async () => {
    const response = await request(await openTestServer(app)).get('/api/health')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(200);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['content-security-policy']).toEqual(expect.any(String));
    expect(response.headers['content-security-policy'].length).toBeGreaterThan(0);
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('echoes only the exact allowed origin without enabling credentials', async () => {
    const response = await request(await openTestServer(app)).get('/api/health')
      .set('Origin', 'http://localhost:3000').timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect(headerTokens(response.headers.vary)).toContain('origin');
    expect(response.headers['access-control-allow-credentials']).toBeUndefined();
  });

  it('preserves authentication rejection and CORS headers for an allowed origin without touching SDKs', async () => {
    const response = await request(await openTestServer(app)).get('/api/users/me')
      .set('Origin', 'http://localhost:3000').timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Missing or invalid token format' });
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect(headerTokens(response.headers.vary)).toContain('origin');
    expect(response.headers['access-control-allow-credentials']).toBeUndefined();
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it.each(['http://localhost:3000.evil.test', 'null'])(
    'rejects Origin %s before authentication or database access', async (origin) => {
      const response = await request(await openTestServer(app)).get('/api/users/me')
        .set('Origin', origin).set('Authorization', 'Bearer origin-rejection-fixture')
        .timeout({ response: 1000, deadline: 3000 });
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: { code: 'ORIGIN_NOT_ALLOWED', message: 'Origin is not allowed' } });
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
      expect(response.headers['access-control-allow-credentials']).toBeUndefined();
      expect(headerTokens(response.headers.vary)).toContain('origin');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    },
  );

  it('allows requests without Origin while retaining endpoint authentication and cache variation', async () => {
    const server = await openTestServer(app);
    const health = await request(server).get('/api/health').timeout({ response: 1000, deadline: 3000 });
    const profile = await request(server).get('/api/users/me').timeout({ response: 1000, deadline: 3000 });
    expect(health.status).toBe(200);
    expect(health.body).toMatchObject({ status: 'ok', service: 'nurman-course-api' });
    expect(profile.status).toBe(401);
    expect(profile.body).toEqual({ error: 'Unauthorized: Missing or invalid token format' });
    for (const response of [health, profile]) {
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
      expect(response.headers['access-control-allow-credentials']).toBeUndefined();
      expect(headerTokens(response.headers.vary)).toContain('origin');
    }
  });

  it('answers allowed preflight before authentication with only the approved methods and headers', async () => {
    const response = await request(await openTestServer(app)).options('/api/users/me')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'PATCH')
      .set('Access-Control-Request-Headers', 'Authorization, Content-Type')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(204);
    expect(response.text).toBe('');
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect(headerTokens(response.headers['access-control-allow-methods']))
      .toEqual(['delete', 'get', 'options', 'patch', 'post', 'put']);
    expect(headerTokens(response.headers['access-control-allow-headers']))
      .toEqual(['authorization', 'content-type']);
    expect(response.headers['access-control-allow-credentials']).toBeUndefined();
    expect(headerTokens(response.headers.vary)).toContain('origin');
  });

  it('does not trust forwarding headers in the approved direct Express deployment', () => {
    expect(app.get('trust proxy')).toBe(false);
  });
});

describe('installHttpSecurity', () => {
  it('enables HSTS for an explicitly configured production app', async () => {
    const productionApp = express();
    const config: HttpSecurityConfig = {
      production: true,
      allowedOrigins: ['https://portal.example.test'],
      rateLimitMax: 300,
      rateLimitWindowMs: 60_000,
      authRateLimitMax: 10,
      authRateLimitWindowMs: 900_000,
    };
    installHttpSecurity(productionApp, config);
    productionApp.get('/api/health', (_req, res) => { res.json({ status: 'ok' }); });
    const response = await request(await openTestServer(productionApp)).get('/api/health')
      .set('Origin', 'https://portal.example.test').timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
    expect(response.headers['strict-transport-security']).toMatch(/(?:^|;\s*)max-age=[1-9]\d*(?:;|$)/);
    expect(response.headers['access-control-allow-origin']).toBe('https://portal.example.test');
    expect(response.headers['access-control-allow-credentials']).toBeUndefined();
    expect(headerTokens(response.headers.vary)).toContain('origin');
  });
});

describe('HTTP rate limiting', () => {
  it('shares the general IP quota across routes and rejects the third request with retry metadata', async () => {
    const server = await openTestServer(rateLimitedApp());
    const first = await request(server).get('/api/health').timeout({ response: 1000, deadline: 3000 });
    const second = await request(server).get('/api/users/me').timeout({ response: 1000, deadline: 3000 });
    const third = await request(server).get('/api/health').timeout({ response: 1000, deadline: 3000 });
    expect([first.status, second.status, third.status]).toEqual([200, 200, 429]);
    expect(third.body).toEqual({ error: { code: 'RATE_LIMITED', message: 'Too many requests' } });
    expect(third.headers['retry-after']).toMatch(/^[1-9]\d*$/);
    expect(Number(third.headers['retry-after'])).toBeLessThanOrEqual(60);
    expect(third.headers.ratelimit).toEqual(expect.any(String));
    expect(third.headers.ratelimit.length).toBeGreaterThan(0);
    expect(third.headers['ratelimit-policy']).toEqual(expect.any(String));
  });

  it('limits resolve-phone independently without blocking unrelated health requests', async () => {
    const server = await openTestServer(rateLimitedApp(20));
    const first = await request(server).post('/api/auth/resolve-phone').timeout({ response: 1000, deadline: 3000 });
    const second = await request(server).post('/api/auth/resolve-phone').timeout({ response: 1000, deadline: 3000 });
    const health = await request(server).get('/api/health').timeout({ response: 1000, deadline: 3000 });
    expect([first.status, second.status, health.status]).toEqual([200, 429, 200]);
    expect(second.body).toEqual({ error: { code: 'RATE_LIMITED', message: 'Too many requests' } });
    expect(second.headers['retry-after']).toMatch(/^[1-9]\d*$/);
    expect(Number(second.headers['retry-after'])).toBeLessThanOrEqual(900);
    expect(health.body).toEqual({ status: 'ok' });
  });

  it('cannot evade the direct-IP quota with changing forwarding headers and does not log credentials or raw headers', async () => {
    const server = await openTestServer(rateLimitedApp());
    const logs = captureHttpLogs();
    try {
      const statuses: number[] = [];
      for (const host of ['198.51.100.1', '198.51.100.2', '198.51.100.3']) {
        const response = await request(server).get('/api/health')
          .set('X-Forwarded-For', host)
          .set('Forwarded', `for=${host};host=forwarded-private-fixture;proto=https`)
          .set('Authorization', 'Bearer forwarding-token-private-fixture')
          .timeout({ response: 1000, deadline: 3000 });
        statuses.push(response.status);
      }
      expect.soft(statuses).toEqual([200, 200, 429]);
      for (const privateValue of [
        '198.51.100.', 'forwarded-private-fixture', 'forwarding-token-private-fixture',
      ]) {
        expect.soft(logs.text()).not.toContain(privateValue);
      }
    } finally {
      logs.restore();
    }
  });

  it('does not consume the general or resolve-phone quota for allowed CORS preflights', async () => {
    const server = await openTestServer(rateLimitedApp());
    for (let count = 0; count < 3; count++) {
      const response = await request(server).options('/api/auth/resolve-phone')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type')
        .timeout({ response: 1000, deadline: 3000 });
      expect(response.status).toBe(204);
    }
    const resolve = await request(server).post('/api/auth/resolve-phone').timeout({ response: 1000, deadline: 3000 });
    const health = await request(server).get('/api/health').timeout({ response: 1000, deadline: 3000 });
    const exhausted = await request(server).get('/api/health').timeout({ response: 1000, deadline: 3000 });
    expect([resolve.status, health.status, exhausted.status]).toEqual([200, 200, 429]);
  });

  it('uses a separate memory quota for each installed app instance', async () => {
    const firstServer = await openTestServer(rateLimitedApp(1));
    const secondServer = await openTestServer(rateLimitedApp(1));
    const first = await request(firstServer).get('/api/health').timeout({ response: 1000, deadline: 3000 });
    const exhausted = await request(firstServer).get('/api/health').timeout({ response: 1000, deadline: 3000 });
    const independent = await request(secondServer).get('/api/health').timeout({ response: 1000, deadline: 3000 });
    expect([first.status, exhausted.status, independent.status]).toEqual([200, 429, 200]);
  });

  it('advertises the approved general quota of 300 per minute on the real app', async () => {
    const response = await request(await openTestServer(app)).get('/api/health')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(200);
    expect(response.headers.ratelimit).toEqual(expect.any(String));
    expect(response.headers['ratelimit-policy']).toMatch(/(?:^|[=\s,])300(?:;|\s|$)/);
    expect(response.headers['ratelimit-policy']).toMatch(/(?:^|[;\s])w=60(?:;|\s|$)/);
  });
});

describe('HTTP parser errors on the real app', () => {
  it.each([
    {
      name: 'malformed JSON',
      body: '{"proof":"malformed-private-fixture",',
      contentType: 'application/json',
      status: 400,
      code: 'INVALID_JSON',
      message: 'Invalid JSON body',
      privateValue: 'malformed-private-fixture',
    },
    {
      name: 'JSON exceeding the existing 100kb limit',
      body: JSON.stringify({ proof: `oversized-private-fixture${'x'.repeat(100 * 1024)}` }),
      contentType: 'application/json',
      status: 413,
      code: 'PAYLOAD_TOO_LARGE',
      message: 'Request body is too large',
      privateValue: 'oversized-private-fixture',
    },
    {
      name: 'unsupported JSON charset',
      body: '{"proof":"charset-private-fixture"}',
      contentType: 'application/json; charset=iso-8859-1',
      status: 415,
      code: 'UNSUPPORTED_MEDIA_TYPE',
      message: 'Unsupported request encoding',
      privateValue: 'charset-private-fixture',
    },
  ])('returns a safe $status envelope for $name before handlers or SDKs', async ({
    body, contentType, status, code, message, privateValue,
  }) => {
    const logs = captureHttpLogs();
    try {
      const response = await request(await openTestServer(app)).post('/api/parser-fixture')
        .set('Content-Type', contentType).set('Authorization', 'Bearer parser-token-private-fixture')
        .send(body).timeout({ response: 1000, deadline: 3000 });
      expect.soft(response.status).toBe(status);
      expect.soft(response.body).toEqual({ error: { code, message } });
      expect.soft(response.headers['content-type']).toMatch(/^application\/json\b/);
      expect.soft(response.text).not.toContain(privateValue);
      expect.soft(response.text).not.toMatch(/SyntaxError|PayloadTooLargeError|UnsupportedMediaTypeError|\bat \S+ \(/);
      expect.soft(logs.text()).not.toContain(privateValue);
      expect.soft(logs.text()).not.toContain('parser-token-private-fixture');
    } finally {
      logs.restore();
    }
  });
});

describe('HTTP error and request logging', () => {
  it('preserves a safe 400 response for malformed URL parameters', async () => {
    const response = await request(await openTestServer(app)).get('/api/programs/%ZZ')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: { code: 'INVALID_REQUEST', message: 'Invalid request URL' } });
    expect(response.text).not.toMatch(/URIError|%ZZ|decode_param/);
  });

  it('returns a generic 500 and logs only a generic string for unexpected errors', async () => {
    const fixture = rateLimitedApp();
    fixture.get('/api/error-fixture', (_req, _res, next) => { next(new Error('exception-secret-fixture')); });
    const errorHandler: ErrorRequestHandler = httpErrorHandler;
    expect(errorHandler).toBeTypeOf('function');
    fixture.use(errorHandler);
    const logs = captureHttpLogs();
    try {
      const response = await request(await openTestServer(fixture)).get('/api/error-fixture')
        .timeout({ response: 1000, deadline: 3000 });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
      expect(response.text).not.toContain('exception-secret-fixture');
      expect(logs.error.mock.calls).toEqual([[expect.any(String)]]);
      expect(logs.text()).not.toContain('exception-secret-fixture');
      expect(logs.text()).not.toMatch(/\bat \S+ \(/);
    } finally {
      logs.restore();
    }
  });

  it('logs unknown HTTP requests without raw paths, query values, tokens, headers or bodies', async () => {
    const logs = captureHttpLogs();
    try {
      const response = await request(await openTestServer(app)).post('/api/secret-fixture?token=private-fixture')
        .set('Authorization', 'Bearer logging-token-fixture')
        .set('X-Forwarded-For', '198.51.100.42')
        .set('Forwarded', 'for=198.51.100.42;host=logging-header-fixture')
        .send({ proof: 'logging-body-fixture' }).timeout({ response: 1000, deadline: 3000 });
      expect(response.status).toBe(404);
      expect(logs.stdout).toHaveBeenCalled();
      for (const privateValue of [
        'secret-fixture', 'private-fixture', 'logging-token-fixture',
        '198.51.100.42', 'logging-header-fixture', 'logging-body-fixture',
      ]) {
        expect.soft(logs.text()).not.toContain(privateValue);
      }
    } finally {
      logs.restore();
    }
  });
});
