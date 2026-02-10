import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  taskName: string;
  description: string;
  dueDate: Date;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  taskName: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITask>("Task", TaskSchema);
