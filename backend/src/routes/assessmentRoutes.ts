import { Router } from 'express';
import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  runCode,
  submitQuestion,
  getAssessmentSubmissions,
  getSubmissionById,
} from '../controllers/assessmentController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Run code execution (dry run against public test cases or custom input)
router.post('/run', protect, runCode);

// Submit code against all test cases (public + hidden)
router.post('/submit', protect, restrictTo('candidate', 'admin'), submitQuestion);

// Get submission by ID
router.get('/submissions/:submissionId', protect, getSubmissionById);

// Create assessment (Recruiter / Admin only)
router.post('/', protect, restrictTo('recruiter', 'admin'), createAssessment);

// List assessments (Supports filters, public practice, etc.)
router.get('/', protect, getAssessments);

// Get single assessment by ID (Masks hidden test cases for candidates)
router.get('/:id', protect, getAssessmentById);

// Get submissions for an assessment
router.get('/:id/submissions', protect, getAssessmentSubmissions);

export default router;
