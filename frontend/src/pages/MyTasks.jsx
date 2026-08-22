import { useEffect, useState } from "react";
import api from "../api/axios";

import TaskCard from "../components/tasks/TaskCard";
import TaskDetailsModal from "../components/tasks/TaskDetailsModal";
import PageLayout from "../components/layout/PageLayout";

import { useAuth } from "../context/useAuth";
import pusher from "../services/pusher";

export default function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchMyTasks = async () => {
    try {
      const res = await api.get("/tasks/my-tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load assigned tasks", err);
    }
  };

  useEffect(() => {
    const loadInitialTasks = async () => {
      try {
        const res = await api.get("/tasks/my-tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to load assigned tasks", err);
      }
    };
  
    loadInitialTasks();
  }, []);

  useEffect(() => {
    if (!user?.organizationId) return;
  
    const channelName = `organization-${user.organizationId}`;
    const channel = pusher.subscribe(channelName);
  
    const handleTasksUpdated = () => {
      fetchMyTasks();
    };
  
    channel.bind("metrics-updated", handleTasksUpdated);
  
    return () => {
      channel.unbind("metrics-updated", handleTasksUpdated);
    };
  }, [user?.organizationId]);

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
    <PageLayout title="My Tasks">

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div>
        <h3>
  Todo ({todoTasks.length})
</h3>
          {todoTasks.length === 0 ? (
  <p>No tasks</p>
) : (
  todoTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => {
                setSelectedTask(task);
                setIsDetailsModalOpen(true);
              }}
            />)
          ))}
        </div>

        <div>
        <h3>
  In Progress ({inProgressTasks.length})
</h3>
          {inProgressTasks.length === 0 ? (
  <p>No tasks</p>
) : (
  inProgressTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => {
                setSelectedTask(task);
                setIsDetailsModalOpen(true);
              }}
            />)
          ))}
        </div>

        <div>
        <h3>
  Done ({doneTasks.length})
</h3>
          {doneTasks.length === 0 ? (
  <p>No tasks</p>
) : (
  doneTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => {
                setSelectedTask(task);
                setIsDetailsModalOpen(true);
              }}
            />)
          ))}
        </div>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
</PageLayout>  );
}