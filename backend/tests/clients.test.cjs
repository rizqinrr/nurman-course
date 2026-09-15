const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const backend = path.resolve(__dirname, '..');

function checkClients(mode, config) {
  const cwd = mkdtempSync(path.join(tmpdir(), 'ncourse-clients-'));
  const env = { ...process.env, TS_NODE_PROJECT: path.join(backend, 'tsconfig.json') };
  for (const key of Object.keys(env)) {
    if (/^(SUPABASE_|DATABASE_URL$|DIRECT_URL$|NODE_ENV$|DOTENV_CONFIG_)/.test(key)) delete env[key];
  }
  writeFileSync(path.join(cwd, '.env'), [
    `NODE_ENV=${mode}`,
    ...(config.url ? ['SUPABASE_URL=https://example.supabase.co'] : []),
    ...(config.key ? ['SUPABASE_SERVICE_ROLE_KEY=test-only-key'] : []),
    'SUPABASE_ANON_KEY=test-only-anon-key',
  ].join('\n'));

  const script = `
    const assert = require('node:assert/strict');
    const Module = require('node:module');
    const net = require('node:net');
    const originalLoad = Module._load;
    let instanceCount = 0;
    let options;
    let queryListener;
    class PrismaClient {
      constructor(config) {
        assert.equal(process.env.NODE_ENV, ${JSON.stringify(mode)});
        instanceCount++;
        options = config;
      }
      $on(event, listener) {
        assert.equal(event, 'query');
        queryListener = listener;
      }
      $connect() { throw new Error('Import must not connect to database'); }
    }
    Module._load = function(request, parent, isMain) {
      if (request === '../generated/client') return { PrismaClient };
      return originalLoad.call(this, request, parent, isMain);
    };
    net.Server.prototype.listen = () => { throw new Error('Import must not start a server'); };
    net.Socket.prototype.connect = () => { throw new Error('Import must not open a connection'); };
    const adminPath = ${JSON.stringify(path.join(backend, 'src/lib/supabase-admin.ts'))};
    const prismaPath = ${JSON.stringify(path.join(backend, 'src/lib/prisma.ts'))};
    const first = ${JSON.stringify(mode)} === 'production' ? prismaPath : adminPath;
    require(first);
    const { prisma } = require(prismaPath);
    const { supabaseAdmin } = require(adminPath);
    assert.equal(require(prismaPath).prisma, prisma);
    assert.equal(require(adminPath).supabaseAdmin, supabaseAdmin);
    assert.equal(instanceCount, 1);
    assert.equal(require.cache[${JSON.stringify(path.join(backend, 'src/index.ts'))}], undefined);
    if (${JSON.stringify(mode)} === 'production') {
      assert.deepEqual(options?.log ?? [], []);
      assert.equal(queryListener, undefined);
    } else {
      assert.deepEqual(options.log, [{ level: 'query', emit: 'event' }]);
      assert.equal(typeof queryListener, 'function');
      const messages = [];
      const log = console.log;
      console.log = (message) => messages.push(message);
      try { queryListener({ query: 'SELECT 1', duration: 7, params: 'never-log-params' }); }
      finally { console.log = log; }
      assert.equal(messages.length, 1);
      assert.match(messages[0], /\\[SQL\\].*SELECT 1.*7ms/);
      assert.ok(!messages[0].includes('never-log-params'));
    }
    if (${config.url && config.key}) {
      assert.ok(supabaseAdmin);
      assert.equal(supabaseAdmin.auth.autoRefreshToken, false);
      assert.equal(supabaseAdmin.auth.persistSession, false);
      assert.equal(require(${JSON.stringify(path.join(backend, 'src/index.ts'))}).prisma, prisma);
      assert.equal(instanceCount, 1);
    } else {
      assert.equal(supabaseAdmin, null);
    }
  `;

  try {
    const result = spawnSync(process.execPath, ['-r', require.resolve('ts-node/register'), '-e', script], {
      cwd, env, encoding: 'utf8', timeout: 20000,
    });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr || result.stdout);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

test('standalone clients load env first, reuse instances and retain development SQL logging', () => {
  checkClients('development', { url: true, key: true });
});

test('production disables query events and permits an unconfigured admin client', () => {
  checkClients('production', { url: false, key: false });
});

test('admin client stays null when service key is absent', () => {
  checkClients('development', { url: true, key: false });
});

test('admin client stays null when URL is absent', () => {
  checkClients('production', { url: false, key: true });
});
