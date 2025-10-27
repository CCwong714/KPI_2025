import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { isTokenValid } from '../utils/tokenStore';

interface DecodedToken extends JwtPayload {
  userId: string;
  username?: string;
  role?: string;
}

interface ICustomRequest extends Request {
  user?: {
    userId: string;
    username?: string;
    role?: string;
  };
}

const authMiddleware = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as DecodedToken;

    if (!isTokenValid(token)) {
      res.status(401).json({ message: 'Token is expired or invalid' });
      return;
    }

    // ✅ 显式挂载指定字段，类型明确
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};

export { authMiddleware };
