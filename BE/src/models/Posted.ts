import mongoose, { Schema } from 'mongoose';

interface IPosted {
  userId: string;
  username: string;
  postTitle: string;
  postBody: string;
  id: string;
  status: string;
  createDate?: Date;
}

const postedSchema = new Schema<IPosted>(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    postTitle: { type: String, required: true },
    postBody: { type: String, required: true },
    id: { type: String, required: true },
    status: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Posted = mongoose.model<IPosted>('Posted', postedSchema);

export { Posted, IPosted };
