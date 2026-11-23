import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  planCode: string;
  status: 'active' | 'canceled' | 'past_due' | 'expired';
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  gateway: 'razorpay' | 'stripe';
  gatewaySubscriptionId?: string;
  gatewayCustomerId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    planCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'expired'],
      default: 'active',
      index: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    gateway: {
      type: String,
      enum: ['razorpay', 'stripe'],
      default: 'razorpay',
    },
    gatewaySubscriptionId: String,
    gatewayCustomerId: String,
    currentPeriodStart: { type: Date, default: Date.now },
    currentPeriodEnd: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    canceledAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model<ISubscriptionDocument>('Subscription', SubscriptionSchema);
