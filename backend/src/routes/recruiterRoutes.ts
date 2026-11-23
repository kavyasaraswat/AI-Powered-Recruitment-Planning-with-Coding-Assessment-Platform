import { Router } from 'express';
import {
  getCompany,
  updateCompany,
  getRecruiterJobs,
  getApplicants,
  updateApplicationStage,
  scheduleInterview,
  getRecruiterAnalytics,
} from '../controllers/recruiterController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Recruiter routes require authentication & Recruiter role
router.use(protect);
router.use(restrictTo('recruiter', 'admin'));

router.get('/company', getCompany);
router.put('/company', updateCompany);
router.get('/jobs', getRecruiterJobs);
router.get('/applicants/:jobId', getApplicants);
router.patch('/applications/:appId/status', updateApplicationStage);
router.post('/interviews/schedule', scheduleInterview);
router.get('/analytics', getRecruiterAnalytics);

export default router;
