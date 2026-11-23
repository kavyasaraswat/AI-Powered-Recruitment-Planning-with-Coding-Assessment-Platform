import mongoose, { Schema, Document } from 'mongoose';

export interface IRecruiterProfileDocument extends Document {
  userId: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  department?: string;
  designation?: string;
  workPhone?: string;
  isVerifiedRecruiter: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterProfileSchema = new Schema<IRecruiterProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      index: true,
    },
    department: { type: String, trim: true },
    designation: { type: String, trim: true },
    workPhone: { type: String, trim: true },
    isVerifiedRecruiter: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const RecruiterProfile = mongoose.model<IRecruiterProfileDocument>(
  'RecruiterProfile',
  RecruiterProfileSchema
);
