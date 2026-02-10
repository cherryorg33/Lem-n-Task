import mongoose from "mongoose";
import { Config_Url } from "./config";

export const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(Config_Url.MONGO_URL);

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);

    process.exit(1); 
  }
};
