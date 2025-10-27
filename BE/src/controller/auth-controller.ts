import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { IUser, User } from '../models/User';
import jwt from 'jsonwebtoken';
import { addToken, removeToken } from '../utils/tokenStore';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const registerUser = async (req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const { password, email, role } = req.body;
    const username = req.body.username.trim();

    if (!username || !password || !email || !role) {
      res.status(400).json({
        success: false,
        message: 'All fields are required!',
      });
      return;
    }

    if (role !== 'user' && role !== 'admin') {
      res.status(400).json({
        success: false,
        message: 'Invalid role! Must be user or admin.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const checkExistingUser = await User.findOne({ username });
    if (checkExistingUser) {
      res.status(400).json({
        success: false,
        message: 'Username already exists!',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({
        success: false,
        message: 'Email already exists!',
      });
      return;
    }

    const newlyCreatedUser = new User({
      username,
      password: hashedPassword,
      email,
      role,
      profilePhoto: '',
    });

    await newlyCreatedUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
    });
  } catch (e) {
    console.error('Error in registerUser:', e);
    res.status(500).json({
      success: false,
      message:
        e instanceof Error
          ? e.message
          : 'Some error occurred! Please try again',
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required!',
      });
      return;
    }
    const usernameTrimmed = username.trim();
    const user = await User.findOne({ username: usernameTrimmed });
    const isPasswordMatch =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !isPasswordMatch) {
      res.status(400).json({
        success: false,
        message: 'Invalid username or password!',
      });
      return;
    }

    const secret = process.env.JWT_SECRET_KEY;
    const refreshSecret = process.env.JWT_REFRESH_SECRET_KEY;
    if (!secret || !refreshSecret) {
      throw new Error('JWT secret keys are not defined');
    }

    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        role: user.role,
      },
      secret,
      { expiresIn: '30m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id.toString() },
      refreshSecret,
      { expiresIn: '31min' }
    );

    addToken(accessToken);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logged in successful',
      data: {
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Some error occurred! Please try again later.',
    });
  }
};

const sendPasswordToEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required!',
      });
      return;
    }

    // 找用户
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'No user found with this email!',
      });
      return;
    }

    const newPassword = crypto.randomBytes(6).toString('hex');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'chongchen.wong@atoz-software.tech',
      subject: 'Your New Password',
      html: `
        <p>Hello ${user.username},</p>
        <p>Your new password is:</p>
        <h2>${newPassword}</h2>
        <p>Please login and change your password immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'New password has been sent to your email!',
    });
  } catch (error) {
    console.error('Error in sendNewPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send new password. Please try again later.',
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Username and new password are required!',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found!',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully!',
    });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password.',
    });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided!',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    removeToken(token);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully!',
    });
  } catch (error) {
    console.error('Error in logoutUser:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log out. Please try again later.',
    });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required!',
      });
      return;
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET_KEY;
    const accessSecret = process.env.JWT_SECRET_KEY;

    if (!refreshSecret || !accessSecret) {
      throw new Error('JWT secret keys are not defined');
    }

    const decoded = jwt.verify(refreshToken, refreshSecret) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({
        success: false,
        message: 'Invalid refresh token!',
      });
      return;
    }

    const newAccessToken = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        role: user.role,
      },
      accessSecret,
      { expiresIn: '30m' }
    );

    addToken(newAccessToken);

    res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully!',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error('Error in refreshToken:', error);
    res.status(403).json({
      success: false,
      message: 'Invalid or expired refresh token.',
    });
  }
};

export {
  registerUser,
  loginUser,
  sendPasswordToEmail,
  changePassword,
  logoutUser,
  refreshAccessToken,
};
