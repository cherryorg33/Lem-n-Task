import dotenv from "dotenv";

dotenv.config();

export const Config_Url = {
  PORT: process.env.PORT || 3000,
  MONGO_URL:
    process.env.MONGO_URL ||
    "mongodb+srv://ram:CyIRTMS6gYYdtBmt@cluster0.vtoa4.mongodb.net/Lemon",
  JWT_SECRET: process.env.JWT_SECREAT || "your_secret_key",
};