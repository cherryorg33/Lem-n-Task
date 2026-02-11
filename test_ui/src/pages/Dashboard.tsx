import React, { useState, useEffect } from "react";
import {
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { config } from "../config";

interface Task {
  _id?: string;
  taskName: string;
  description: string;
  dueDate: string;
}

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [data, setdata] = useState({
    taskName: "",
    description: "",
    dueDate: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleChage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setdata({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (task: Task) => {
    setdata({
      taskName: task.taskName,
      description: task.description,
      dueDate: task.dueDate.split("T")[0],
    });

    setEditingId(task?._id || null);
    setIsModalOpen(true);
  };

  const user = JSON.parse(localStorage.getItem("token") as string);
  const token = user.data?.token;

  console.log(token, "getting token");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE TASK
        await axios.put(`${config.API_URL}/tasks/${editingId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Task updated successfully");
        fetchTasks(page);
      } else {
        // CREATE TASK
        await axios.post(`${config.API_URL}/tasks`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Task added successfully");
        fetchTasks(page);
      }

      // Reset form
      setdata({
        taskName: "",
        description: "",
        dueDate: "",
      });

      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const fetchTasks = async (pageNo = 1) => {
    try {
      const res = await axios.get(
        `${config.API_URL}/tasks?page=${pageNo}&limit=2`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data.tasks);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${config.API_URL}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("task deleted sucessfully");
      fetchTasks(page);
      location.reload();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 font-sans relative">
      <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-sm min-h-[80vh] flex flex-col p-6 md:p-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">
            Tasks Management
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-800 hover:bg-indigo-700 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm md:text-base transition-all"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>

        {/* --- WEB VIEW: Table --- */}
        {/* --- WEB VIEW: Floating Row Table --- */}
        <div className="hidden md:block">
          {/* Header Row */}
          <div className="grid grid-cols-12 px-8 mb-4 text-gray-400 text-sm font-medium uppercase tracking-wider">
            <div className="col-span-1 text-indigo-900">No</div>
            <div className="col-span-2 text-indigo-900">Date & Time</div>
            <div className="col-span-3 text-indigo-900">Task</div>
            <div className="col-span-5 text-indigo-900">Description</div>
            <div className="col-span-1 text-right text-indigo-900">Action</div>
          </div>

          {/* Body: Floating Card Rows */}
          <div className="space-y-4">
            {tasks.map((item: Task, idx) => (
              <div
                key={item._id}
                className="grid grid-cols-12 items-center bg-white px-8 py-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-transparent hover:border-indigo-100 transition-all group"
              >
                {/* No */}
                <div className="col-span-1 text-gray-700 font-semibold">
                  {(page - 1) * 10 + idx + 1}
                </div>

                {/* Date & Time */}
                <div className="col-span-2 text-gray-600 text-sm whitespace-nowrap">
                  {new Date(item.dueDate).toLocaleString()}
                </div>

                {/* Task Name */}
                <div className="col-span-3 text-gray-600">{item.taskName}</div>

                {/* Description */}
                <div className="col-span-5 text-gray-500 text-sm pr-8 leading-relaxed line-clamp-1">
                  {item.description}
                </div>

                {/* Action Button */}
                <div className="col-span-1 text-right relative">
                  <button
                    onClick={() =>
                      setActiveMenu(
                        activeMenu === item._id ? null : item._id || null
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical
                      size={20}
                      className="text-gray-400 group-hover:text-indigo-600"
                    />
                  </button>

                  {/* Action Dropdown Portal */}
                  {activeMenu === item._id && (
                    <div className="absolute right-0 top-12 z-50">
                      <ActionMenu
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item._id as string)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- MOBILE VIEW: Cards --- */}
        <div className="md:hidden space-y-4">
          {tasks.map((item: Task) => (
            <div
              key={item._id}
              className="border rounded-xl p-4 shadow-sm relative"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">
                  {item.taskName}
                </h3>
                <button
                  onClick={() =>
                    setActiveMenu(
                      activeMenu === item._id ? null : item._id || null
                    )
                  }
                >
                  <MoreVertical size={20} className="text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(item.dueDate).toLocaleString()}
              </p>
              {activeMenu === item._id && (
                <div className="absolute right-4 top-10 z-20">
                  <ActionMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item._id as string)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Section */}
        <div className="mt-auto pt-10 flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 border rounded-xl hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2 text-sm text-gray-500">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  page === i + 1
                    ? "bg-indigo-800 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 border rounded-xl hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* --- ADD TASK MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl transform transition-all">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-8">
              Add Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="taskName"
                value={data.taskName}
                onChange={handleChage}
                placeholder="Enter Task Name"
                className="w-full bg-gray-100 p-3 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <textarea
                placeholder="Description"
                name="description"
                value={data.description}
                onChange={handleChage}
                rows={3}
                className="w-full bg-gray-100 p-3 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
              <input
                type="text"
                placeholder="Date Picker"
                name="dueDate"
                value={data.dueDate}
                onChange={handleChage}
                onFocus={(e) => (e.target.type = "date")}
                className="w-full bg-gray-100 p-3 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <div className="flex flex-col items-center gap-4 mt-6">
                <button
                  type="submit"
                  className="w-24 bg-indigo-800 text-white py-2 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-md"
                >
                  {editingId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 text-sm hover:text-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for the Edit/Delete menu
const ActionMenu = ({ onEdit, onDelete }: ActionMenuProps) => (
  <div className="absolute right-0 top-10 w-28 bg-white border rounded-lg shadow-xl z-30 overflow-hidden">
    <button
      onClick={onEdit}
      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 border-b"
    >
      <Edit size={14} className="text-green-600" /> Edit
    </button>
    <button
      onClick={onDelete}
      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 text-red-600"
    >
      <Trash2 size={14} /> Delete
    </button>
  </div>
);

export default Dashboard;
