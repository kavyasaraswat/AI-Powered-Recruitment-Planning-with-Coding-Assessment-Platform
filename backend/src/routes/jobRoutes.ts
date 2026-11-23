import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
} from '../controllers/jobController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Public Job Search and Details
router.get('/', getJobs);
router.get('/:id', getJobById);

// Candidate application submission
router.post('/:id/apply', protect, restrictTo('candidate'), applyToJob);

// Recruiter Job Requisition Lifecycle Controls
router.post('/', protect, restrictTo('recruiter', 'admin'), createJob);
router.put('/:id', protect, restrictTo('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, restrictTo('recruiter', 'admin'), deleteJob);

export default router;
