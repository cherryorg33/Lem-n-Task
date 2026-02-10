import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controller/task.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/", createTask);
router.get("/", getTasks); // GET /api/tasks?page=1&limit=10&search=keyword
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
