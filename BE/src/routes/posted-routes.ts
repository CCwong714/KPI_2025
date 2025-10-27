import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  deletePost,
  getAllPosted,
  getPostById,
  postAddPosted,
  toggleLikePost,
  updatePost,
} from '../controller/poasted-controller';

const router = Router();
router.post('/add', authMiddleware, postAddPosted);
router.get('/get/:id', authMiddleware, getPostById);
router.get('/getAll', authMiddleware, getAllPosted);
router.put('/update/:id', authMiddleware, updatePost);
router.delete('/delete/:id', authMiddleware, deletePost);
router.post('/:id/like', authMiddleware, toggleLikePost);

export default router;
