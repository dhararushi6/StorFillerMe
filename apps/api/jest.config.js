/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  // Per-worker env (NODE_ENV=test + DATABASE_URL) set BEFORE any module import,
  // so lib/env.ts and lib/prisma.ts bind to the test database on first load.
  setupFiles: ['<rootDir>/src/test/setup-env.ts'],
  // Per-worker truncation + disconnect, run after imports resolve.
  setupFilesAfterEnv: ['<rootDir>/src/test/setup-db.ts'],
  // One-time: point Prisma at the test DB and `db push` the schema (runs in its
  // own process, before any worker spawns).
  globalSetup: '<rootDir>/src/test/global-setup.ts',
  // Run serially (single shared test DB); --runInBand is also in the npm script.
  maxWorkers: 1,
  testTimeout: 30_000,
  clearMocks: true,
};
