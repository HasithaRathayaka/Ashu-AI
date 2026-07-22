import mongoose from 'mongoose';
import dns from 'dns';

// Ensure IPv4 result order for Node DNS resolution on Windows
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.includes('your_mongodb_connection_string')) {
      console.warn('⚠️ MONGO_URI is missing or contains placeholder values. Please check server/.env');
      return false;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} / DB: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ Mongoose Connection Error: ${error.message}`);
    console.warn('⚠️ Server running without active MongoDB connection. Check your Atlas IP Whitelist.');
    return false;
  }
};

export default connectDB;
