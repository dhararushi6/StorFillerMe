import type { RequestHandler } from 'express';
import { createProfile, updateProfile, confirmPhoto, getUploadSignature } from './shop.service';

export const postProfile: RequestHandler = async (req, res) => {
  const shopProfile = await createProfile(req.user!.id, req.body);
  res.status(201).json({ shopProfile });
};

export const patchProfile: RequestHandler = async (req, res) => {
  const shopProfile = await updateProfile(req.user!.id, req.body);
  res.json({ shopProfile });
};

export const photoUploadSignature: RequestHandler = async (_req, res) => {
  res.json(getUploadSignature());
};

export const patchPhotoConfirm: RequestHandler = async (req, res) => {
  const shopProfile = await confirmPhoto(req.user!.id, req.body.cloudinaryUrl);
  res.json({ shopProfile });
};
