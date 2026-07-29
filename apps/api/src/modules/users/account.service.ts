import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { conflict, notFound } from '../../lib/http-error';

// MOB store requirement (App Store 5.1.1(v) / Play Data deletion): an app that
// creates accounts must let the user delete theirs from inside the app.
//
// This anonymises in place instead of deleting the row. Order, Payment,
// WalletTransaction and Settlement are financial records the business must
// retain, and every one of them FKs to User — a hard delete would either fail on
// the constraint or cascade away the books. Both stores accept retention of
// transaction records provided the personal data goes and the policy says so.
//
// What goes: phone, email, firebaseUid, shop owner name, shop photo, device
// tokens, cart, live sessions, any pending OTP.
// What stays: order/payment/settlement history with its address snapshot, keyed
// to an id that no longer resolves to a person.

/** Non-terminal statuses — a delete while one of these is open would strand a
 *  physical delivery or an unsettled COD collection. */
const OPEN_STATUSES = ['PENDING_PAYMENT', 'CONFIRMED', 'DISPATCHED', 'OUT_FOR_DELIVERY'] as const;

export const AccountService = {
  /** DELETE /users/me. Idempotent: a retry against an already-deleted account
   *  succeeds silently (the mobile client may not have received the first 200). */
  async deleteAccount(userId: string): Promise<{ deleted: true; alreadyDeleted: boolean }> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw notFound('Account not found');
    if (user.deletedAt) return { deleted: true, alreadyDeleted: true };

    const openOrders = await prisma.order.count({
      where: { buyerId: userId, status: { in: [...OPEN_STATUSES] } },
    });
    if (openOrders > 0) {
      throw conflict(
        `Cannot delete the account while ${openOrders} order(s) are still in progress — ` +
          `cancel them or wait for delivery, then try again`,
      );
    }

    // Wallet balance is not auto-refunded (no outbound payout path exists yet);
    // log it so support can settle manually rather than silently swallowing it.
    const wallet = await prisma.buyerWallet.findUnique({ where: { buyerId: userId } });
    if (wallet && wallet.balance.greaterThan(0)) {
      logger.warn(
        { userId, balance: wallet.balance.toString() },
        'account deleted with a non-zero wallet balance — manual refund required',
      );
    }

    const deletedAt = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { buyerId: userId } });
      await tx.deviceToken.deleteMany({ where: { userId } });
      await tx.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: deletedAt },
      });
      if (user.email) await tx.emailOtp.deleteMany({ where: { email: user.email } });
      await tx.shopProfile.updateMany({
        where: { userId },
        data: { ownerName: 'Deleted user', shopPhotoUrl: null },
      });
      // phone is NOT NULL + @unique, so it is replaced rather than cleared. The
      // sentinel also frees the real number for a fresh signup later.
      await tx.user.update({
        where: { id: userId },
        data: {
          phone: `deleted:${userId}`,
          email: null,
          firebaseUid: null,
          isActive: false,
          pushEnabled: false,
          orderUpdatesOptIn: false,
          promoOptIn: false,
          deletedAt,
        },
      });
    });

    logger.info({ userId }, 'account deleted (PII anonymised, records retained)');
    return { deleted: true, alreadyDeleted: false };
  },
};
