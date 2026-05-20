import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { useActiveBoard } from "../context/ActiveBoardContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

import TaskModal from "../components/tasks/TaskModal";
import TaskDetailsModal from "../components/tasks/TaskDetailsModal";
import TaskCard from "../components/tasks/TaskCard";

import {
  DndContext,
  closestCenter,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

/* ---------------- COLUMN ---------------- */
function Column({ id, title, children }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef}>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
export default function Dashboard() {
  const { activeBoard } = useActiveBoard();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskError, setTaskError] = useState("");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [activeTask, setActiveTask] = useState(null);

  /* ---------------- LOAD TASKS ---------------- */
  useEffect(() => {
    const fetchTasks = async () => {
      if (!activeBoard) return;

      try {
        setLoadingTasks(true);
        setTaskError("");

        const res = await api.get(`/tasks/board/${activeBoard._id}`);
        setTasks(res.data || []);
      } catch (err) {
        console.error(err);
        setTaskError("Failed to load tasks");
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [activeBoard]);

  /* ---------------- CRUD ---------------- */
  const handleCreateTask = async (taskData) => {
    try {
      const res = await api.post("/tasks", {
        ...taskData,
        board: activeBoard._id,
      });

      setTasks((prev) => [...prev, res.data]);
      setIsTaskModalOpen(false);
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, updatedData);

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data : t))
      );

      setSelectedTask(res.data);
      setIsDetailsModalOpen(false);
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${taskId}`);

      setTasks((prev) => prev.filter((t) => t._id !== taskId));

      setIsDetailsModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  /* ---------------- DRAG ---------------- */
  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    // only allow column drops
    const validColumns = ["todo", "in-progress", "done"];
    if (!validColumns.includes(newStatus)) return;

    try {
      await api.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error("Drag update failed", err);
    }
  };

  /* ---------------- FILTERS ---------------- */
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>
            {activeBoard ? activeBoard.name : "Select a Board"}
          </h2>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

        {/* TASK CONTROLS */}
        <div style={{ marginTop: "20px" }}>
          <h3>Tasks</h3>

          {activeBoard && (
            <button onClick={() => setIsTaskModalOpen(true)}>
              + New Task
            </button>
          )}

          {loadingTasks && <p>Loading...</p>}
          {taskError && <p style={{ color: "red" }}>{taskError}</p>}
        </div>

        {/* DND */}
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* SINGLE SORTABLE CONTEXT (IMPORTANT FIX) */}
          <SortableContext
            items={tasks.map((t) => t._id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              <Column id="todo" title="Todo">
                {todoTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onClick={() => {
                      setIsDetailsModalOpen(true);
                      setSelectedTask(task);
                    }}
                  />
                ))}
              </Column>

              <Column id="in-progress" title="In Progress">
                {inProgressTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onClick={() => {
                      
                      setIsDetailsModalOpen(true);
                      setSelectedTask(task);
                    }}
                  />
                ))}
              </Column>

              <Column id="done" title="Done">
                {doneTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onClick={() => {
                      setIsDetailsModalOpen(true);
                      setSelectedTask(task);
                    }}
                  />
                ))}
              </Column>
            </div>
          </SortableContext>

          {/* DRAG PREVIEW */}
          <DragOverlay>
            {activeTask ? (
              <div
                style={{
                  padding: "12px",
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                }}
              >
                <strong>{activeTask.title}</strong>
                <p>{activeTask.description}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* MODALS */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onCreateTask={handleCreateTask}
        />

        <TaskDetailsModal
          task={selectedTask}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}