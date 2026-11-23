import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLogDocument extends Document {
  actorId?: mongoose.Types.ObjectId;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLogDocument>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    ipAddress: String,
    userAgent: String,
    details: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

ActivityLogSchema.index({ actorId: 1, createdAt: -1 });

export const ActivityLog = mongoose.model<IActivityLogDocument>('ActivityLog', ActivityLogSchema);
