import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async (): Promise<boolean> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${config.mongoUri}: ${error.message}`);
    console.warn(`[Database Warning] Running in resilient offline/mock mode for authentication checks.`);
    return false;
  }
};
