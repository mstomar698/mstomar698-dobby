import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  name: string;
  desc: string;
  img: {
    data: Buffer;
    contentType: string;
  };
  userId: string;
}

const imageSchema: Schema<IImage> = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
  userId: String,
});

export default mongoose.model<IImage>('Image', imageSchema);
