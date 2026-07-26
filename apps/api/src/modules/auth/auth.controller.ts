import type { RequestHandler } from 'express';
import { loginWithFirebase, refreshSession, logout } from './auth.service';

export const verifyToken: RequestHandler = async (req, res) => {
  const result = await loginWithFirebase(req.body.firebaseIdToken);
  res.json(result);
};

export const refresh: RequestHandler = async (req, res) => {
  const result = await refreshSession(req.body.refreshToken);
  res.json(result);
};

export const logoutController: RequestHandler = async (req, res) => {
  await logout(req.user!.id);
  res.json({ message: 'Logged out' });
};
