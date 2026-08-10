import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import pusher from "../../services/pusher";
import api from "../../api/axios";
import { useActiveBoard } from "../../context/useActiveBoard";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const {
    activeBoard,
    setActiveBoard,
    boardInitialized,
  } = useActiveBoard();
  // Fetch boards
  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
  
      setBoards(res.data);
  
      if (res.data.length === 0) {
        setActiveBoard(null);
        return;
      }
  
      const savedBoardExists = activeBoard
        ? res.data.some(
            (board) => board._id === activeBoard._id
          )
        : false;
  
      if (savedBoardExists) {
        const updatedBoard = res.data.find(
          (board) => board._id === activeBoard._id
        );
  
        setActiveBoard(updatedBoard);
      } else if (boardInitialized) {
        setActiveBoard(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to load boards", err);
    }
  };

  // Initial board hydration only.
// Making fetchBoards reactive causes repeated requests because it can update activeBoard.
useEffect(() => {
  fetchBoards();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  useEffect(() => {
    if (!user?.organizationId) return;
  
    const channelName = `organization-${user.organizationId}`;
    const channel = pusher.subscribe(channelName);
  
    const handleBoardCreated = (newBoard) => {
      setBoards((prev) => {
        const exists = prev.some(
          (board) => board._id === newBoard._id
        );
  
        return exists ? prev : [...prev, newBoard];
      });
    };
  
    const handleBoardUpdated = (updatedBoard) => {
      setBoards((prev) =>
        prev.map((board) =>
          board._id === updatedBoard._id
            ? updatedBoard
            : board
        )
      );
  
      setActiveBoard((currentBoard) =>
        currentBoard?._id === updatedBoard._id
          ? updatedBoard
          : currentBoard
      );
    };
  
    const handleBoardDeleted = ({ _id }) => {
      setBoards((prev) =>
        prev.filter((board) => board._id !== _id)
      );
  
      setActiveBoard((currentBoard) =>
        currentBoard?._id === _id ? null : currentBoard
      );
    };
  
    channel.bind("board-created", handleBoardCreated);
    channel.bind("board-updated", handleBoardUpdated);
    channel.bind("board-deleted", handleBoardDeleted);
  
    return () => {
      channel.unbind("board-created", handleBoardCreated);
      channel.unbind("board-updated", handleBoardUpdated);
      channel.unbind("board-deleted", handleBoardDeleted);
    };
  }, [user?.organizationId, setActiveBoard]);

  // Create board
  const handleCreateBoard = async (e) => {
    e.preventDefault();

    if (!newBoardName.trim()) return;

    try {
      setLoading(true);

      const res = await api.post("/boards", {
        name: newBoardName,
      });

      const createdBoard = res.data;

      // Refresh board list
      await fetchBoards();

      // Auto-select newly created board
      setActiveBoard(createdBoard);

      // Clear input
      setNewBoardName("");

    } catch (err) {
      console.error("Failed to create board", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      style={{
        width: "250px",
        minWidth: "250px",
        minHeight: "100vh",
        padding: "20px 16px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          TeamBoard
        </h2>
  
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          Project workspace
        </p>
      </div>
  
      <nav style={{ marginBottom: "28px" }}>
        <Link
          to="/dashboard"
          style={{
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#374151",
            fontWeight: "600",
          }}
        >
          📊 Dashboard
        </Link>
  
        <Link
          to="/my-tasks"
          style={{
            display: "block",
            padding: "10px 12px",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#374151",
            fontWeight: "600",
          }}
        >
          ✅ My Tasks
        </Link>
      </nav>
  
      <div style={{ marginBottom: "24px" }}>
        <p
          style={{
            margin: "0 0 10px",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          Create board
        </p>
  
        <form onSubmit={handleCreateBoard}>
          <input
            type="text"
            placeholder="Board name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              marginBottom: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />
  
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "none",
              borderRadius: "8px",
              background: loading ? "#93c5fd" : "#2563eb",
              color: "#ffffff",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating..." : "+ Create Board"}
          </button>
        </form>
      </div>
  
      <div>
        <p
          style={{
            margin: "0 0 10px",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          Boards
        </p>
  
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {boards.length === 0 ? (
            <p
              style={{
                margin: 0,
                padding: "10px 12px",
                fontSize: "14px",
                color: "#9ca3af",
              }}
            >
              No boards yet
            </p>
          ) : (
            boards.map((board) => {
              const isActive = activeBoard?._id === board._id;
  
              return (
                <button
                  key={board._id}
                  type="button"
                  onClick={() => setActiveBoard(board)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "none",
                    borderLeft: isActive
                      ? "3px solid #2563eb"
                      : "3px solid transparent",
                    borderRadius: "8px",
                    background: isActive ? "#eff6ff" : "transparent",
                    color: isActive ? "#1d4ed8" : "#374151",
                    fontSize: "14px",
                    fontWeight: isActive ? "600" : "500",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {board.name}
                </button>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}