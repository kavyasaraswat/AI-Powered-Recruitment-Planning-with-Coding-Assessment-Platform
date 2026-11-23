import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionPlanDocument extends Document {
  name: string;
  code: string;
  targetRole: 'candidate' | 'recruiter';
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string[];
  limits: {
    maxActiveJobs?: number;
    maxAiQueriesPerDay: number;
    canAccessAdvancedMatching: boolean;
    canCreateCustomAssessments: boolean;
    maxApplicantsPerJob?: number;
    hasPrioritySupport: boolean;
  };
  isActive: boolean;
  createdAt: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlanDocument>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, index: true },
    targetRole: {
      type: String,
      enum: ['candidate', 'recruiter'],
      required: true,
      index: true,
    },
    priceMonthly: { type: Number, required: true },
    priceYearly: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    features: [String],
    limits: {
      maxActiveJobs: Number,
      maxAiQueriesPerDay: { type: Number, default: 10 },
      canAccessAdvancedMatching: { type: Boolean, default: false },
      canCreateCustomAssessments: { type: Boolean, default: false },
      maxApplicantsPerJob: Number,
      hasPrioritySupport: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionPlan = mongoose.model<ISubscriptionPlanDocument>(
  'SubscriptionPlan',
  SubscriptionPlanSchema
);
