import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanyDocument extends Document {
  name: string;
  website?: string;
  logoUrl?: string;
  industry: string;
  companySize: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  description?: string;
  locations: string[];
  recruiterAdminId: mongoose.Types.ObjectId;
  verifiedBadge: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompanyDocument>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    website: { type: String, trim: true },
    logoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542744094-3a3172720a42?w=120&h=120&fit=crop',
    },
    industry: {
      type: String,
      required: true,
      default: 'Information Technology & Software',
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
      default: '51-200',
    },
    description: String,
    locations: [{ type: String, trim: true }],
    recruiterAdminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    verifiedBadge: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Company = mongoose.model<ICompanyDocument>('Company', CompanySchema);
