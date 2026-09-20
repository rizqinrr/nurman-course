import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import ts from 'typescript';

function loadApi() {
  const filename = fileURLToPath(new URL('../lib/api.ts', import.meta.url));
  const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = new Module(filename);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod.require = (name) => {
    assert.equal(name, './supabase/client');
    return { createClient: () => ({ auth: { getSession: async () => ({ data: { session: null } }) } }) };
  };
  mod._compile(source, filename);
  return mod.exports;
}

test('API log snapshots notify, stay stable and do not mutate old snapshots', async (t) => {
  const previousMode = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';
  Object.defineProperty(globalThis, 'window', { value: {}, configurable: true });
  t.after(() => {
    delete globalThis.window;
    if (previousMode === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousMode;
  });
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ value: 1 })));
  const api = loadApi();
  assert.equal(api.getServerLogSnapshot(), null);
  const initial = api.getLogSnapshot();
  assert.equal(api.getLogSnapshot(), initial);
  let updates = 0;
  const unsubscribe = api.addLogListener(() => updates++);
  assert.deepEqual(await api.apiFetch('/api/users/me'), { value: 1 });
  const afterMiss = api.getLogSnapshot();
  assert.equal(afterMiss.length, 1);
  assert.equal(afterMiss[0].cacheStatus, 'MISS');
  assert.equal(initial.length, 0);
  assert.equal(api.getLogSnapshot(), afterMiss);
  await api.apiFetch('/api/users/me');
  assert.equal(fetch.mock.callCount(), 1);
  assert.equal(api.getLogSnapshot()[1].cacheStatus, 'HIT');
  assert.equal(afterMiss.length, 1);
  api.clearFetchLogs();
  assert.equal(updates, 3);
  assert.deepEqual(api.getLogSnapshot(), []);
  unsubscribe();
  api.clearFetchLogs();
  assert.equal(updates, 3);
});

test('cache bypass, invalidation, TTL and errors retain their behavior', async (t) => {
  const api = loadApi();
  let sequence = 0;
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ value: ++sequence })));
  assert.deepEqual(await api.apiFetch('/api/users/me'), { value: 1 });
  assert.deepEqual(await api.apiFetch('/api/users/me'), { value: 1 });
  assert.deepEqual(await api.apiFetch('/api/users/me', { bypassCache: true }), { value: 2 });
  assert.deepEqual(await api.apiFetch('/api/users/me'), { value: 1 });
  await api.apiFetch('/api/admin/users', { method: 'POST', body: '{}' });
  assert.equal(fetch.mock.calls[2].arguments[1].headers.get('Content-Type'), 'application/json');
  assert.deepEqual(await api.apiFetch('/api/users/me'), { value: 4 });
  const now = Date.now();
  t.mock.method(Date, 'now', () => now + 3600001);
  assert.deepEqual(await api.apiFetch('/api/users/me'), { value: 5 });
  fetch.mock.mockImplementation(async () => new Response(JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'Invalid', details: { fieldErrors: { name: ['Required'] } } } }), { status: 400 }));
  await assert.rejects(api.apiFetch('/api/test-error'), { message: 'Invalid (name: Required)' });
  const offline = new Error('offline');
  fetch.mock.mockImplementation(async () => { throw offline; });
  await assert.rejects(api.apiFetch('/api/test-offline'), (error) => error === offline);
});
