import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { tokenVerifySchema, refreshSchema } from './auth.schemas';
import { verifyToken, refresh, logoutController } from './auth.controller';

export const authRouter: Router = Router();

authRouter.post('/token/verify', validate({ body: tokenVerifySchema }), verifyToken);
authRouter.post('/refresh', validate({ body: refreshSchema }), refresh);
authRouter.post('/logout', requireAuth, logoutController);

// Email-OTP fallback routes (/email-otp/send, /email-otp/verify) are added in B1-06.
