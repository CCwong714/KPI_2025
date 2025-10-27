import mongoose from 'mongoose';

const connectToDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (e) {
    console.error('❌ MongoDB connection failed:', e);
    process.exit(1);
  }
};

export default connectToDB;
