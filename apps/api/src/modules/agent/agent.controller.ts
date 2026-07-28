import type { RequestHandler } from 'express';
import { AgentService } from './agent.service';
import type { OrderIdParams, LocationUpdateInput } from './agent.schemas';

// B2-07 — Agent delivery handlers. Agent identity from req.user (requireAuth).

export const listAgentOrdersHandler: RequestHandler = async (req, res) => {
  const result = await AgentService.listAgentOrders(req.user!.id);
  res.json(result);
};

export const updateLocationHandler: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as OrderIdParams;
  const result = await AgentService.updateLocation(
    req.user!.id,
    id,
    req.body as LocationUpdateInput,
  );
  res.json(result);
};
