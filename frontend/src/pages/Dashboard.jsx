// frontend/src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { useActiveBoard } from "../context/ActiveBoardContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import TaskModal from "../components/tasks/TaskModal";
import TaskDetailsModal from "../components/tasks/TaskDetailsModal";


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

  useEffect(() => {
    const fetchTasks = async () => {
      if (!activeBoard) return;

      try {
        setLoadingTasks(true);
        setTaskError("");

        const res = await api.get(
          `/tasks/board/${activeBoard._id}`
        );

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
      const res = await api.put(
        `/tasks/${taskId}`,
        updatedData
      );
  
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? res.data : task
        )
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
  
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
  
      setIsDetailsModalOpen(false);
      setSelectedTask(null);
  
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  );
  
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  );
  
  const doneTasks = tasks.filter(
    (task) => task.status === "done"
  );


  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Workspace */}
      <div style={{ flex: 1, padding: "20px" }}>
        
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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

        {/* Task Section */}
        <div style={{ marginTop: "30px" }}>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <h3>Tasks</h3>

  {activeBoard && (
    <button
      onClick={() => setIsTaskModalOpen(true)}
    >
      + New Task
    </button>
  )}
</div>

          {loadingTasks && <p>Loading tasks...</p>}

          {taskError && (
            <p style={{ color: "red" }}>{taskError}</p>
          )}

          {!loadingTasks && tasks.length === 0 && (
            <p>No tasks found for this board.</p>
          )}

          
        </div>
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "20px",
  }}
>
<div>
  <h4>Todo</h4>

  {todoTasks.map((task) => (
    <div
      key={task._id}
      onClick={() => {
        setSelectedTask(task);
        setIsDetailsModalOpen(true);
      }}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "12px",
        cursor: "pointer",
        background: "white",
      }}
    >
      <strong>{task.title}</strong>

      <p
        style={{
          fontSize: "14px",
          color: "#666",
          marginTop: "8px",
        }}
      >
        {task.description || "No description"}
      </p>
    </div>
  ))}
</div>

<div>
  <h4>In Progress</h4>

  {inProgressTasks.map((task) => (
    <div
      key={task._id}
      onClick={() => {
        setSelectedTask(task);
        setIsDetailsModalOpen(true);
      }}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "12px",
        cursor: "pointer",
        background: "white",
      }}
    >
      <strong>{task.title}</strong>

      <p
        style={{
          fontSize: "14px",
          color: "#666",
          marginTop: "8px",
        }}
      >
        {task.description || "No description"}
      </p>
    </div>
  ))}
</div>

<div>
  <h4>Done</h4>

  {doneTasks.map((task) => (
    <div
      key={task._id}
      onClick={() => {
        setSelectedTask(task);
        setIsDetailsModalOpen(true);
      }}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "12px",
        cursor: "pointer",
        background: "white",
      }}
    >
      <strong>{task.title}</strong>

      <p
        style={{
          fontSize: "14px",
          color: "#666",
          marginTop: "8px",
        }}
      >
        {task.description || "No description"}
      </p>
    </div>
  ))}
</div>
</div>

      </div>
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
  );
}