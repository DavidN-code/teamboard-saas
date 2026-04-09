// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoardsAndTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        // 1️⃣ Fetch all boards
        const boardsRes = await api.get("/boards", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const boardsData = boardsRes.data || [];
        setBoards(boardsData);

        if (boardsData.length === 0) {
          setError("No boards found for your organization.");
          setLoading(false);
          return;
        }

        // 2️⃣ Select the first board by default
        const firstBoard = boardsData[0];
        setSelectedBoard(firstBoard);

        // 3️⃣ Fetch tasks for the selected board
        const tasksRes = await api.get(`/tasks/boards/${firstBoard._id}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(tasksRes.data || []);
        setLoading(false);

      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load dashboard");
        setLoading(false);
      }
    };

    fetchBoardsAndTasks();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>

      {selectedBoard && (
        <div style={{ marginTop: "20px" }}>
          <h2>Board: {selectedBoard.name}</h2>
          <p>ID: {selectedBoard._id}</p>
        </div>
      )}

      <h3>Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks found for this board.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <strong>{task.title}</strong> - {task.status || "No status"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;