import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeDocument extends Document {
  candidateId: mongoose.Types.ObjectId;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  parsedData?: {
    extractedName?: string;
    extractedEmail?: string;
    extractedPhone?: string;
    extractedSkills: string[];
    extractedEducation: Array<{ degree: string; institution: string; year?: string }>;
    extractedExperience: Array<{ role: string; organization: string; duration?: string }>;
    rawText: string;
  };
  parsingStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResumeDocument>(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    storagePath: {
      type: String,
      required: true,
    },
    parsedData: {
      extractedName: String,
      extractedEmail: String,
      extractedPhone: String,
      extractedSkills: [String],
      extractedEducation: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
      extractedExperience: [
        {
          role: String,
          organization: String,
          duration: String,
        },
      ],
      rawText: String,
    },
    parsingStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model<IResumeDocument>('Resume', ResumeSchema);
