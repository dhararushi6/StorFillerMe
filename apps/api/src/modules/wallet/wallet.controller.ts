import type { RequestHandler } from 'express';
import { WalletService } from './wallet.service';
import type { TopupInput } from './wallet.schemas';

// B3-04 — wallet handlers. Buyer identity from req.user (requireAuth).

export const getWalletHandler: RequestHandler = async (req, res) => {
  const wallet = await WalletService.getWallet(req.user!.id);
  res.json(wallet);
};

export const listWalletTransactionsHandler: RequestHandler = async (req, res) => {
  const result = await WalletService.listTransactions(req.user!.id);
  res.json(result);
};

export const createTopupOrderHandler: RequestHandler = async (req, res) => {
  const order = await WalletService.createTopupOrder(req.user!.id, req.body as TopupInput);
  res.status(201).json(order);
};
