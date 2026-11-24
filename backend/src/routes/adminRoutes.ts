import { Router } from 'express';
import {
  getPlatformStats,
  listUsers,
  updateUserStatus,
  verifyCompany,
  getActivityLogs,
} from '../controllers/adminController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// All admin routes strictly guarded
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', listUsers);
router.patch('/users/:userId/status', updateUserStatus);
router.patch('/companies/:companyId/verify', verifyCompany);
router.get('/logs', getActivityLogs);

export default router;
