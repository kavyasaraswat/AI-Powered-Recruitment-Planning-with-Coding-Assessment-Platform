import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentDocument extends Document {
  creatorId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  durationMinutes: number;
  passScorePercentage: number;
  questionIds: mongoose.Types.ObjectId[];
  isPublicPractice: boolean;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessmentDocument>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    durationMinutes: {
      type: Number,
      default: 60,
    },
    passScorePercentage: {
      type: Number,
      default: 70,
    },
    questionIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    isPublicPractice: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Assessment = mongoose.model<IAssessmentDocument>('Assessment', AssessmentSchema);
