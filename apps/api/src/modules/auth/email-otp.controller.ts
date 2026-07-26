import type { RequestHandler } from 'express';
import { sendEmailOtp, verifyEmailOtp } from './email-otp.service';

export const sendOtp: RequestHandler = async (req, res) => {
  await sendEmailOtp(req.body.email);
  // Always 200 — never reveal whether an account exists for this email.
  res.json({ message: 'If an account exists, a verification code has been sent.' });
};

export const verifyOtp: RequestHandler = async (req, res) => {
  const result = await verifyEmailOtp(req.body.email, req.body.otp);
  res.json(result);
};
