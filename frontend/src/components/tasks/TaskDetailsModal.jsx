import { useEffect, useState } from "react";

export default function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
}) {
  // ✅ ALWAYS call hooks first (no early return before hooks)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "todo");
    }
  }, [task]);

  // ✅ safe render check AFTER hooks
  if (!isOpen || !task) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "8px",
          width: "500px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2>{task.title}</h2>

          <button onClick={onClose}>X</button>
        </div>

        {/* TITLE */}
        <div style={{ marginBottom: "16px" }}>
          <strong>Title</strong>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        {/* STATUS */}
        <div style={{ marginBottom: "16px" }}>
          <strong>Status</strong>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div style={{ marginBottom: "16px" }}>
          <strong>Description</strong>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        {/* ACTIONS */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => onDeleteTask(task._id)}>
            Delete Task
          </button>

          <button
            onClick={() =>
              onUpdateTask(task._id, {
                title,
                description,
                status,
              })
            }
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}