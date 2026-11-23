import mongoose, { Schema, Document } from 'mongoose';

export interface IChatSessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  role: 'candidate' | 'recruiter';
  title: string;
  contextType: 'general' | 'resume_review' | 'interview_prep' | 'job_description' | 'code_explanation';
  relatedEntityId?: mongoose.Types.ObjectId;
  messageCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter'],
      default: 'candidate',
    },
    title: {
      type: String,
      required: true,
      default: 'New AI Conversation',
    },
    contextType: {
      type: String,
      enum: ['general', 'resume_review', 'interview_prep', 'job_description', 'code_explanation'],
      default: 'general',
    },
    relatedEntityId: Schema.Types.ObjectId,
    messageCount: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ChatSessionSchema.index({ userId: 1, updatedAt: -1 });

export const ChatSession = mongoose.model<IChatSessionDocument>('ChatSession', ChatSessionSchema);
