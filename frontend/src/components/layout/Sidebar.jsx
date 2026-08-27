import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/useAuth";
import pusher from "../../services/pusher";
import api from "../../api/axios";
import { useActiveBoard } from "../../context/useActiveBoard";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";
export default function Sidebar({
  isMobile = false,
  isOpen = true,
  onClose,
}) {  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openBoardMenu, setOpenBoardMenu] = useState(null);
  const [boardMenuPlacement, setBoardMenuPlacement] =
  useState("down");
  const boardMenuRef = useRef(null);
  const boardMenuButtonRef = useRef(null);
  const [renamingBoardId, setRenamingBoardId] = useState(null);
  const [renameBoardName, setRenameBoardName] = useState("");

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
      setBoards((prev) => {
        const deletedIndex = prev.findIndex(
          (board) => board._id === _id
        );
    
        const remainingBoards = prev.filter(
          (board) => board._id !== _id
        );
    
        setActiveBoard((currentBoard) => {
          if (currentBoard?._id !== _id) {
            return currentBoard;
          }
    
          if (remainingBoards.length === 0) {
            return null;
          }
    
          return (
            remainingBoards[deletedIndex] ||
            remainingBoards[deletedIndex - 1] ||
            remainingBoards[0]
          );
        });
    
        return remainingBoards;
      });
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

  useEffect(() => {
    if (!openBoardMenu) return;
  
    const handlePointerDown = (event) => {
      const clickedInsideMenu =
        boardMenuRef.current?.contains(event.target);
  
      const clickedMenuButton =
        boardMenuButtonRef.current?.contains(event.target);
  
      if (!clickedInsideMenu && !clickedMenuButton) {
        setOpenBoardMenu(null);
      }
    };
  
    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );
  
    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [openBoardMenu]);

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

  const handleRenameBoard = async (boardId) => {
    const trimmedName = renameBoardName.trim();
  
    if (!trimmedName) return;
  
    try {
      await api.put(`/boards/${boardId}`, {
        name: trimmedName,
      });
  
      setRenamingBoardId(null);
      setRenameBoardName("");
      setOpenBoardMenu(null);
    } catch (err) {
      console.error("Failed to rename board", err);
    }
  };

  const handleDeleteBoard = async (board) => {
    const confirmed = window.confirm(
      `Delete "${board.name}"?\n\nThis action cannot be undone.`
    );
  
    if (!confirmed) {
      setOpenBoardMenu(null);
      return;
    }
  
    try {
      await api.delete(`/boards/${board._id}`);
        
      setOpenBoardMenu(null);
    } catch (err) {
      console.error("Failed to delete board", err);
    }
  };

  return (
    <aside
  style={{
      width: "250px",
      minWidth: "250px",
      height: "100vh",
      minHeight: "100vh",
      padding: "20px 16px",
      background: "#ffffff",
      borderRight: "1px solid #e5e7eb",
      boxSizing: "border-box",
    
      position: isMobile ? "fixed" : "sticky",
      top: 0,
      alignSelf: "flex-start",
      overflowY: "auto",
    
      ...(isMobile
        ? {
            left: 0,
            zIndex: 1001,
            transform: isOpen
              ? "translateX(0)"
              : "translateX(-100%)",
            transition: "transform 0.22s ease",
            boxShadow: isOpen
              ? "4px 0 20px rgba(0, 0, 0, 0.14)"
              : "none",
          }
        : {}),
    }}
>
<div
  style={{
    marginBottom: "28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  }}
>
  <div>
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
    color: "#6b7280",
    fontWeight: "500",
    maxWidth: "165px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }}
  title={user?.organizationName || ""}
>
  {user?.organizationName || "Project workspace"}
</p>
        </div>

{isMobile && (
  <button
    type="button"
    onClick={onClose}
    aria-label="Close navigation"
    style={{
      width: "36px",
      height: "36px",
      border: "none",
      borderRadius: "8px",
      background: "#f3f4f6",
      color: "#374151",
      fontSize: "20px",
      lineHeight: 1,
      cursor: "pointer",
    }}
  >
    ×
  </button>
)}
      </div>
  
      <nav style={{ marginBottom: "28px" }}>
        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive ? "#1d4ed8" : "#374151",
            background: isActive ? "#eff6ff" : "transparent",
            fontWeight: "600",
          })}
        >
          📊 Dashboard
        </NavLink>
  
        <NavLink
          to="/my-tasks"
          style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive ? "#1d4ed8" : "#374151",
            background: isActive ? "#eff6ff" : "transparent",
            fontWeight: "600",
          })}
        >
          ✅ My Tasks
        </NavLink>
        {user && ["owner", "admin"].includes(user.role) && (
  <>
    <NavLink
      to="/members"
      style={({ isActive }) => ({
        display: "block",
        padding: "10px 12px",
        marginBottom: "6px",
        borderRadius: "8px",
        textDecoration: "none",
        color: isActive ? "#1d4ed8" : "#374151",
        background: isActive ? "#eff6ff" : "transparent",
        fontWeight: "600",
      })}
    >
      👥 Members
    </NavLink>

    <NavLink
      to="/audit-logs"
      style={({ isActive }) => ({
        display: "block",
        padding: "10px 12px",
        marginBottom: "6px",
        borderRadius: "8px",
        textDecoration: "none",
        color: isActive ? "#1d4ed8" : "#374151",
        background: isActive ? "#eff6ff" : "transparent",
        fontWeight: "600",
      })}
    >
      📋 Audit Logs
    </NavLink>
  </>
)}
      </nav>

      {user && ["owner", "admin"].includes(user.role) && (
  
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
      )}
      
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
                <div
                  key={board._id}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    borderLeft: isActive
                      ? "3px solid #2563eb"
                      : "3px solid transparent",
                    borderRadius: "8px",
                    background: isActive ? "#eff6ff" : "transparent",
                  }}
                >
                  {renamingBoardId === board._id ? (
  <div
    style={{
      flex: 1,
      display: "flex",
      gap: "6px",
      padding: "6px",
      minWidth: 0,
    }}
  >
    <input
      autoFocus
      value={renameBoardName}
      onChange={(e) => setRenameBoardName(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleRenameBoard(board._id);
        }

        if (e.key === "Escape") {
          setRenamingBoardId(null);
          setRenameBoardName("");
        }
      }}
      style={{
        flex: 1,
        minWidth: 0,
        padding: "7px 8px",
        border: "1px solid #93c5fd",
        borderRadius: "6px",
        fontSize: "14px",
        outline: "none",
      }}
    />

    <button
      type="button"
      onClick={() => handleRenameBoard(board._id)}
      style={{
        border: "none",
        borderRadius: "6px",
        padding: "6px 8px",
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      ✓
    </button>

    <button
      type="button"
      onClick={() => {
        setRenamingBoardId(null);
        setRenameBoardName("");
      }}
      style={{
        border: "none",
        borderRadius: "6px",
        padding: "6px 8px",
        background: "#e5e7eb",
        color: "#374151",
        cursor: "pointer",
      }}
    >
      ×
    </button>
  </div>
) : (
  <button
    type="button"
    onClick={() => {
      setActiveBoard(board); 
      navigate("/dashboard");
    }}
        style={{
      flex: 1,
      minWidth: 0,
      padding: "10px 12px",
      border: "none",
      background: "transparent",
      color: isActive ? "#1d4ed8" : "#374151",
      fontSize: "14px",
      fontWeight: isActive ? "600" : "500",
      textAlign: "left",
      cursor: "pointer",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}
  >
    {board.name}
  </button>
)}
              
              {user?.role === "owner" &&
  renamingBoardId !== board._id && (
                    <button
                      ref={openBoardMenu === board._id ? boardMenuButtonRef : null}
                      type="button"
                      aria-label={`Manage ${board.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                      
                        const willOpen = openBoardMenu !== board._id;
                      
                        if (willOpen) {
                          const buttonRect =
                            e.currentTarget.getBoundingClientRect();
                      
                          const estimatedMenuHeight = 90;
                      
                          const spaceBelow =
                            window.innerHeight - buttonRect.bottom;
                      
                          setBoardMenuPlacement(
                            spaceBelow < estimatedMenuHeight
                              ? "up"
                              : "down"
                          );
                        }
                      
                        setOpenBoardMenu((current) =>
                          current === board._id ? null : board._id
                        );
                      }}
                      style={{
                        flexShrink: 0,
                        width: "36px",
                        height: "36px",
                        marginRight: "4px",
                        border: "none",
                        borderRadius: "6px",
                        background: "transparent",
                        color: "#6b7280",
                        fontSize: "20px",
                        lineHeight: 1,
                        cursor: "pointer",
                      }}
                    >
                      ⋯
                    </button>
                  )}
              
                  {user?.role === "owner" &&
                    openBoardMenu === board._id && (
                      <div
                        ref={boardMenuRef}
                        style={{
                          position: "absolute",
                          right: "4px",

                          top:
                            boardMenuPlacement === "down"
                              ? "40px"
                              : "auto",

                          bottom:
                            boardMenuPlacement === "up"
                              ? "40px"
                              : "auto",
                          zIndex: 20,
                          width: "140px",
                          padding: "6px",
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <button
  type="button"
  onClick={() => {
    setRenamingBoardId(board._id);
    setRenameBoardName(board.name);
    setOpenBoardMenu(null);
  }}
  style={{
    width: "100%",
    padding: "8px 10px",
    border: "none",
    borderRadius: "6px",
    background: "transparent",
    color: "#374151",
    fontSize: "14px",
    textAlign: "left",
    cursor: "pointer",
  }}
>
  Rename
</button>
              
                        <button
                          type="button"
                          onClick={() => handleDeleteBoard(board)}
                          style={{
                            width: "100%",
                            padding: "8px 10px",
                            border: "none",
                            borderRadius: "6px",
                            background: "transparent",
                            color: "#dc2626",
                            fontSize: "14px",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}