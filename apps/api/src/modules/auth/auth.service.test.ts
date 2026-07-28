import crypto from 'node:crypto';
import { prisma } from '../../lib/prisma';
import {
  issueSession,
  refreshSession,
  logout,
  loginWithFirebase,
  toPublicUser,
} from './auth.service';
import { hashRefreshToken } from '../../lib/jwt';
import { createUser } from '../../test/helpers';

// Auth session lifecycle. The refresh-token family-reuse detection is the core
// anti-theft control — exercised directly against the real DB.

describe('issueSession', () => {
  it('returns access + refresh tokens and persists only the refresh HASH', async () => {
    const user = await createUser({ role: 'BUYER' });
    const session = await issueSession(user);

    expect(session.accessToken).toBeTruthy();
    expect(session.refreshToken).toBeTruthy();
    expect(session.user.id).toBe(user.id);
    expect(session.user.phone).toBe(user.phone);

    const stored = await prisma.refreshToken.findUnique({
      where: { hashedToken: hashRefreshToken(session.refreshToken) },
    });
    expect(stored).not.toBeNull();
    expect(stored?.userId).toBe(user.id);
    // raw token is never stored — only its sha256
    expect(stored?.hashedToken).not.toBe(session.refreshToken);
  });

  it('strips sensitive/internal fields from the public user shape', async () => {
    const user = await createUser();
    const pub = toPublicUser(user);
    expect(pub).not.toHaveProperty('firebaseUid');
    expect(pub).not.toHaveProperty('createdAt');
    expect(Object.keys(pub).sort()).toEqual(
      [
        'email',
        'id',
        'isActive',
        'orderUpdatesOptIn',
        'phone',
        'promoOptIn',
        'pushEnabled',
        'role',
      ].sort(),
    );
  });
});

describe('refreshSession — rotation + family reuse detection', () => {
  it('rotates: a valid refresh token yields a NEW pair in the same family', async () => {
    const user = await createUser();
    const first = await issueSession(user);
    const second = await refreshSession(first.refreshToken);

    expect(second.refreshToken).not.toBe(first.refreshToken);
    // access tokens may be byte-identical when issued within the same second
    // (RS256 is deterministic and JWT iat has 1s resolution) — the rotation
    // guarantee that matters is the distinct refresh token below.

    const oldRec = await prisma.refreshToken.findUnique({
      where: { hashedToken: hashRefreshToken(first.refreshToken) },
    });
    const newRec = await prisma.refreshToken.findUnique({
      where: { hashedToken: hashRefreshToken(second.refreshToken) },
    });
    expect(oldRec?.usedAt).not.toBeNull(); // old marked used
    expect(newRec?.familyId).toBe(oldRec?.familyId); // same family
  });

  it('rejects an unknown refresh token', async () => {
    await expect(
      refreshSession(crypto.randomBytes(32).toString('base64url')),
    ).rejects.toMatchObject({ status: 401 });
  });

  it('REVOKES the whole family when a rotated token is replayed outside the grace window', async () => {
    const user = await createUser();
    const first = await issueSession(user);
    // legitimately rotate once (marks `first` used)
    await refreshSession(first.refreshToken);

    // back-date usedAt beyond the 10s grace window to simulate a later replay
    await prisma.refreshToken.updateMany({
      where: { hashedToken: hashRefreshToken(first.refreshToken) },
      data: { usedAt: new Date(Date.now() - 60_000) },
    });

    // replay the old (stolen) token → family revoked + 401
    await expect(refreshSession(first.refreshToken)).rejects.toMatchObject({ status: 401 });

    const family = await prisma.refreshToken.findMany({ where: { userId: user.id } });
    expect(family.every((t) => t.revokedAt !== null)).toBe(true);
  });

  it('tolerates an immediate (in-grace) retry of a just-rotated token', async () => {
    const user = await createUser();
    const first = await issueSession(user);
    await refreshSession(first.refreshToken); // rotates, usedAt = now (within grace)
    // immediate retry should NOT revoke the family
    await expect(refreshSession(first.refreshToken)).resolves.toBeTruthy();
    const family = await prisma.refreshToken.findMany({ where: { userId: user.id } });
    expect(family.every((t) => t.revokedAt === null)).toBe(true);
  });

  it('rejects an expired refresh token', async () => {
    const user = await createUser();
    const session = await issueSession(user);
    await prisma.refreshToken.updateMany({
      where: { hashedToken: hashRefreshToken(session.refreshToken) },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    await expect(refreshSession(session.refreshToken)).rejects.toMatchObject({ status: 401 });
  });

  it('rejects when the owning account is disabled', async () => {
    const user = await createUser();
    const session = await issueSession(user);
    await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
    await expect(refreshSession(session.refreshToken)).rejects.toMatchObject({ status: 401 });
  });
});

describe('logout', () => {
  it('revokes every active refresh token for the user', async () => {
    const user = await createUser();
    const s1 = await issueSession(user);
    const s2 = await issueSession(user);
    await logout(user.id);

    await expect(refreshSession(s1.refreshToken)).rejects.toMatchObject({ status: 401 });
    await expect(refreshSession(s2.refreshToken)).rejects.toMatchObject({ status: 401 });
  });
});

describe('loginWithFirebase (stub mode)', () => {
  it('upserts a buyer from a stub token and issues a session', async () => {
    const session = await loginWithFirebase('stub:uid-1:+919999000111:buyer@test.dev');
    expect(session.user.phone).toBe('+919999000111');
    expect(session.user.role).toBe('BUYER');
    expect(session.accessToken).toBeTruthy();
  });

  it('rejects a stub token with no phone (phone is required)', async () => {
    await expect(loginWithFirebase('stub:uid-2:')).rejects.toMatchObject({ status: 401 });
  });

  it('rejects a malformed stub token', async () => {
    await expect(loginWithFirebase('garbage')).rejects.toMatchObject({ status: 401 });
  });

  it('rejects login for a disabled account', async () => {
    const user = await createUser({ phone: '+919999000222' });
    await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
    await expect(loginWithFirebase('stub:uid-x:+919999000222')).rejects.toMatchObject({
      status: 401,
    });
  });
});
