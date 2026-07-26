import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { createProfileSchema, updateProfileSchema, confirmPhotoSchema } from './shop.schemas';
import {
  postProfile,
  patchProfile,
  photoUploadSignature,
  patchPhotoConfirm,
} from './shop.controller';

export const shopRouter: Router = Router();

shopRouter.use(requireAuth, requireRole('BUYER'));

shopRouter.post('/profile', validate({ body: createProfileSchema }), postProfile);
shopRouter.patch('/profile', validate({ body: updateProfileSchema }), patchProfile);
shopRouter.post('/photo/upload-signature', photoUploadSignature);
shopRouter.patch('/photo/confirm', validate({ body: confirmPhotoSchema }), patchPhotoConfirm);
