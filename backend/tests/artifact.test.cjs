const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const backend = path.resolve(__dirname, '..');
const tempRoot = 'C:/Users/Kiki/AppData/Local/Temp/opencode';

function fixture(t) {
  assert.ok(fs.statSync(tempRoot).isDirectory());
  const root = fs.mkdtempSync(path.join(tempRoot, 'nc-artifact-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const cwd = path.join(root, 'backend');
  fs.mkdirSync(cwd);
  for (const name of ['build.cjs', 'package.json', 'tsconfig.json']) {
    fs.copyFileSync(path.join(backend, name), path.join(cwd, name));
  }
  fs.cpSync(path.join(backend, 'src'), path.join(cwd, 'src'), {
    recursive: true, filter: (source) => path.basename(source) !== 'generated',
  });
  fs.mkdirSync(path.join(cwd, 'prisma'));
  for (const name of ['schema.prisma', 'seed.ts']) {
    fs.copyFileSync(path.join(backend, 'prisma', name), path.join(cwd, 'prisma', name));
  }
  fs.cpSync(path.resolve(backend, '../packages/shared/src'), path.join(root, 'packages/shared/src'), { recursive: true });
  fs.symlinkSync(path.resolve(backend, '../node_modules'), path.join(root, 'node_modules'), 'junction');
  const env = {};
  for (const key of ['SystemRoot', 'WINDIR', 'PATH', 'Path', 'PATHEXT', 'HOME', 'USERPROFILE', 'TEMP', 'TMP']) {
    if (process.env[key]) env[key] = process.env[key];
  }
  Object.assign(env, {
    NODE_ENV: 'production', DATABASE_URL: 'postgresql://fixture:fixture@127.0.0.1:1/fixture',
    DIRECT_URL: 'postgresql://fixture:fixture@127.0.0.1:1/fixture',
    SUPABASE_URL: 'https://artifact.invalid', SUPABASE_ANON_KEY: 'fixture-anon',
    SUPABASE_SERVICE_ROLE_KEY: 'fixture-service', HTTP_ALLOWED_ORIGINS: 'https://artifact.invalid',
    CHECKPOINT_DISABLE: '1', PRISMA_HIDE_UPDATE_MESSAGE: '1', PRISMA_GENERATE_SKIP_AUTOINSTALL: '1',
  });
  const guard = path.join(root, 'network-guard.cjs');
  fs.writeFileSync(guard, `
    exports.connect = require('node:net').Socket.prototype.connect;
    require('node:net').Socket.prototype.connect = () => { throw new Error('No build network'); };
    globalThis.fetch = () => { throw new Error('No build fetch'); };
  `);
  const run = (args) => spawnSync(process.execPath, args, {
    cwd: root, env: { ...env, NODE_OPTIONS: `--require=${JSON.stringify(guard)}` }, encoding: 'utf8', timeout: 120000,
  });
  return { root, cwd, run };
}

function succeeds(result) {
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function compareTree(source, destination) {
  const entries = fs.readdirSync(source, { withFileTypes: true });
  assert.deepEqual(fs.readdirSync(destination).sort(), entries.map((entry) => entry.name).sort());
  for (const entry of entries) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) compareTree(from, to);
    else assert.deepEqual(fs.readFileSync(to), fs.readFileSync(from), entry.name);
  }
}

test('artifact packages Prisma and CommonJS shared runtime without TypeScript stripping', (t) => {
  assert.ok(fs.existsSync(path.join(backend, 'build.cjs')), 'backend/build.cjs must package the runtime');
  const { cwd, run } = fixture(t);
  const dist = path.join(cwd, 'dist');
  fs.mkdirSync(dist);
  fs.writeFileSync(path.join(dist, 'user-owned.txt'), 'preserve');
  succeeds(run([path.join(cwd, 'build.cjs')]));
  assert.equal(fs.readFileSync(path.join(dist, 'user-owned.txt'), 'utf8'), 'preserve');
  compareTree(path.join(cwd, 'src/generated/client'), path.join(dist, 'src/generated/client'));
  const script = `
    const assert = require('node:assert/strict');
    const fs = require('node:fs');
    const path = require('node:path');
    const net = require('node:net');
    const { createRequire } = require('node:module');
    const entry = ${JSON.stringify(path.join(dist, 'src/index.js'))};
    const load = createRequire(entry);
    net.Socket.prototype.connect = () => { throw new Error('No outbound sockets'); };
    globalThis.fetch = () => { throw new Error('No Auth network'); };
    net.Server.prototype.listen = () => { throw new Error('Import must not listen'); };
    const sharedPath = load.resolve('@nurman-course/shared');
    assert.equal(sharedPath, ${JSON.stringify(path.join(dist, 'node_modules/@nurman-course/shared/index.js'))});
    assert.equal(load('@nurman-course/shared').normalizePhone('081234567890'), '6281234567890');
    const { PrismaClient } = load('./generated/client');
    PrismaClient.prototype.$connect = () => { throw new Error('Import must not connect to DB'); };
    const client = new PrismaClient();
    assert.equal(typeof client.user.findUnique, 'function');
    const generated = path.join(path.dirname(entry), 'generated/client');
    const engine = fs.readdirSync(generated).find((name) => /query_engine.*\\.node$/.test(name));
    assert.ok(engine, 'native query engine must be packaged');
    assert.equal(typeof load(path.join(generated, engine)).QueryEngine, 'function');
    const { app, prisma } = load(entry);
    assert.equal(typeof app, 'function');
    assert.ok(prisma instanceof PrismaClient);
    assert.equal(load(entry).prisma, prisma);
    assert.ok(!Object.keys(require.cache).some((file) => file.endsWith('.ts')));
  `;
  succeeds(run(['--no-experimental-strip-types', '-e', script]));
  const preload = path.join(cwd, 'startup-smoke.cjs');
  fs.writeFileSync(preload, `
    const assert = require('node:assert/strict');
    const net = require('node:net');
    const http = require('node:http');
    const entry = ${JSON.stringify(path.join(dist, 'src/index.js'))};
    const { prisma } = require(${JSON.stringify(path.join(dist, 'src/lib/prisma.js'))});
    let connects = 0;
    let sockets = 0;
    const { connect } = require(${JSON.stringify(path.resolve(cwd, '../network-guard.cjs'))});
    net.Socket.prototype.connect = function(options, ...args) {
      const target = Array.isArray(options) ? options[0] : options;
      assert.equal(target.host, '127.0.0.1', 'Only loopback sockets allowed');
      sockets++;
      return connect.call(this, options, ...args);
    };
    prisma.$connect = async () => { connects++; };
    prisma.$use(() => { throw new Error('No database queries'); });
    globalThis.fetch = () => { throw new Error('No Auth network'); };
    const listen = net.Server.prototype.listen;
    net.Server.prototype.listen = function(port, host, callback) {
      assert.equal(host, '127.0.0.1');
      assert.equal(connects, 1);
      const server = this;
      return listen.call(server, 0, host, async () => {
        try {
          callback();
          assert.equal(require.cache[entry].id, '.');
          for (const [route, status] of [['/api/health', 200], ['/api/users/me', 401]]) {
            const response = await new Promise((resolve, reject) => {
              const req = http.get({ host, port: server.address().port, path: route, agent: false }, (res) => {
                let body = '';
                res.setEncoding('utf8').on('data', (chunk) => { body += chunk; });
                res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
              });
              req.on('error', reject);
              req.setTimeout(3000, () => req.destroy(new Error('Smoke request timeout')));
            });
            assert.equal(response.status, status);
            if (status === 200) assert.equal(response.body.service, 'nurman-course-api');
            else assert.equal(response.body.error, 'Unauthorized: Missing or invalid token format');
          }
          assert.equal(sockets, 2);
          assert.ok(!Object.keys(require.cache).some((file) => file.endsWith('.ts')));
          process.stdout.write('STARTUP_SMOKE_OK\\n');
        } catch (error) { process.stderr.write(error.stack + '\\n'); process.exitCode = 1; }
        finally { server.close(); }
      });
    };
  `);
  const startup = run(['--no-experimental-strip-types', '--require', preload, path.join(dist, 'src/index.js')]);
  succeeds(startup);
  assert.match(startup.stdout, /STARTUP_SMOKE_OK/);
});

test('failed generation or compilation preserves existing artifact and rejects alternate output', (t) => {
  const { cwd, run } = fixture(t);
  const dist = path.join(cwd, 'dist');
  fs.mkdirSync(dist);
  fs.writeFileSync(path.join(dist, 'user-owned.txt'), 'preserve');
  const schema = path.join(cwd, 'prisma/schema.prisma');
  fs.renameSync(schema, schema + '.saved');
  assert.match(run([path.join(cwd, 'build.cjs')]).stderr, /Prisma generation failed/);
  fs.renameSync(schema + '.saved', schema);
  fs.writeFileSync(path.join(cwd, 'src/broken.ts'), 'const value: string = 123;');
  const failed = run([path.join(cwd, 'build.cjs')]);
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /Backend compilation failed/);
  assert.equal(fs.readFileSync(path.join(dist, 'user-owned.txt'), 'utf8'), 'preserve');
  assert.deepEqual(fs.readdirSync(dist), ['user-owned.txt']);
  const rejected = run([path.join(cwd, 'build.cjs'), '--outDir', cwd]);
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /Usage:/);
});
