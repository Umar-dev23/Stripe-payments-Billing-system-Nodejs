import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('⚡️ Using existing MongoDB connection');
    return;
  }

  try {
    console.log('🔄 Creating new MongoDB connection...');
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // Prevents the buffering timeout error
    });
    
    isConnected = db.connections[0].readyState;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ DB Connection Error:', error);
    throw error; 
  }
};