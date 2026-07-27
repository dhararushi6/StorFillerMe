import { z } from 'zod';

// B2-05 — arch §3:
//   POST /support/tickets  Buyer { subject, message } → { ticket }   (201)
//   GET  /support/tickets  Buyer —                   → { data[] }
// TicketStatus (OPEN/IN_PROGRESS/RESOLVED) lives in packages/types + the
// SupportTicket model; new tickets default to OPEN at the DB layer.

export const createTicketSchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(4000),
});
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
