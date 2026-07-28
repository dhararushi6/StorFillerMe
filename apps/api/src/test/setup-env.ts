import { generateKeyPairSync } from 'node:crypto';

// Runs in EVERY jest worker BEFORE any test module (and therefore before
// lib/env.ts and lib/prisma.ts are first imported). Sets the env those modules
// read at import time so the whole app binds to the isolated test database.

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  'postgresql://storefiller:storefiller@localhost:5433/storefiller_test?schema=public';
// Deterministic TTLs so duration parsing is exercised without long waits.
process.env.JWT_ACCESS_TTL = '15m';
process.env.JWT_REFRESH_TTL = '30d';

// Ephemeral RS256 keypair so signAccessToken/verifyAccessToken run the real
// RS256 path without needing committed dev keys. Generated fresh per worker.
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});
// lib/env.ts pem() converts literal "\n" sequences into real newlines, so
// provide the keys with escaped newlines exactly as production env would.
process.env.JWT_PRIVATE_KEY = privateKey.replace(/\n/g, '\\n');
process.env.JWT_PUBLIC_KEY = publicKey.replace(/\n/g, '\\n');
