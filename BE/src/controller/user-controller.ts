import { Request, Response } from 'express';
import { User } from '../models/User';
import { IReqChangePasswordBody } from '../types/user/user-types';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
export interface IAuthRequest extends Request<{}, {}, IReqChangePasswordBody> {
  user?: { userId: string }; // 从 authMiddleware 注入
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profile_photos')); // 照片储存目录
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制最大 5MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (e) {
    console.error('Error in getUsers:', e);
    res.status(500).json({
      success: false,
      message:
        e instanceof Error
          ? e.message
          : 'Some error occurred! Please try again',
    });
  }
};

const getCurrentUser = async (req: IAuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (e) {
    console.error('Error in getCurrentUser:', e);
    res.status(500).json({
      success: false,
      message:
        e instanceof Error
          ? e.message
          : 'Some error occurred! Please try again',
    });
  }
};

const postChangePassword = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res
        .status(400)
        .json({ success: false, message: 'Old password is incorrect' });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: 'Password changed successfully' });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some error occured! Please try again',
    });
    return;
  }
};

const uploadProfilePhoto = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const userId = req.user.userId;
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const photoPath = `/uploads/profile_photos/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: photoPath },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading photo',
    });
  }
};

export { getAllUsers, postChangePassword, getCurrentUser, uploadProfilePhoto };
