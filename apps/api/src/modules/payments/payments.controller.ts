import type { RequestHandler } from 'express';
import { PaymentsService } from './payments.service';
import type { CreateRazorpayOrderInput } from './payments.schemas';

// B3-05/BE-3 — payments handlers. Buyer identity from req.user (requireAuth).

export const createRazorpayOrderHandler: RequestHandler = async (req, res) => {
  const result = await PaymentsService.createRazorpayOrder(
    req.user!.id,
    req.body as CreateRazorpayOrderInput,
  );
  res.status(201).json(result);
};
