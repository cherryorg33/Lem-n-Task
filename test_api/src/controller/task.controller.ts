import { Request, Response } from "express";
import Task from "../models/task.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { z } from "zod";

// Zod schema for creating/updating tasks
const taskSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
});

// ---------------- Create Task ----------------
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const data = taskSchema.parse(req.body);

    const task = await Task.create({
      taskName: data.taskName,
      description: data.description,
      dueDate: new Date(data.dueDate),
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Get Tasks with Search & Pagination ----------------
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      user: userId,
      taskName: { $regex: search as string, $options: "i" },
    };

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      totalTasks: total,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Get Single Task ----------------
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id as string;

    const task = await Task.findOne({
      _id: req.params.id as string,
      user: userId,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Update Task ----------------
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const data = taskSchema.partial().parse(req.body);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id as string, user: req.user._id },
      {
        $set: data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Delete Task ----------------
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndUpdate({
      _id: req.params.id as string,
      user: req.user._id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
