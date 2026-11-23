import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicationDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  candidateProfileId?: mongoose.Types.ObjectId;
  resumeId?: mongoose.Types.ObjectId;
  candidateName: string;
  candidateEmail: string;
  candidateHeadline?: string;
  jobTitle: string;
  companyName: string;
  coverLetter?: string;
  status: 'applied' | 'screening' | 'shortlisted' | 'assessment' | 'interview' | 'selected' | 'rejected';
  aiMatchingScore?: {
    overallScore: number;
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    explanation: string;
  };
  assessmentScore?: number;
  notes: Array<{
    authorId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;
  interviewSchedule?: {
    scheduledAt: Date;
    meetingUrl?: string;
    notes?: string;
  };
  appliedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplicationDocument>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    candidateProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'CandidateProfile',
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
    },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    candidateHeadline: String,
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    coverLetter: String,
    status: {
      type: String,
      enum: ['applied', 'screening', 'shortlisted', 'assessment', 'interview', 'selected', 'rejected'],
      default: 'applied',
    },
    aiMatchingScore: {
      overallScore: { type: Number, min: 0, max: 100 },
      skillsScore: Number,
      experienceScore: Number,
      educationScore: Number,
      matchedSkills: [String],
      missingSkills: [String],
      explanation: String,
    },
    assessmentScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    notes: [
      {
        authorId: { type: Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    interviewSchedule: {
      scheduledAt: Date,
      meetingUrl: String,
      notes: String,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
ApplicationSchema.index({ status: 1 });

export const Application = mongoose.model<IApplicationDocument>(
  'Application',
  ApplicationSchema
);
