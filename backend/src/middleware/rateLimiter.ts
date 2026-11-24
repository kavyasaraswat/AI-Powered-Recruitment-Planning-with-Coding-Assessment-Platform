import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter: 200 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

/**
 * Sensitive Authentication Limiter: 15 attempts per 15 minutes (brute-force defense)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many login attempts. Account access temporarily throttled to protect credentials.',
  },
});

/**
 * AI Query & Code Execution Limiter: 40 requests per minute
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'AI compute rate limit reached. Please wait a moment before sending more queries.',
  },
});
