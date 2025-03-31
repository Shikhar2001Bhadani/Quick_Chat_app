import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const connectDB = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    
    if (!MONGODB_URL) {
      throw new Error("MongoDB connection string is missing in .env file.");
    }

    const instance = await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${instance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Stop the server if MongoDB fails to connect
  }
};
