const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const backend = __dirname;
const dist = path.join(backend, 'dist');
const sharedSource = path.resolve(backend, '../packages/shared/src');

function run(label, executable, args) {
  const result = spawnSync(process.execPath, [require.resolve(executable), ...args], {
    cwd: backend,
    env: { ...process.env, PRISMA_GENERATE_SKIP_AUTOINSTALL: '1', PRISMA_HIDE_UPDATE_MESSAGE: '1', CHECKPOINT_DISABLE: '1' },
    encoding: 'utf8',
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${label} failed (${result.error?.code || result.signal || result.status}).`);
  }
}

function checkDestination(source, destination) {
  let target;
  try {
    target = fs.lstatSync(destination);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  const sourceIsDirectory = fs.statSync(source).isDirectory();
  if (target.isSymbolicLink() || target.isDirectory() !== sourceIsDirectory) {
    throw new Error('Build output must not contain conflicting files or symbolic links.');
  }
  if (sourceIsDirectory) {
    for (const entry of fs.readdirSync(source)) {
      checkDestination(path.join(source, entry), path.join(destination, entry));
    }
  }
}

function build() {
  if (process.argv.length !== 2) throw new Error('Usage: node build.cjs (output is backend/dist).');
  fs.mkdirSync(dist, { recursive: true });
  if (fs.lstatSync(dist).isSymbolicLink()) throw new Error('Build output must not be a symbolic link.');
  const staging = fs.mkdtempSync(path.join(dist, '.build-'));
  try {
    run('Prisma generation', 'prisma/build/index.js', [
      'generate', '--schema', path.join(backend, 'prisma/schema.prisma'), '--generator', 'client',
    ]);
    run('Backend compilation', 'typescript/bin/tsc', [
      '--project', path.join(backend, 'tsconfig.json'), '--outDir', staging, '--noEmitOnError',
    ]);
    const sharedOutput = path.join(staging, 'node_modules/@nurman-course/shared');
    run('Shared compilation', 'typescript/bin/tsc', [
      path.join(sharedSource, 'index.ts'), '--rootDir', sharedSource, '--outDir', sharedOutput,
      '--module', 'CommonJS', '--target', 'ES2022', '--moduleResolution', 'node',
      '--strict', '--esModuleInterop', '--skipLibCheck', '--noEmitOnError',
    ]);
    fs.writeFileSync(path.join(sharedOutput, 'package.json'), JSON.stringify({
      name: '@nurman-course/shared', private: true, type: 'commonjs', main: 'index.js',
    }, null, 2) + '\n');
    fs.cpSync(path.join(backend, 'src/generated/client'), path.join(staging, 'src/generated/client'), { recursive: true });
    checkDestination(staging, dist);
    for (const subtree of ['src/generated/client', 'node_modules/@nurman-course/shared']) {
      fs.rmSync(path.join(dist, subtree), { recursive: true, force: true });
    }
    fs.cpSync(staging, dist, { recursive: true });
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
}

try {
  build();
  process.stdout.write('Backend artifact built in backend/dist. Build on the deployment OS for its Prisma engine.\n');
} catch (error) {
  process.stderr.write(`Backend build failed: ${error.message}\n`);
  process.exitCode = 1;
}
