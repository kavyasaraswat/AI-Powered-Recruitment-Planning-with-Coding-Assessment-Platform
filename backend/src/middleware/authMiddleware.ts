import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { User, IUserDocument } from '../models/User';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'candidate' | 'recruiter' | 'admin';
        name?: string;
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.hiregenius_access_token) {
      // 2. Check HTTP-only cookie
      token = req.cookies.hiregenius_access_token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication token missing. Please sign in to access this resource.',
      });
      return;
    }

    // 3. Verify Access Token
    let decoded: TokenPayload;
    try {
      decoded = verifyAccessToken(token);
    } catch (err: any) {
      res.status(401).json({
        success: false,
        error: 'InvalidToken',
        message: 'Session expired or token invalid. Please re-authenticate.',
      });
      return;
    }

    // 4. Attach authenticated user details
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Internal authentication verification error',
    });
  }
};

export const restrictTo = (...roles: ('candidate' | 'recruiter' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Access denied. Role '${req.user?.role || 'anonymous'}' is not authorized to access this endpoint. Required: [${roles.join(', ')}]`,
      });
      return;
    }
    next();
  };
};
