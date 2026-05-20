// frontend/src/pages/Dashboard.jsx

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
  rectIntersection,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";

import {
  useSortable,
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function Column({ id, title, children }) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef}>
      <h4>{title}</h4>
      {children}
    </div>
  );
}


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

  const handleDragStart = (event) => {
    const task = tasks.find(t => t._id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
  
    if (!over) return;
  
    const taskId = active.id;
    const newStatus = over.id;
  
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, status: newStatus } : t
      )
    );
  
    try {
      await api.put(`/tasks/${taskId}`, {
        status: newStatus,
      });
    } catch (err) {
      console.error("Drag update failed", err);
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
        <DndContext
  collisionDetection={closestCenter}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
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
  <SortableContext
    items={todoTasks.map((task) => task._id)}
    strategy={verticalListSortingStrategy}
  >
    {todoTasks.map((task) => (
      <TaskCard
        key={task._id}
        task={task}
        onClick={() => {
          setSelectedTask(task);
          setIsDetailsModalOpen(true);
        }}
      />
    ))}
  </SortableContext>
</Column>

<Column id="in-progress" title="In Progress">
  <SortableContext
    items={inProgressTasks.map((task) => task._id)}
    strategy={verticalListSortingStrategy}
  >
    {inProgressTasks.map((task) => (
      <TaskCard
        key={task._id}
        task={task}
        onClick={() => {
          setSelectedTask(task);
          setIsDetailsModalOpen(true);
        }}
      />
    ))}
  </SortableContext>
</Column>

<Column id="done" title="Done">
  <SortableContext
    items={doneTasks.map((task) => task._id)}
    strategy={verticalListSortingStrategy}
  >
    {doneTasks.map((task) => (
      <TaskCard
        key={task._id}
        task={task}
        onClick={() => {
          setSelectedTask(task);
          setIsDetailsModalOpen(true);
        }}
      />
    ))}
  </SortableContext>
</Column>
</div>
<DragOverlay>
  {activeTask ? (
    <div style={{
      padding: "12px",
      background: "white",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    }}>
      <strong>{activeTask.title}</strong>
      <p>{activeTask.description}</p>
    </div>
  ) : null}
</DragOverlay>
</DndContext>

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