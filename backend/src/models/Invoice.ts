import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceDocument extends Document {
  invoiceNumber: string;
  userId: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  billingDetails: {
    name: string;
    email: string;
    address?: string;
    gstin?: string;
  };
  pdfUrl?: string;
  issuedAt: Date;
}

const InvoiceSchema = new Schema<IInvoiceDocument>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    amount: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    billingDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: String,
      gstin: String,
    },
    pdfUrl: String,
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Invoice = mongoose.model<IInvoiceDocument>('Invoice', InvoiceSchema);
