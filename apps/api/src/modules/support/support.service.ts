import { prisma } from '../../lib/prisma';
import type { SupportTicket } from '@prisma/client';
import type { CreateTicketInput } from './support.schemas';

export const SupportService = {
  /** POST /support/tickets — create a ticket for the buyer (status defaults OPEN). */
  async createTicket(buyerId: string, input: CreateTicketInput): Promise<SupportTicket> {
    return prisma.supportTicket.create({
      data: { buyerId, subject: input.subject, message: input.message },
    });
  },

  /** GET /support/tickets — the buyer's own tickets, newest first. */
  async listTickets(buyerId: string): Promise<SupportTicket[]> {
    return prisma.supportTicket.findMany({
      where: { buyerId },
      orderBy: { createdAt: 'desc' },
    });
  },
};
