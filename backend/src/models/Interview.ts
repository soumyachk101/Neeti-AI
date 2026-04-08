import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  recruiterId: mongoose.Types.ObjectId;
  candidateEmail: string;
  candidateName?: string;
  role: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  scheduledAt: Date;
  durationMinutes: number;
  inviteToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>({
  recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  candidateEmail: { type: String, required: true },
  candidateName: { type: String },
  role: { type: String, required: true },
  status: { type: String, enum: ['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 60 },
  inviteToken: { type: String },
}, { timestamps: true });

export const Interview = mongoose.model<IInterview>('Interview', interviewSchema);
