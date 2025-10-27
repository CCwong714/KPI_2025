import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getAllUsers,
  getCurrentUser,
  postChangePassword,
  upload,
  uploadProfilePhoto,
} from '../controller/user-controller';

const router = Router();
router.get('/getAllUser', authMiddleware, getAllUsers);
router.get('/changePassword', authMiddleware, postChangePassword);
router.get('/getCurrentUser', authMiddleware, getCurrentUser);
router.post(
  '/upload-photo',
  authMiddleware,
  upload.single('profilePhoto'),
  uploadProfilePhoto
);

export default router;
