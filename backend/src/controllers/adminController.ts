import { Request, Response } from 'express';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { Submission } from '../models/Submission';
import { Payment } from '../models/Payment';
import { ActivityLog } from '../models/ActivityLog';

/**
 * Platform metrics & health overview
 */
export const getPlatformStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalCompanies,
      activeJobs,
      totalApplications,
      totalSubmissions,
      payments,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      Company.countDocuments(),
      Job.countDocuments({ status: 'published' }),
      Application.countDocuments(),
      Submission.countDocuments(),
      Payment.find({ status: 'captured' }),
    ]);

    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          candidates: totalCandidates,
          recruiters: totalRecruiters,
        },
        companies: totalCompanies,
        jobs: {
          active: activeJobs,
        },
        applications: totalApplications,
        submissions: totalSubmissions,
        revenue: {
          totalAmount: totalRevenue,
          currency: 'INR',
          transactionsCount: payments.length,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch platform metrics.',
    });
  }
};

/**
 * Paginated user listing with filters
 */
export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const filter: any = {};

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { email: { $regex: String(search), $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).select('-passwordHash').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to list users.',
    });
  }
};

/**
 * Suspend or activate a user
 */
export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'pending'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Invalid user status. Allowed: active, suspended, pending.',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(userId, { $set: { status } }, { new: true }).select('-passwordHash');
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'User not found.',
      });
      return;
    }

    await ActivityLog.create({
      actorId: req.user?.id,
      action: 'ADMIN_USER_STATUS_CHANGE',
      details: { targetUserId: userId, newStatus: status },
    });

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}.`,
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to update user status.',
    });
  }
};

/**
 * Verify or unverify an enterprise company
 */
export const verifyCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;
    const { verifiedBadge = true } = req.body;

    const company = await Company.findByIdAndUpdate(
      companyId,
      { $set: { verifiedBadge: Boolean(verifiedBadge) } },
      { new: true }
    );

    if (!company) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Company not found.',
      });
      return;
    }

    await ActivityLog.create({
      actorId: req.user?.id,
      action: 'ADMIN_COMPANY_VERIFICATION',
      details: { companyId, verifiedBadge },
    });

    res.status(200).json({
      success: true,
      message: `Company verified badge updated to ${verifiedBadge}.`,
      company,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to verify company.',
    });
  }
};

/**
 * Retrieve system activity audit logs
 */
export const getActivityLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 50 } = req.query;
    const logs = await ActivityLog.find()
      .populate('actorId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to retrieve activity logs.',
    });
  }
};
