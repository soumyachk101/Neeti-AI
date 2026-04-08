import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'RECRUITER' | 'CANDIDATE' | 'ADMIN';
  organization?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['RECRUITER', 'CANDIDATE', 'ADMIN'], default: 'CANDIDATE' },
  organization: { type: String },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
