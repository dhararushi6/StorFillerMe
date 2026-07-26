import { z } from 'zod';

export const createProfileSchema = z.object({
  shopName: z.string().min(1),
  ownerName: z.string().min(1),
  addressLine: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/, 'pincode must be 6 digits'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const updateProfileSchema = createProfileSchema.partial();

export const confirmPhotoSchema = z.object({
  cloudinaryUrl: z.string().url(),
  publicId: z.string().min(1),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
