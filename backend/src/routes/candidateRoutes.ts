import { Router } from 'express';
import multer from 'multer';
import {
  getProfile,
  updateProfile,
  uploadResume,
  getResumes,
  getApplications,
  getAnalytics,
} from '../controllers/candidateController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Configure Multer for resume file uploads (in-memory buffer, 10MB max, PDF/DOCX filter)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.pdf') || file.originalname.endsWith('.docx')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF and DOCX files are allowed.'));
    }
  },
});

// All candidate routes require authentication & Candidate role
router.use(protect);
router.use(restrictTo('candidate'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/resume/upload', upload.single('resume'), uploadResume);
router.get('/resumes', getResumes);
router.get('/applications', getApplications);
router.get('/analytics', getAnalytics);

export default router;
