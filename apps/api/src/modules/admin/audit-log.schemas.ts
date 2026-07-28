import { z } from 'zod';

// B1-12 — Audit log query schema. Filters are optional; defaults to recent page.

export const auditLogQuerySchema = z.object({
  action: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;
