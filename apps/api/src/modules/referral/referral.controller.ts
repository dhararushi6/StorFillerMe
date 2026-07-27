import type { RequestHandler } from 'express';
import { ReferralService } from './referral.service';

export const getReferralCodeHandler: RequestHandler = async (req, res) => {
  const { code } = await ReferralService.getOrCreateCode(req.user!.id);
  res.json({ code });
};

export const getReferralHistoryHandler: RequestHandler = async (req, res) => {
  const data = await ReferralService.listHistory(req.user!.id);
  res.json({ data });
};
