import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidateProfileDocument extends Document {
  userId: mongoose.Types.ObjectId;
  headline: string;
  bio?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    isRemoteOnly?: boolean;
  };
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience?: number;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: number;
    endYear?: number;
    gradeOrCgpa?: string;
  }>;
  experience: Array<{
    company: string;
    title: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    description?: string;
  }>;
  certifications: Array<{
    title: string;
    issuingOrganization: string;
    issueDate: Date;
    credentialUrl?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    repoUrl?: string;
  }>;
  primaryResumeId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateProfileSchema = new Schema<ICandidateProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    headline: {
      type: String,
      required: [true, 'Headline is required'],
      trim: true,
      maxlength: 150,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    location: {
      city: String,
      state: String,
      country: String,
      isRemoteOnly: { type: Boolean, default: false },
    },
    githubUrl: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    skills: [
      {
        name: { type: String, required: true, trim: true },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
          default: 'intermediate',
        },
        yearsOfExperience: { type: Number, default: 1 },
      },
    ],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        startYear: { type: Number, required: true },
        endYear: Number,
        gradeOrCgpa: String,
      },
    ],
    experience: [
      {
        company: { type: String, required: true },
        title: { type: String, required: true },
        location: String,
        startDate: { type: Date, required: true },
        endDate: Date,
        isCurrent: { type: Boolean, default: false },
        description: String,
      },
    ],
    certifications: [
      {
        title: { type: String, required: true },
        issuingOrganization: { type: String, required: true },
        issueDate: { type: Date, required: true },
        credentialUrl: String,
      },
    ],
    projects: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        technologies: [String],
        liveUrl: String,
        repoUrl: String,
      },
    ],
    primaryResumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
    },
  },
  {
    timestamps: true,
  }
);

CandidateProfileSchema.index({ 'skills.name': 1 });

export const CandidateProfile = mongoose.model<ICandidateProfileDocument>(
  'CandidateProfile',
  CandidateProfileSchema
);
