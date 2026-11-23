import { Request, Response } from 'express';
import crypto from 'crypto';
import { User, IUserDocument } from '../models/User';
import { Session } from '../models/Session';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendEmail } from '../utils/email';
import { config } from '../config/env';

// Helper to set HTTP-only refresh token cookie
const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('hiregenius_refresh_token', token, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, companyName } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Name, email, and password are required.',
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Password must be at least 8 characters long.',
      });
      return;
    }

    const assignedRole = role === 'recruiter' || role === 'admin' ? role : 'candidate';

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({
        success: false,
        error: 'ConflictError',
        message: 'An account with this email address already exists.',
      });
      return;
    }

    // Create user (passwordHash is hashed via pre-save hook)
    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      role: assignedRole,
      companyName: assignedRole === 'recruiter' ? companyName : undefined,
      currentSubscription: {
        planCode: assignedRole === 'recruiter' ? 'RECRUITER_FREE' : 'CANDIDATE_FREE',
        status: 'active',
      },
    });

    await user.save();

    // Sign tokens
    const tokenPayload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    // Save refresh session
    await Session.create({
      userId: user._id,
      refreshToken,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        currentSubscription: user.currentSubscription,
      },
      token: accessToken,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to complete registration.',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Please provide email and password.',
      });
      return;
    }

    // Find user and explicitly select passwordHash
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'InvalidCredentials',
        message: 'Invalid email address or password.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: 'AccountSuspended',
        message: 'This account has been suspended by an administrator.',
      });
      return;
    }

    // Compare bcrypt password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'InvalidCredentials',
        message: 'Invalid email address or password.',
      });
      return;
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const tokenPayload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    // Save refresh session
    await Session.create({
      userId: user._id,
      refreshToken,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        currentSubscription: user.currentSubscription,
      },
      token: accessToken,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Login failed.',
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.hiregenius_refresh_token || req.body?.refreshToken;

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Refresh token missing.',
      });
      return;
    }

    // Verify token cryptographic signature
    let decoded: any;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      res.status(401).json({
        success: false,
        error: 'InvalidToken',
        message: 'Refresh token invalid or expired.',
      });
      return;
    }

    // Find session in database
    const session = await Session.findOne({ refreshToken: token, isValid: true });
    if (!session) {
      res.status(401).json({
        success: false,
        error: 'SessionRevoked',
        message: 'Session has been invalidated or expired.',
      });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'User no longer active.',
      });
      return;
    }

    // Token Rotation: issue new access token & new refresh token
    const tokenPayload = { userId: user._id.toString(), email: user.email, role: user.role };
    const newAccessToken = signAccessToken(tokenPayload);
    const newRefreshToken = signRefreshToken(tokenPayload);

    // Invalidate old session and save new one
    session.isValid = false;
    await session.save();

    await Session.create({
      userId: user._id,
      refreshToken: newRefreshToken,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to refresh token.',
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.hiregenius_refresh_token;
    if (token) {
      await Session.updateOne({ refreshToken: token }, { isValid: false });
    }

    res.clearCookie('hiregenius_refresh_token');
    res.clearCookie('hiregenius_access_token');

    res.status(200).json({
      success: true,
      message: 'Signed out successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Logout failed.',
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified,
        currentSubscription: user.currentSubscription,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch user.',
    });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Please provide email.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't leak whether email exists
      res.status(200).json({
        success: true,
        message: 'If that email exists in our system, a password reset link has been dispatched.',
      });
      return;
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
    const emailText = `You requested a password reset for HireGenius AI.\nPlease reset your password using the following link: ${resetUrl}\nThis link expires in 60 minutes.`;

    await sendEmail({
      to: user.email,
      subject: 'HireGenius AI — Password Reset Request',
      text: emailText,
    });

    res.status(200).json({
      success: true,
      message: 'If that email exists in our system, a password reset link has been dispatched.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to process forgot password request.',
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ success: false, message: 'Token and new password are required.' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        error: 'InvalidToken',
        message: 'Password reset token is invalid or has expired.',
      });
      return;
    }

    // Set new password (will be hashed by pre-save hook)
    user.passwordHash = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You may now log in with your new credentials.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to reset password.',
    });
  }
};
