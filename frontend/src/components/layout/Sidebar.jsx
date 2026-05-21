import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useActiveBoard } from "../../context/ActiveBoardContext";

export default function Sidebar() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [loading, setLoading] = useState(false);

  const { activeBoard, setActiveBoard } = useActiveBoard();

  // Fetch boards
  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
      setBoards(res.data);

      // Auto-select first board if none selected
      if (!activeBoard && res.data.length > 0) {
        setActiveBoard(res.data[0]);
      }

    } catch (err) {
      console.error("Failed to load boards", err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

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
    <div
      style={{
        width: "250px",
        borderRight: "1px solid #ddd",
        padding: "15px",
      }}
    >
      <h3>Boards</h3>

      {/* Create Board Form */}
      <form onSubmit={handleCreateBoard}>
        <input
          type="text"
          placeholder="New board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "20px",
          }}
        >
          {loading ? "Creating..." : "Create Board"}
        </button>
      </form>

      {/* Board List */}
      {boards.map((board) => (
        <div
          key={board._id}
          onClick={() => setActiveBoard(board)}
          style={{
            padding: "10px",
            marginBottom: "6px",
            cursor: "pointer",
            borderRadius: "6px",
            background:
              activeBoard?._id === board._id
                ? "#e0e0e0"
                : "transparent",
          }}
        >
          {board.name}
        </div>
      ))}
    </div>
  );
}