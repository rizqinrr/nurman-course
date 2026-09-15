import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    isolate: true,
    fileParallelism: false,
    passWithNoTests: false,
    allowOnly: false,
    testTimeout: 5000,
    hookTimeout: 5000,
  },
});
