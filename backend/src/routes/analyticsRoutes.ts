import { Router } from 'express';
import {
  getRecruiterPipelineAnalytics,
  getSkillDemandAnalytics,
  exportApplicationsReport,
} from '../controllers/analyticsController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Public / General skill demand trend
router.get('/skills/demand', getSkillDemandAnalytics);

// Recruiter-protected analytics
router.get('/pipeline', protect, restrictTo('recruiter', 'admin'), getRecruiterPipelineAnalytics);
router.get('/export', protect, restrictTo('recruiter', 'admin'), exportApplicationsReport);

export default router;
