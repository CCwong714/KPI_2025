import mongoose, { Schema, Document } from 'mongoose';

interface ILike extends Document {
  userId: string;
  postId: string;
  createdAt?: Date;
}

const likeSchema = new Schema<ILike>(
  {
    userId: { type: String, required: true },
    postId: { type: String, required: true },
  },
  { timestamps: true }
);

const Like = mongoose.model<ILike>('Like', likeSchema);

export { Like, ILike };
