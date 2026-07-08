import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { useActiveBoard } from "../context/ActiveBoardContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

import TaskModal from "../components/tasks/TaskModal";
import TaskDetailsModal from "../components/tasks/TaskDetailsModal";
import TaskCard from "../components/tasks/TaskCard";

import ActivityFeed from "../components/ActivityFeed";

import NotificationBell from "../components/notifications/NotificationBell";

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
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskError, setTaskError] = useState("");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [activeTask, setActiveTask] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const metricCardStyle = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  };

  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [priorityFilter, setPriorityFilter] = useState("");
const [sortBy, setSortBy] = useState("");

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

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get("/metrics/dashboard");
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to load metrics", err);
      }
    };
  
    fetchMetrics();
  }, []);

  const filteredTasks = tasks
  .filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      !statusFilter || task.status === statusFilter;

    const matchesPriority =
      !priorityFilter || task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  })
  .sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
    }

    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "priority") {
      const priorities = {
        high: 3,
        medium: 2,
        low: 1,
      };

      return (
        priorities[b.priority] -
        priorities[a.priority]
      );
    }

    return 0;
  });

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

  const handleOpenNotificationTask = async (taskId) => {
    try {
      const res = await api.get(`/tasks/${taskId}`);
  
      setSelectedTask(res.data);
      setIsDetailsModalOpen(true);
  
    } catch (err) {
      console.error("Failed to open task from notification", err);
    }
  };

  /* ---------------- DRAG ---------------- */
  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    console.log(localStorage.getItem("token"));
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

 /* ---------------- FILTERED KANBAN COLUMNS ---------------- */
const todoTasks = filteredTasks.filter(
  (t) => t.status === "todo"
);

const inProgressTasks = filteredTasks.filter(
  (t) => t.status === "in-progress"
);

const doneTasks = filteredTasks.filter(
  (t) => t.status === "done"
);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        {/* HEADER */}

        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  }}
>
  <h1
    style={{
      margin: 0,
    }}
  >
    Dashboard Overview
  </h1>

  <div
    style={{
      display: "flex",
      gap: "12px",
      alignItems: "center",
    }}
  >
    <NotificationBell onOpenTask={handleOpenNotificationTask} />

    <button
      onClick={() => {
        logout();
        navigate("/login");
      }}
    >
      Logout
    </button>
  </div>
</div>

        {metrics && (
  <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  }}
>
    
    <div style={metricCardStyle}>
    <h4
  style={{
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
  }}
>
  Users
</h4>

<p
  style={{
    margin: "8px 0 0",
    fontSize: "28px",
    fontWeight: "bold",
  }}
>
  {metrics.users}
</p>
    </div>

    <div style={metricCardStyle}>
      <h4>Boards</h4>
      <p>{metrics.boards}</p>
    </div>

    <div style={metricCardStyle}>
      <h4>Tasks</h4>
      <p>{metrics.tasks}</p>
    </div>

    <div style={metricCardStyle}>
      <h4>Todo</h4>
      <p>{metrics.todo}</p>
    </div>

    <div style={metricCardStyle}>
      <h4>In Progress</h4>
      <p>{metrics.inProgress}</p>
    </div>

    <div style={metricCardStyle}>
      <h4>Done</h4>
      <p>{metrics.done}</p>
    </div>

  </div>
)}


        {/* TASK CONTROLS */}
        <div style={{ marginTop: "20px" }}>
        
          <h3>Tasks</h3>
          

          {activeBoard && user && ["owner", "admin"].includes(user.role) && (
  <button onClick={() => setIsTaskModalOpen(true)}>
    + New Task
  </button>
)}

          {loadingTasks && <p>Loading...</p>}
          {taskError && <p style={{ color: "red" }}>{taskError}</p>}
        </div>

        <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  }}
>
  <input
    type="text"
    placeholder="Search tasks..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      padding: "10px",
      flex: 1,
    }}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="">All Statuses</option>
    <option value="todo">Todo</option>
    <option value="in-progress">In Progress</option>
    <option value="done">Done</option>
  </select>

  <select
    value={priorityFilter}
    onChange={(e) => setPriorityFilter(e.target.value)}
  >
    <option value="">All Priorities</option>
    <option value="high">High</option>
    <option value="medium">Medium</option>
    <option value="low">Low</option>
  </select>
</div>

<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
>
  <option value="">No Sorting</option>
  <option value="priority">Priority</option>
  <option value="dueDate">Due Date</option>
  <option value="createdAt">Newest Created</option>
</select>

        {/* DND */}
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* SINGLE SORTABLE CONTEXT (IMPORTANT FIX) */}
          <SortableContext
  items={filteredTasks.map((t) => t._id)}
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

        <ActivityFeed />

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