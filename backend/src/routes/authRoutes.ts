import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public Authentication Endpoints (rate-limited)
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Protected Identity Endpoint
router.get('/me', protect, getMe);

// Role-Based Authorization Guard Verification Endpoints
router.get('/test/candidate-only', protect, restrictTo('candidate'), (req, res) => {
  res.json({ success: true, message: 'Welcome Candidate! Authorization check passed.', user: req.user });
});

router.get('/test/recruiter-only', protect, restrictTo('recruiter'), (req, res) => {
  res.json({ success: true, message: 'Welcome Recruiter! Authorization check passed.', user: req.user });
});

router.get('/test/admin-only', protect, restrictTo('admin'), (req, res) => {
  res.json({ success: true, message: 'Welcome Administrator! High-privilege access granted.', user: req.user });
});

export default router;
