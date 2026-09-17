import { createServer, type Server } from 'node:http';
import net from 'node:net';
import tls from 'node:tls';
import type { Express } from 'express';
import { afterAll, afterEach, beforeEach, expect, vi } from 'vitest';

const boundary = vi.hoisted(() => {
  for (const key of Object.keys(process.env)) {
    if (/^(HTTP_|SUPABASE_|DATABASE_URL$|DIRECT_URL$|DOTENV_CONFIG_)/.test(key)) {
      delete process.env[key];
    }
  }
  Object.assign(process.env, {
    NODE_ENV: 'test',
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_ANON_KEY: 'test-only-anon-key',
    SUPABASE_SERVICE_ROLE_KEY: 'test-only-service-key',
  });

  const unexpected: string[] = [];
  const fail = (name: string): never => {
    unexpected.push(name);
    throw new Error(`Unexpected test boundary call: ${name}`);
  };
  const stub = (name: string) => vi.fn<(...args: unknown[]) => Promise<unknown>>(
    async () => fail(name),
  );
  const strict = <T extends object>(name: string, target: T): T => new Proxy(target, {
    get(object, key, receiver) {
      if (typeof key === 'string' && !(key in object)) return fail(`${name}.${key}`);
      return Reflect.get(object, key, receiver);
    },
  });
  return {
    unexpected, fail, strict,
    getUser: stub('supabase.auth.getUser'),
    findUnique: stub('prisma.user.findUnique'),
    sessionFindMany: stub('prisma.session.findMany'),
    sessionFindUnique: stub('prisma.session.findUnique'),
    createUser: stub('supabase.admin.createUser'),
    prismaCreate: stub('prisma.user.create'),
    connect: stub('prisma.$connect'),
  };
});

export const { getUser, findUnique, sessionFindMany, sessionFindUnique, createUser, prismaCreate } = boundary;

export const authLookup = (id: string) => ({
  where: { id },
  select: { id: true, email: true, role: true, active: true },
});

export const accountErrors = {
  missing: { error: { code: 'PROFILE_NOT_FOUND', message: 'Profil akun tidak ditemukan. Hubungi admin.' } },
  inactive: {
    error: {
      code: 'ACCOUNT_INACTIVE',
      message: 'Akun nonaktif. Silakan daftar ulang atau hubungi admin. Penggunaan email atau nomor yang sama memerlukan persetujuan admin.',
    },
  },
  role: { error: { code: 'INVALID_ROLE', message: 'Role akun tidak valid. Hubungi admin.' } },
};

vi.mock('dotenv', () => ({ default: { config: () => ({ parsed: {} }) } }));
vi.mock('../src/lib/prisma', () => ({
  prisma: boundary.strict('prisma', {
    user: boundary.strict('prisma.user', { findUnique, create: prismaCreate }),
    session: boundary.strict('prisma.session', {
      findMany: sessionFindMany,
      findUnique: sessionFindUnique,
    }),
    $connect: boundary.connect,
  }),
}));
vi.mock('@supabase/supabase-js', () => ({
  createClient: (_url: string, key: string) => {
    if (key === 'test-only-anon-key') {
      return boundary.strict('supabase', {
        auth: boundary.strict('supabase.auth', { getUser }),
      });
    }
    if (key === 'test-only-service-key') {
      return boundary.strict('supabaseAdmin', {
        auth: boundary.strict('supabaseAdmin.auth', {
          admin: boundary.strict('supabaseAdmin.auth.admin', { createUser }),
        }),
      });
    }
    return boundary.fail('Supabase client with unexpected credentials');
  },
}));

const servers = new Set<Server>();
const ports = new Set<number>();
const originalConnect = net.Socket.prototype.connect;
const originalListen = net.Server.prototype.listen;
const socketSpy = vi.spyOn(net.Socket.prototype, 'connect').mockImplementation(function (
  this: net.Socket, ...args: Parameters<typeof originalConnect>
) {
  const first: unknown = args[0];
  const options: unknown = Array.isArray(first) ? first[0] : first;
  if (options && typeof options === 'object' && 'host' in options && 'port' in options
    && options.host === '127.0.0.1' && ports.has(Number(options.port))) {
    return Reflect.apply(originalConnect, this, args) as net.Socket;
  }
  return boundary.fail('TCP connection outside test server');
});
const listenSpy = vi.spyOn(net.Server.prototype, 'listen').mockImplementation(function (
  this: Server, ...args: Parameters<typeof originalListen>
) {
  const options: unknown = args[0];
  if (servers.has(this) && options && typeof options === 'object'
    && 'host' in options && options.host === '127.0.0.1'
    && 'port' in options && options.port === 0) {
    return Reflect.apply(originalListen, this, args) as Server;
  }
  return boundary.fail('Listener outside test server');
});
const tlsSpy = vi.spyOn(tls, 'connect').mockImplementation(() => boundary.fail('TLS connection'));
const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => boundary.fail('fetch'));

export async function openTestServer(app: Express): Promise<Server> {
  if (typeof app !== 'function') throw new Error('Express app export is required');
  const server = createServer(app);
  servers.add(server);
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen({ host: '127.0.0.1', port: 0 }, () => {
      server.removeListener('error', reject);
      resolve();
    });
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected loopback TCP server');
  ports.add(address.port);
  return server;
}

beforeEach(() => {
  expect([...boundary.unexpected]).toEqual([]);
  for (const [name, mock] of Object.entries({
    getUser, findUnique, sessionFindMany, sessionFindUnique, createUser, prismaCreate, connect: boundary.connect,
  })) {
    mock.mockReset().mockImplementation(async () => boundary.fail(name));
  }
});

afterEach(async () => {
  try {
    await Promise.all([...servers].map(async (server) => {
      server.closeAllConnections();
      if (server.listening) {
        await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
      }
    }));
    expect([...boundary.unexpected]).toEqual([]);
  } finally {
    servers.clear();
    ports.clear();
    boundary.unexpected.length = 0;
  }
});

afterAll(() => {
  socketSpy.mockRestore();
  listenSpy.mockRestore();
  tlsSpy.mockRestore();
  fetchSpy.mockRestore();
});
