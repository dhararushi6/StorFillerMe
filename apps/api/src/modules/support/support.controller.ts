import type { RequestHandler } from 'express';
import { SupportService } from './support.service';

export const createTicketHandler: RequestHandler = async (req, res) => {
  const ticket = await SupportService.createTicket(req.user!.id, req.body);
  res.status(201).json({ ticket });
};

export const listTicketsHandler: RequestHandler = async (req, res) => {
  const data = await SupportService.listTickets(req.user!.id);
  res.json({ data });
};
