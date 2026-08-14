import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { useActiveBoard } from "../context/useActiveBoard";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";

import TaskModal from "../components/tasks/TaskModal";
import TaskDetailsModal from "../components/tasks/TaskDetailsModal";
import TaskCard from "../components/tasks/TaskCard";

import ActivityFeed from "../components/ActivityFeed";

import NotificationBell from "../components/notifications/NotificationBell";

import pusher from "../services/pusher";

import {
  DndContext,
  pointerWithin,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

/* ---------------- COLUMN ---------------- */
function Column({ id, title, children, isMobile }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
        minHeight: "500px",
        minWidth: isMobile ? "280px" : 0,
        flex: isMobile ? "0 0 280px" : undefined,
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "16px",
          fontSize: "18px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        {title}
      </h3>

      {children}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <h4
        style={{
          margin: 0,
          fontSize: "14px",
          fontWeight: "500",
          color: "#6b7280",
        }}
      >
        {label}
      </h4>

      <p
        style={{
          margin: "8px 0 0",
          fontSize: "28px",
          fontWeight: "700",
          color: "#111827",
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
export default function Dashboard() {
  const { activeBoard, setActiveBoard } = useActiveBoard();
  const activeBoardId = activeBoard?._id;
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [activityRefresh, setActivityRefresh] = useState(0);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskError, setTaskError] = useState("");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activeTask, setActiveTask] = useState(null);
  const dragOriginStatus = useRef(null);
  const dragCurrentStatus = useRef(null);
  const [metrics, setMetrics] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [priorityFilter, setPriorityFilter] = useState("");
const [sortBy, setSortBy] = useState("");

const [isMobile, setIsMobile] = useState(
  () => window.matchMedia("(max-width: 768px)").matches
);

useEffect(() => {
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  const handleChange = (event) => {
    setIsMobile(event.matches);

    if (!event.matches) {
      setIsSidebarOpen(false);
    }
  };

  mediaQuery.addEventListener("change", handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
}, []);

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

  /* ---------------- REAL-TIME TASK UPDATES ---------------- */
  useEffect(() => {
    if (!activeBoardId) return;
  
    const channelName = `board-${activeBoardId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("task-created", (newTask) => {
      setTasks((prev) => {
        const exists = prev.some(
          (task) => task._id === newTask._id
        );
  
        if (exists) {
          return prev;
        }
  
        return [...prev, newTask];
      });
  
      setActivityRefresh((prev) => prev + 1);
    });
  
  
    channel.bind("task-updated", (updatedTask) => {

      setTasks((prev) =>
        prev.map((task) =>
          task._id === updatedTask._id
            ? updatedTask
            : task
        )
      );
  
      setActivityRefresh((prev) => prev + 1);
    });
  
  
    channel.bind("task-deleted", (data) => {
      setTasks((prev) =>
        prev.filter(
          (task) => task._id !== data.taskId
        )
      );
    
      setSelectedTask((currentTask) => {
        if (currentTask?._id === data.taskId) {
          setIsDetailsModalOpen(false);
          return null;
        }
    
        return currentTask;
      });
    
      setActivityRefresh((prev) => prev + 1);
    });
  
    channel.bind("activity-updated", () => {
      setActivityRefresh((prev) => prev + 1);
    });
  
  }, [activeBoardId]);

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

      setTasks((prev) => {
        const exists = prev.some(
          (task) => task._id === res.data._id
        );
      
        if (exists) {
          return prev;
        }
      
        return [...prev, res.data];
      });
      setActivityRefresh((prev) => prev + 1);
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
      
      setActivityRefresh((prev) => prev + 1);

      setIsDetailsModalOpen(false);
      setSelectedTask(null);
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

      setActivityRefresh((prev) => prev + 1);

      setIsDetailsModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleOpenNotificationTask = async (taskId) => {
    try {
      const taskRes = await api.get(`/tasks/${taskId}`);
      const task = taskRes.data;
  
      const taskBoardId =
        typeof task.board === "object"
          ? task.board._id
          : task.board;
  
      if (
        taskBoardId &&
        taskBoardId !== activeBoard?._id
      ) {
        const boardRes = await api.get(
          `/boards/${taskBoardId}`
        );
  
        setActiveBoard(boardRes.data);
      }
  
      setSelectedTask(task);
      setIsDetailsModalOpen(true);
    } catch (err) {
      console.error(
        "Failed to open task from notification",
        err
      );
    }
  };

  /* ---------------- DRAG ---------------- */
  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
  
    if (!task) return;
  
    dragOriginStatus.current = task.status;
    dragCurrentStatus.current = task.status;

    setActiveTask(task);
  };

  const handleDragOver = (event) => {
  const { active, over } = event;

  if (!over) return;

  const taskId = active.id;
  const overId = over.id;

  const validColumns = ["todo", "in-progress", "done"];

  setTasks((prev) => {
    let newStatus;

    if (validColumns.includes(overId)) {
      newStatus = overId;
    } else {
      const taskUnderPointer = prev.find(
        (task) => task._id === overId
      );

      newStatus = taskUnderPointer?.status;
    }

    if (!newStatus) return prev;

    const draggedTask = prev.find(
      (task) => task._id === taskId
    );

    if (!draggedTask) return prev;

    dragCurrentStatus.current = newStatus;

    if (draggedTask.status === newStatus) {
      return prev;
    }

    return prev.map((task) =>
      task._id === taskId
        ? { ...task, status: newStatus }
        : task
    );
  });
};

  const handleDragEnd = async (event) => {
  const { active, over } = event;

  const taskId = active.id;
  const originalStatus = dragOriginStatus.current;
  const newStatus = dragCurrentStatus.current;

  setActiveTask(null);

  dragOriginStatus.current = null;
  dragCurrentStatus.current = null;

  if (!over) {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId
          ? { ...task, status: originalStatus }
          : task
      )
    );

    return;
  }

  if (!newStatus || newStatus === originalStatus) {
    return;
  }

  try {
    await api.put(`/tasks/${taskId}`, {
      status: newStatus,
    });

    setActivityRefresh((prev) => prev + 1);
  } catch (err) {
    console.error("Drag update failed", err);

    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId
          ? { ...task, status: originalStatus }
          : task
      )
    );
  }
};

  const handleDragCancel = () => {
    if (activeTask && dragOriginStatus.current) {
      const taskId = activeTask._id;
      const originalStatus = dragOriginStatus.current;
  
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? { ...task, status: originalStatus }
            : task
        )
      );
    }
  
    setActiveTask(null);
    dragOriginStatus.current = null;
      dragCurrentStatus.current = null;
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
  <div
    style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f8fafc",
    }}
  >
    {!isMobile && <Sidebar />}

    {isMobile && (
      <>
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "rgba(15, 23, 42, 0.45)",
            }}
          />
        )}

        <Sidebar
          isMobile
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </>
    )}

    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: isMobile ? "16px" : "20px",
      }}
    >
        {/* HEADER */}

        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  }}
>
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  }}
>
{isMobile && (
  <button
    type="button"
    onClick={() => setIsSidebarOpen(true)}
    aria-label="Open navigation"
    style={{
      position: "fixed",
      top: "16px",
      left: "16px",
      zIndex: 900,
      width: "42px",
      height: "42px",
      flexShrink: 0,
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      background: "#ffffff",
      color: "#374151",
      fontSize: "20px",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
    }}
  >
    ☰
  </button>
)}

  <h1
    style={{
      margin: isMobile ? "0 0 0 52px" : 0,
      fontSize: isMobile ? "22px" : "32px",
      color: "#111827",
      whiteSpace: "nowrap",
    }}
  >
    Dashboard Overview
  </h1>
</div>

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
    
<MetricCard label="Users" value={metrics.users} />
<MetricCard label="Boards" value={metrics.boards} />
<MetricCard label="Tasks" value={metrics.tasks} />
<MetricCard label="Todo" value={metrics.todo} />
<MetricCard label="In Progress" value={metrics.inProgress} />
<MetricCard label="Done" value={metrics.done} />

  </div>
)}

        {/* TASK CONTROLS */}
<section style={{ marginTop: "28px", marginBottom: "20px" }}>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "16px",
    }}
  >
    <h2
      style={{
        margin: 0,
        fontSize: "22px",
        color: "#111827",
      }}
    >
      Tasks
    </h2>

    {activeBoard && (
      <span
        style={{
          fontSize: "16px",
          color: "#6b7280",
        }}
      >
        — {activeBoard.name}
      </span>
    )}
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "12px",
      padding: "14px",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    }}
  >
    <input
      type="search"
      placeholder="Search tasks..."
      aria-label="Search tasks"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        flex: "1 1 260px",
        minWidth: 0,
        padding: "10px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
      }}
    />

    <select
      aria-label="Sort tasks"
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      style={{
        padding: "10px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: "#fff",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      <option value="">No Sorting</option>
      <option value="priority">Priority</option>
      <option value="dueDate">Due Date</option>
      <option value="createdAt">Newest Created</option>
    </select>

    <select
      aria-label="Filter tasks by status"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      style={{
        padding: "10px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: "#fff",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      <option value="">All Statuses</option>
      <option value="todo">Todo</option>
      <option value="in-progress">In Progress</option>
      <option value="done">Done</option>
    </select>

    <select
      aria-label="Filter tasks by priority"
      value={priorityFilter}
      onChange={(e) => setPriorityFilter(e.target.value)}
      style={{
        padding: "10px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: "#fff",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      <option value="">All Priorities</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>

    {activeBoard &&
      user &&
      ["owner", "admin"].includes(user.role) && (
        <button
          type="button"
          onClick={() => setIsTaskModalOpen(true)}
          style={{
            border: "none",
            borderRadius: "8px",
            padding: "10px 16px",
            background: "#2563eb",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          + New Task
        </button>
      )}
  </div>

  {loadingTasks && (
    <p style={{ color: "#6b7280", marginTop: "12px" }}>
      Loading tasks...
    </p>
  )}

  {taskError && (
    <p style={{ color: "#dc2626", marginTop: "12px" }}>
      {taskError}
    </p>
  )}
</section>

        {/* DND */}
        <DndContext
  collisionDetection={pointerWithin}
  onDragStart={handleDragStart}
  onDragOver={handleDragOver}
  onDragEnd={handleDragEnd}
  onDragCancel={handleDragCancel}
>
          {/* SINGLE SORTABLE CONTEXT (IMPORTANT FIX) */}
          <SortableContext
  items={filteredTasks.map((t) => t._id)}
  strategy={verticalListSortingStrategy}
>
<div
  style={{
    display: isMobile ? "flex" : "grid",
    gridTemplateColumns: isMobile
      ? undefined
      : "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "20px",
    overflowX: isMobile ? "auto" : "visible",
    paddingBottom: isMobile ? "12px" : 0,
    WebkitOverflowScrolling: "touch",
  }}
>
              <Column 
              id="todo" 
              title={`Todo (${todoTasks.length})`} 
              isMobile={isMobile}
              >
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

              <Column
  id="in-progress"
  title={`In Progress (${inProgressTasks.length})`}
  isMobile={isMobile}
>
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

              <Column 
              id="done" 
              title={`Done (${doneTasks.length})`} 
              isMobile={isMobile}
              >
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
    <TaskCard
      task={activeTask}
      dragOverlay
    />
  ) : null}
</DragOverlay>
        </DndContext>

        <ActivityFeed refreshKey={activityRefresh} />

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
          onActivityChange={() =>
            setActivityRefresh((prev) => prev + 1)
          }
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}