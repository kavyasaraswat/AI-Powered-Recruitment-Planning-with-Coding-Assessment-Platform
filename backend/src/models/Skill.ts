import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillDocument extends Document {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'mobile' | 'ai_ml' | 'database' | 'design' | 'other';
  aliases: string[];
}

const SkillSchema = new Schema<ISkillDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'devops', 'mobile', 'ai_ml', 'database', 'design', 'other'],
      default: 'backend',
    },
    aliases: [String],
  },
  {
    timestamps: true,
  }
);

export const Skill = mongoose.model<ISkillDocument>('Skill', SkillSchema);
