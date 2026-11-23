import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentDocument extends Document {
  userId: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  planId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  gateway: 'razorpay' | 'stripe';
  orderId: string;
  paymentId?: string;
  signature?: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  errorMessage?: string;
  metadata?: Record<string, any>;
  paidAt?: Date;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    gateway: {
      type: String,
      enum: ['razorpay', 'stripe'],
      default: 'razorpay',
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentId: {
      type: String,
      index: true,
    },
    signature: String,
    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'created',
      index: true,
    },
    errorMessage: String,
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model<IPaymentDocument>('Payment', PaymentSchema);
