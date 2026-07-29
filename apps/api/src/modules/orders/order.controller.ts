import type { RequestHandler } from 'express';
import { OrderService } from './order.service';
import { AgentService } from '../agent/agent.service';
import type {
  CreateOrderInput,
  ListOrdersQuery,
  OrderIdParams,
  CancelOrderInput,
} from './order.schemas';

// B3-06/07 — order handlers. Buyer identity from req.user (requireAuth).

export const createOrderHandler: RequestHandler = async (req, res) => {
  // Idempotency-Key is optional; capped so a hostile client can't write huge
  // keys, and blank-trimmed so a header of spaces is treated as absent.
  const key = req.header('Idempotency-Key')?.trim().slice(0, 128) || undefined;
  const result = await OrderService.createOrder(req.user!.id, req.body as CreateOrderInput, key);
  res.status(201).json(result);
};

export const listOrdersHandler: RequestHandler = async (req, res) => {
  const result = await OrderService.listOrders(
    req.user!.id,
    req.query as unknown as ListOrdersQuery,
  );
  res.json(result);
};

export const getOrderHandler: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as OrderIdParams;
  const result = await OrderService.getOrder(req.user!.id, id);
  res.json(result);
};

export const cancelOrderHandler: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as OrderIdParams;
  const result = await OrderService.cancelOrder(req.user!.id, id, req.body as CancelOrderInput);
  res.json(result);
};

export const getTrackingHandler: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as OrderIdParams;
  const result = await AgentService.getTracking(req.user!.id, id);
  res.json(result);
};
