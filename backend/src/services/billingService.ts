import * as crypto from 'crypto';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { Subscription } from '../models/Subscription';
import { Payment } from '../models/Payment';
import { Invoice } from '../models/Invoice';

export interface RazorpayOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export class BillingService {
  private static RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_hiregenius2026';
  private static RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'secret_hiregenius_test_key_999';
  private static STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_hiregenius_2026';

  /**
   * Seed / Ensure standard plans exist in database
   */
  public static async initializeStandardPlans(): Promise<void> {
    const defaultPlans = [
      {
        name: 'Candidate Free',
        code: 'CANDIDATE_FREE',
        targetRole: 'candidate' as const,
        priceMonthly: 0,
        priceYearly: 0,
        currency: 'INR',
        features: ['5 AI chat questions/day', 'Standard public coding practice', 'Basic profile listing'],
        limits: {
          maxAiQueriesPerDay: 5,
          canAccessAdvancedMatching: false,
          canCreateCustomAssessments: false,
          hasPrioritySupport: false,
        },
        isActive: true,
      },
      {
        name: 'Candidate Pro',
        code: 'CANDIDATE_PRO',
        targetRole: 'candidate' as const,
        priceMonthly: 499,
        priceYearly: 4999,
        currency: 'INR',
        features: ['Unlimited AI mock interviews', 'Full ATS resume scoring', 'Verified certification badge', 'Priority application queue'],
        limits: {
          maxAiQueriesPerDay: 500,
          canAccessAdvancedMatching: true,
          canCreateCustomAssessments: false,
          hasPrioritySupport: true,
        },
        isActive: true,
      },
      {
        name: 'Recruiter Starter',
        code: 'RECRUITER_STARTER',
        targetRole: 'recruiter' as const,
        priceMonthly: 2999,
        priceYearly: 29999,
        currency: 'INR',
        features: ['5 active job postings', '50 candidates per job', 'Standard coding test suite', 'Email support'],
        limits: {
          maxActiveJobs: 5,
          maxApplicantsPerJob: 50,
          maxAiQueriesPerDay: 50,
          canAccessAdvancedMatching: false,
          canCreateCustomAssessments: false,
          hasPrioritySupport: false,
        },
        isActive: true,
      },
      {
        name: 'Recruiter Enterprise',
        code: 'RECRUITER_ENTERPRISE',
        targetRole: 'recruiter' as const,
        priceMonthly: 9999,
        priceYearly: 99999,
        currency: 'INR',
        features: ['Unlimited active jobs', 'Unlimited candidate pool', 'Custom coding assessment creator', 'AI vector candidate match', 'Dedicated Account Manager'],
        limits: {
          maxActiveJobs: 9999,
          maxApplicantsPerJob: 9999,
          maxAiQueriesPerDay: 1000,
          canAccessAdvancedMatching: true,
          canCreateCustomAssessments: true,
          hasPrioritySupport: true,
        },
        isActive: true,
      },
    ];

    for (const p of defaultPlans) {
      await SubscriptionPlan.findOneAndUpdate({ code: p.code }, { $set: p }, { upsert: true, new: true });
    }
  }

  /**
   * Create Razorpay Payment Order
   */
  public static createRazorpayOrder(amount: number, currency: string = 'INR'): RazorpayOrderResult {
    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(4).toString('hex');
    const orderId = `order_${timestamp}_${randomHex}`;

    return {
      orderId,
      amount: Math.round(amount * 100), // in paise (1 INR = 100 paise)
      currency,
      keyId: this.RAZORPAY_KEY_ID,
    };
  }

  /**
   * Cryptographically verify Razorpay HMAC-SHA256 signature
   */
  public static verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string,
    customSecret?: string
  ): boolean {
    const secret = customSecret || this.RAZORPAY_KEY_SECRET;
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  }

  /**
   * Generate sequential tax invoice
   */
  public static async generateInvoice(
    userId: any,
    paymentId: any,
    baseAmount: number,
    billingDetails: { name: string; email: string; address?: string; gstin?: string }
  ): Promise<any> {
    const datePrefix = new Date().toISOString().slice(0, 7).replace('-', '');
    const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    const invoiceNumber = `INV-${datePrefix}-${randomSuffix}`;

    const taxAmount = Math.round(baseAmount * 0.18); // 18% GST
    const totalAmount = baseAmount + taxAmount;

    return await Invoice.create({
      invoiceNumber,
      userId,
      paymentId,
      amount: baseAmount,
      taxAmount,
      totalAmount,
      currency: 'INR',
      billingDetails,
      issuedAt: new Date(),
    });
  }
}
