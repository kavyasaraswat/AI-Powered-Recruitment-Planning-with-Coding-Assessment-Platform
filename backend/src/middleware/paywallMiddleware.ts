import { Request, Response, NextFunction } from 'express';
import { Subscription } from '../models/Subscription';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { Job } from '../models/Job';

export const requirePlan = (...allowedPlanCodes: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      // 1. Query active subscription
      const activeSub = await Subscription.findOne({
        userId,
        status: 'active',
        currentPeriodEnd: { $gte: new Date() },
      });

      const currentPlanCode = activeSub ? activeSub.planCode : (req.user?.role === 'recruiter' ? 'RECRUITER_STARTER' : 'CANDIDATE_FREE');

      if (!allowedPlanCodes.includes(currentPlanCode)) {
        res.status(402).json({
          success: false,
          error: 'PaymentRequired',
          code: 'PLAN_UPGRADE_REQUIRED',
          message: `This feature requires a premium plan. Current: '${currentPlanCode}'. Required: [${allowedPlanCodes.join(', ')}]`,
          upgradeUrl: '/pricing',
        });
        return;
      }

      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'ServerError',
        message: error.message || 'Error checking subscription entitlements.',
      });
    }
  };
};

export const requireFeature = (featureKey: 'canAccessAdvancedMatching' | 'canCreateCustomAssessments') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      const activeSub = await Subscription.findOne({
        userId,
        status: 'active',
        currentPeriodEnd: { $gte: new Date() },
      }).populate('planId');

      let hasEntitlement = false;

      if (activeSub && activeSub.planId) {
        const plan: any = activeSub.planId;
        hasEntitlement = Boolean(plan.limits?.[featureKey]);
      }

      if (!hasEntitlement) {
        res.status(402).json({
          success: false,
          error: 'PaymentRequired',
          code: 'FEATURE_GATED',
          feature: featureKey,
          message: `Access to '${featureKey}' is restricted to Enterprise and Pro tiers. Please upgrade your subscription.`,
          upgradeUrl: '/pricing',
        });
        return;
      }

      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'ServerError',
        message: error.message || 'Error verifying feature entitlement.',
      });
    }
  };
};

export const enforceJobQuota = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;

    const activeSub = await Subscription.findOne({
      userId,
      status: 'active',
      currentPeriodEnd: { $gte: new Date() },
    }).populate('planId');

    let maxJobs = 5; // default starter quota
    if (activeSub && activeSub.planId) {
      const plan: any = activeSub.planId;
      maxJobs = plan.limits?.maxActiveJobs ?? 5;
    }

    const currentActiveJobCount = await Job.countDocuments({
      recruiterId: userId,
      status: 'published',
    });

    if (currentActiveJobCount >= maxJobs) {
      res.status(402).json({
        success: false,
        error: 'PaymentRequired',
        code: 'QUOTA_EXCEEDED',
        message: `You have reached the maximum active job limit (${maxJobs}) for your current plan. Upgrade to Enterprise for unlimited listings.`,
        currentActiveJobs: currentActiveJobCount,
        maxJobs,
        upgradeUrl: '/pricing',
      });
      return;
    }

    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Error checking job quota.',
    });
  }
};
