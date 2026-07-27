import { randomInt } from 'node:crypto';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import type { ReferralCode } from '@prisma/client';

// B2-05 — arch §3:
//   GET /referral/code    Buyer — → { code }   (auto-generate on first request, idempotent)
//   GET /referral/history Buyer — → { data[] } (referred users with status)
//
// Reward crediting is a Week-3 stub: it fires on the referred buyer's first
// completed order. Here we only surface the existing rewardCredited flag. The
// Referral row itself is created during the Week-3 referral-signup flow; until
// then a referrer's history is naturally empty.

// Unambiguous alphabet (no 0/O/1/I) so codes stay human-shareable.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LEN = 8;
const MAX_CODE_ATTEMPTS = 5;

function generateCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LEN; i++) code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return code;
}

export interface ReferralHistoryEntry {
  referred: { id: string; phone: string };
  rewardCredited: boolean;
  createdAt: Date;
}

export const ReferralService = {
  /** GET /referral/code — idempotent: create on first request, return the same
   *  code on every subsequent request. Retries on the (vanishingly rare)
   *  uniqueness collision on ReferralCode.code. */
  async getOrCreateCode(userId: string): Promise<ReferralCode> {
    const existing = await prisma.referralCode.findUnique({ where: { userId } });
    if (existing) return existing;
    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const code = generateCode();
      try {
        return await prisma.referralCode.create({ data: { userId, code } });
      } catch (err) {
        // P2002 = unique violation on code → collide, regenerate. Anything else rethrows.
        if ((err as { code?: string })?.code === 'P2002') {
          logger.warn({ userId, attempt }, 'referral code collision, retrying');
          continue;
        }
        throw err;
      }
    }
    throw new Error('Failed to generate a unique referral code');
  },

  /** GET /referral/history — users this buyer referred, with reward status. */
  async listHistory(userId: string): Promise<ReferralHistoryEntry[]> {
    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId },
      include: { referred: { select: { id: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return referrals.map((r) => ({
      referred: { id: r.referred.id, phone: r.referred.phone },
      rewardCredited: r.rewardCredited,
      createdAt: r.createdAt,
    }));
  },
};
