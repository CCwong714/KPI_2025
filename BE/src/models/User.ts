import mongoose, { Schema } from 'mongoose';

interface IUser {
  username: string;
  password: string;
  email: string;
  role: 'user' | 'admin';
  profilePhoto: string;
  createdAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    role: { type: String, enum: ['user', 'admin'], required: true },
    profilePhoto: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);

export { User, IUser };
