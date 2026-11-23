import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessageDocument extends Document {
  sessionId: mongoose.Types.ObjectId;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  promptTokens?: number;
  completionTokens?: number;
  modelUsed?: string;
  feedback?: {
    isHelpful: boolean;
    comment?: string;
  };
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessageDocument>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatSession',
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    promptTokens: Number,
    completionTokens: Number,
    modelUsed: {
      type: String,
      default: 'gemini-1.5-flash',
    },
    feedback: {
      isHelpful: Boolean,
      comment: String,
    },
  },
  {
    timestamps: true,
  }
);

ChatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export const ChatMessage = mongoose.model<IChatMessageDocument>('ChatMessage', ChatMessageSchema);
