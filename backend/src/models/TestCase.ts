import mongoose, { Schema, Document } from 'mongoose';

export interface ITestCaseDocument extends Document {
  questionId: mongoose.Types.ObjectId;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  weight: number;
}

const TestCaseSchema = new Schema<ITestCaseDocument>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true,
    },
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    weight: { type: Number, default: 10 },
  },
  {
    timestamps: true,
  }
);

export const TestCase = mongoose.model<ITestCaseDocument>('TestCase', TestCaseSchema);
