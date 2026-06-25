import { useEffect, useState } from "react";
import api from "../api/axios";

import TaskCard from "../components/tasks/TaskCard";
import TaskDetailsModal from "../components/tasks/TaskDetailsModal";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const res = await api.get("/tasks/my-tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to load assigned tasks", err);
      }
    };

    fetchMyTasks();
  }, []);

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
    <div style={{ padding: "20px" }}>
      <h1>My Tasks</h1>

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
    </div>
  );
}