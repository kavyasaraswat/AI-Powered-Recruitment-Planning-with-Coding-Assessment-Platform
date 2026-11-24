import { Request, Response } from 'express';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { Subscription } from '../models/Subscription';
import { Payment } from '../models/Payment';
import { Invoice } from '../models/Invoice';
import { BillingService } from '../services/billingService';

/**
 * Get all available subscription plans
 */
export const getPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.query;
    const filter: any = { isActive: true };
    if (role) filter.targetRole = role;

    let plans = await SubscriptionPlan.find(filter).sort({ priceMonthly: 1 });

    if (plans.length === 0) {
      await BillingService.initializeStandardPlans();
      plans = await SubscriptionPlan.find(filter).sort({ priceMonthly: 1 });
    }

    res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch subscription plans.',
    });
  }
};

/**
 * Get user's active subscription & entitlement limits
 */
export const getUserSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const subscription = await Subscription.findOne({
      userId,
      status: 'active',
      currentPeriodEnd: { $gte: new Date() },
    }).populate('planId');

    if (!subscription) {
      const defaultRole = req.user?.role || 'candidate';
      const defaultCode = defaultRole === 'recruiter' ? 'RECRUITER_STARTER' : 'CANDIDATE_FREE';
      const defaultPlan = await SubscriptionPlan.findOne({ code: defaultCode });

      res.status(200).json({
        success: true,
        isSubscribed: false,
        planCode: defaultCode,
        plan: defaultPlan,
        limits: defaultPlan?.limits,
      });
      return;
    }

    res.status(200).json({
      success: true,
      isSubscribed: true,
      subscription,
      limits: (subscription.planId as any)?.limits,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to retrieve subscription details.',
    });
  }
};

/**
 * Create Checkout Order (Razorpay / Stripe)
 */
export const createCheckoutOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId, billingCycle = 'monthly', gateway = 'razorpay' } = req.body;
    const userId = req.user?.id;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Subscription plan not found.',
      });
      return;
    }

    const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

    if (price === 0) {
      // Free plan instant activation
      const periodEnd = new Date();
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);

      const sub = await Subscription.findOneAndUpdate(
        { userId },
        {
          $set: {
            planId: plan._id,
            planCode: plan.code,
            status: 'active',
            billingCycle,
            amount: 0,
            currency: 'INR',
            gateway,
            currentPeriodStart: new Date(),
            currentPeriodEnd: periodEnd,
          },
        },
        { upsert: true, new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Free plan activated successfully.',
        subscription: sub,
      });
      return;
    }

    const order = BillingService.createRazorpayOrder(price, plan.currency);

    await Payment.create({
      userId,
      planId: plan._id,
      amount: price,
      currency: plan.currency,
      gateway,
      orderId: order.orderId,
      status: 'created',
    });

    res.status(201).json({
      success: true,
      order,
      plan: {
        name: plan.name,
        code: plan.code,
        price,
        billingCycle,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to initiate checkout order.',
    });
  }
};

/**
 * Verify payment signature & activate subscription
 */
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { orderId, paymentId, signature, planId, billingCycle = 'monthly' } = req.body;

    if (!orderId || !paymentId || !signature) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'orderId, paymentId, and signature are required for verification.',
      });
      return;
    }

    const isValid = BillingService.verifyRazorpaySignature(orderId, paymentId, signature);
    if (!isValid) {
      await Payment.findOneAndUpdate(
        { orderId },
        { $set: { status: 'failed', errorMessage: 'Invalid HMAC signature' } }
      );

      res.status(400).json({
        success: false,
        error: 'InvalidSignature',
        message: 'Payment verification failed: cryptographic signature mismatch.',
      });
      return;
    }

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Subscription plan not found.',
      });
      return;
    }

    const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

    // 1. Calculate duration
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    if (billingCycle === 'yearly') {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    } else {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    // 2. Upsert Subscription
    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      {
        $set: {
          planId: plan._id,
          planCode: plan.code,
          status: 'active',
          billingCycle,
          amount: price,
          currency: plan.currency,
          gateway: 'razorpay',
          gatewaySubscriptionId: orderId,
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: false,
        },
      },
      { upsert: true, new: true }
    );

    // 3. Update Payment record
    const payment = await Payment.findOneAndUpdate(
      { orderId },
      {
        $set: {
          subscriptionId: subscription._id,
          paymentId,
          signature,
          status: 'captured',
          paidAt: new Date(),
        },
      },
      { new: true }
    );

    // 4. Generate Tax Invoice
    const invoice = await BillingService.generateInvoice(
      userId,
      payment?._id,
      price,
      {
        name: req.user?.name || 'HireGenius Customer',
        email: req.user?.email || 'customer@hiregenius.ai',
      }
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated successfully!',
      subscription,
      invoice,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Payment verification encountered an error.',
    });
  }
};

/**
 * Cancel active subscription at period end
 */
export const cancelSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const subscription = await Subscription.findOneAndUpdate(
      { userId, status: 'active' },
      { $set: { cancelAtPeriodEnd: true, canceledAt: new Date() } },
      { new: true }
    );

    if (!subscription) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'No active subscription found to cancel.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Subscription scheduled for cancellation at the end of the billing period.',
      subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to cancel subscription.',
    });
  }
};

/**
 * Get user's payment invoices
 */
export const getUserInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const invoices = await Invoice.find({ userId }).sort({ issuedAt: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch invoices.',
    });
  }
};
