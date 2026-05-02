import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEOUT') {
      throw new Error(
        'MongoDB host could not be reached. Check that MONGO_URI uses your exact Atlas cluster host, for example cluster0.xxxxx.mongodb.net, and that your network/DNS can reach MongoDB Atlas.'
      );
    }

    throw error;
  }
};

export default connectDB;
