import mongoose, { Schema, Document } from 'mongoose';

export interface IJobDocument extends Document {
  companyId?: mongoose.Types.ObjectId;
  companyName: string;
  companyLogo?: string;
  creatorRecruiterId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  department: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  workplaceType: 'On-site' | 'Hybrid' | 'Remote';
  location: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  minExperienceYears: number;
  salary: {
    min: number;
    max: number;
    currency: string;
    isDisclosed: boolean;
  };
  requiredSkills: string[];
  preferredSkills: string[];
  assessmentId?: mongoose.Types.ObjectId;
  status: 'draft' | 'published' | 'closed' | 'archived';
  applicationDeadline?: Date;
  applicantCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJobDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: String,
    creatorRecruiterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    department: {
      type: String,
      required: true,
      default: 'Engineering',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    workplaceType: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote'],
      default: 'Remote',
    },
    location: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'],
      default: 'Mid',
    },
    minExperienceYears: {
      type: Number,
      default: 2,
    },
    salary: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'INR' },
      isDisclosed: { type: Boolean, default: true },
    },
    requiredSkills: [{ type: String, trim: true }],
    preferredSkills: [{ type: String, trim: true }],
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed', 'archived'],
      default: 'published',
    },
    applicationDeadline: Date,
    applicantCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

JobSchema.index({ status: 1, createdAt: -1 });
JobSchema.index({ requiredSkills: 1 });

export const Job = mongoose.model<IJobDocument>('Job', JobSchema);
