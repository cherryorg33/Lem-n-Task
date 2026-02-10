import express, { Application } from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db";

dotenv.config();

const app: Application = express();

/* ---------- Global Middlewares ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Routes (example) ---------- */
app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start", error);
    process.exit(1);
  }
};

startServer();
