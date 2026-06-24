import { useState } from "react";

export default function TaskModal({
  isOpen,
  onClose,
  onCreateTask,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onCreateTask({
      title,
      description,
      status: "todo",
      priority,
      dueDate,
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
  };

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
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
        }}
      >
        <h2>Create Task</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "10px",
              }}
            />
          </div>
          <div style={{ marginBottom: "12px" }}>
  <label>
    <strong>Priority</strong>
  </label>

  <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    style={{
      width: "100%",
      padding: "10px",
      marginTop: "6px",
    }}
  >
    <option value="low">🟢 Low</option>
    <option value="medium">🟡 Medium</option>
    <option value="high">🔴 High</option>
  </select>
</div>

<div style={{ marginBottom: "12px" }}>
  <label>
    <strong>Due Date</strong>
  </label>

  <input
    type="date"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
    style={{
      width: "100%",
      padding: "10px",
      marginTop: "6px",
    }}
  />
</div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}