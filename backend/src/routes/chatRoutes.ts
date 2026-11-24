import { Router } from 'express';
import {
  createSession,
  getSessions,
  getSessionById,
  sendMessage,
  deleteSession,
  submitFeedback,
} from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All chat routes require authentication
router.use(protect);

router.post('/sessions', createSession);
router.get('/sessions', getSessions);
router.get('/sessions/:sessionId', getSessionById);
router.post('/sessions/:sessionId/messages', sendMessage);
router.delete('/sessions/:sessionId', deleteSession);
router.post('/messages/:messageId/feedback', submitFeedback);

export default router;
