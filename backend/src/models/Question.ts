import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionDocument extends Document {
  title: string;
  slug: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  supportedLanguages: string[];
  starterTemplates: Record<string, string>;
  constraints: string[];
  publicTestCases: Array<{
    input: string;
    expectedOutput: string;
    explanation?: string;
  }>;
  hiddenTestCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestionDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
      index: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Algorithms',
      index: true,
    },
    supportedLanguages: {
      type: [String],
      default: ['python', 'javascript', 'java', 'cpp', 'c'],
    },
    starterTemplates: {
      type: Map,
      of: String,
    },
    constraints: [String],
    publicTestCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        explanation: String,
      },
    ],
    hiddenTestCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Question = mongoose.model<IQuestionDocument>('Question', QuestionSchema);
