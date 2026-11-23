import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmissionDocument extends Document {
  assessmentId?: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  language: string;
  sourceCode: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compilation_error';
  totalTestCases: number;
  passedTestCases: number;
  scorePercentage: number;
  executionTimeMs: number;
  memoryUsageKb: number;
  testCaseResults: Array<{
    testCaseId?: mongoose.Types.ObjectId;
    passed: boolean;
    input?: string;
    actualOutput?: string;
    expectedOutput?: string;
    errorMessage?: string;
    executionTimeMs: number;
  }>;
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmissionDocument>(
  {
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      index: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    language: { type: String, required: true },
    sourceCode: { type: String, required: true },
    status: {
      type: String,
      enum: ['accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error', 'compilation_error'],
      default: 'accepted',
    },
    totalTestCases: { type: Number, required: true },
    passedTestCases: { type: Number, required: true },
    scorePercentage: { type: Number, required: true },
    executionTimeMs: { type: Number, default: 0 },
    memoryUsageKb: { type: Number, default: 0 },
    testCaseResults: [
      {
        testCaseId: Schema.Types.ObjectId,
        passed: Boolean,
        input: String,
        actualOutput: String,
        expectedOutput: String,
        errorMessage: String,
        executionTimeMs: Number,
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Submission = mongoose.model<ISubmissionDocument>('Submission', SubmissionSchema);
