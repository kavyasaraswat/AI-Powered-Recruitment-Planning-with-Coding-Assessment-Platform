import { Router } from 'express';
import {
  scoreCandidateJob,
  getMatchingReport,
  analyzeResume,
} from '../controllers/aiMatchingController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Authentication required for all AI features
router.use(protect);

router.post('/matching/score', scoreCandidateJob);
router.get('/matching/report/:appId', restrictTo('recruiter', 'admin'), getMatchingReport);
router.post('/resume/analyze', restrictTo('candidate', 'admin'), analyzeResume);

export default router;
