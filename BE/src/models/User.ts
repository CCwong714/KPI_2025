import mongoose, { Schema } from 'mongoose';

export interface IUser {
  username: string;
  password: string;
  email: string;
  role: 'user' | 'admin';
  profilePhoto: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, enum: ['user', 'admin'], required: true },
    profilePhoto: { type: String, default: '' },
    refreshToken: { type: String, default: '' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
