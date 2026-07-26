import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  tokenVerifySchema,
  refreshSchema,
  emailOtpSendSchema,
  emailOtpVerifySchema,
} from './auth.schemas';
import { verifyToken, refresh, logoutController } from './auth.controller';
import { sendOtp, verifyOtp } from './email-otp.controller';

export const authRouter: Router = Router();

authRouter.post('/token/verify', validate({ body: tokenVerifySchema }), verifyToken);
authRouter.post('/refresh', validate({ body: refreshSchema }), refresh);
authRouter.post('/logout', requireAuth, logoutController);

// Email-OTP fallback (B1-06). Rate-limited 5/hour, keyed by target email (falls back to IP).
const otpSendLimiter = rateLimit({
  windowMs: 60 * 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    (typeof req.body?.email === 'string' ? req.body.email : req.ip) ?? 'unknown',
  message: { error: { message: 'Too many OTP requests — try again later' } },
});

authRouter.post('/email-otp/send', validate({ body: emailOtpSendSchema }), otpSendLimiter, sendOtp);
authRouter.post('/email-otp/verify', validate({ body: emailOtpVerifySchema }), verifyOtp);
