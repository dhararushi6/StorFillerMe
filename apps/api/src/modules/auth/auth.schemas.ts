import { z } from 'zod';

export const tokenVerifySchema = z.object({
  firebaseIdToken: z.string().min(1),
});

export const emailOtpSendSchema = z.object({
  email: z.string().email(),
});

export const emailOtpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
