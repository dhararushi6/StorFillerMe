import { z } from 'zod';

// B2-07 — Agent delivery schemas (arch §3).

export const orderIdParamsSchema = z.object({
  id: z.string().uuid(),
});
export type OrderIdParams = z.infer<typeof orderIdParamsSchema>;

export const locationUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).optional(),
});
export type LocationUpdateInput = z.infer<typeof locationUpdateSchema>;
