import { Router } from 'express';
import {
  changePassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  sendPasswordToEmail,
} from '../controller/auth-controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/change-password', changePassword);
router.post('/send-password-to-email', sendPasswordToEmail);
router.post('/refresh', refreshAccessToken);

export default router;
