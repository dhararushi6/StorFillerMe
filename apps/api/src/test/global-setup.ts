import { execSync } from 'node:child_process';
import path from 'node:path';

// Runs ONCE in its own process before any worker spawns. Points Prisma at the
// isolated test database and pushes the schema (idempotent — `db push` syncs
// without dropping data, so repeat runs are cheap no-ops after the first).
//
// --accept-data-loss: this DB is scratch (truncated before every test anyway),
// and adding a unique index to an existing column makes db push refuse without
// it. Safe here, never used against dev or prod.
export default async function globalSetup(): Promise<void> {
  const apiRoot = path.resolve(__dirname, '..', '..');
  const testUrl =
    'postgresql://storefiller:storefiller@localhost:5433/storefiller_test?schema=public';
  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    cwd: apiRoot,
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: testUrl },
  });
}
