import express, { Application } from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db";
import { logger } from "./middlewares/logger.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";

import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";
import { IUser } from "./models/user.model";

dotenv.config();

const app: Application = express();

/* ---------- Global Middlewares ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Add the user object here
    }
  }
}
/* ---------- Routes (example) ---------- */
app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

/* ---------- Error Handling ---------- */
app.use(notFound);
app.use(errorHandler);

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
