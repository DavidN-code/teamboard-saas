// frontend/src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { useActiveBoard } from "../context/ActiveBoardContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Dashboard() {
  const { activeBoard } = useActiveBoard();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskError, setTaskError] = useState("");

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
          <h3>Tasks</h3>

          {loadingTasks && <p>Loading tasks...</p>}

          {taskError && (
            <p style={{ color: "red" }}>{taskError}</p>
          )}

          {!loadingTasks && tasks.length === 0 && (
            <p>No tasks found for this board.</p>
          )}

          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong> —{" "}
                {task.status || "No status"}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}