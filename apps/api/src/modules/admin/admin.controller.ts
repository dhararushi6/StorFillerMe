import type { RequestHandler } from 'express';
import { AdminService } from './admin.service';
import type { AdminOrdersQuery, OrderIdParams, AssignAgentInput } from './admin.schemas';
import type { AuditLogQuery } from './audit-log.schemas';

// B1-11 — Admin order handlers.

export const listAdminOrdersHandler: RequestHandler = async (req, res) => {
  const result = await AdminService.listOrders(req.query as unknown as AdminOrdersQuery);
  res.json(result);
};

export const confirmOrderHandler: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as OrderIdParams;
  const result = await AdminService.confirmOrder(id);
  res.json(result);
};

export const assignAgentHandler: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as OrderIdParams;
  const result = await AdminService.assignAgent(id, req.body as AssignAgentInput);
  res.json(result);
};

export const listAuditLogsHandler: RequestHandler = async (req, res) => {
  const result = await AdminService.listAuditLogs(req.query as unknown as AuditLogQuery);
  res.json(result);
};

export const getDashboardHandler: RequestHandler = async (_req, res) => {
  const result = await AdminService.getDashboard();
  res.json(result);
};
