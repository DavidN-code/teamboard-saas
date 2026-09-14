import { useEffect, useRef, useState } from "react";
import { getUsers } from "../../api/users";
import "./TaskModal.css";

export default function TaskModal({
  isOpen,
  onClose,
  onCreateTask,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    if (isOpen) {
      loadUsers();
    }

  }, [isOpen]);


  if (!isOpen) return null;

const hasUnsavedChanges =
  title.trim() !== "" ||
  description.trim() !== "" ||
  priority !== "medium" ||
  dueDate !== "" ||
  assignedTo !== "";

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setAssignedTo("");
    setError("");
  };

  const handleRequestClose = () => {
    if (hasUnsavedChanges) {
      const shouldDiscard = window.confirm(
        "You have unsaved task information. Close without creating the task?"
      );
  
      if (!shouldDiscard) {
        return;
      }
    }
  
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (submittingRef.current) return;
  
    submittingRef.current = true;
    setIsSubmitting(true);
    setError("");
  
    try {
      await onCreateTask({
        title,
        description,
        status: "todo",
        priority,
        dueDate,
        assignedTo: assignedTo || null,
      });
  
      resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create task."
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const fieldStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "15px",
    outline: "none",
  };

  return (
    <div
      className="task-modal-overlay"
      onClick={handleRequestClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >

<div
  onClick={(e) => e.stopPropagation()}
  style={{
    background: "#ffffff",
    width: "100%",
    maxWidth: "640px",
    borderRadius: "14px",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.22)",
    padding: "28px 32px 32px",
    margin: "0 16px",
    boxSizing: "border-box",
  }}
>

        <h2>Create Task</h2>

        {error && (
  <p
    style={{
      color: "red",
      marginBottom: "12px",
    }}
  >
    {error}
  </p>
)}


        <form onSubmit={handleSubmit}>


        <div style={{ marginBottom: "20px" }}>
  <label
    style={{
      display: "block",
      marginBottom: "7px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
    }}
  >
    Title
  </label>

  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
    maxLength={100}
    style={fieldStyle}
  />
</div>


<div style={{ marginBottom: "20px" }}>
  <label
    style={{
      display: "block",
      marginBottom: "7px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
    }}
  >
    Description
  </label>

  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    rows={4}
    maxLength={5000}
    style={{
      ...fieldStyle,
      resize: "vertical",
      minHeight: "100px",
      maxHeight: "300px",
      overflowY: "auto",
    }}
  />
</div>


<div style={{ marginBottom: "20px" }}>
  <label
    style={{
      display: "block",
      marginBottom: "7px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
    }}
  >
    Priority
  </label>

  <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    style={fieldStyle}
  >
    <option value="low">🟢 Low</option>
    <option value="medium">🟡 Medium</option>
    <option value="high">🔴 High</option>
  </select>
</div>


<div style={{ marginBottom: "20px" }}>
  <label
    style={{
      display: "block",
      marginBottom: "7px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
    }}
  >
    Due Date
  </label>

  <input
    type="date"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
    onClick={(e) => {
      if (typeof e.currentTarget.showPicker === "function") {
        e.currentTarget.showPicker();
      }
    }}
    min="1900-01-01"
    max="2100-12-31"
    style={{
      ...fieldStyle,
      cursor: "pointer",
    }}
  />
</div>


<div style={{ marginBottom: "20px" }}>
  <label
    style={{
      display: "block",
      marginBottom: "7px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
    }}
  >
    Assign To
  </label>

  <select
    value={assignedTo}
    onChange={(e) => setAssignedTo(e.target.value)}
    style={fieldStyle}
  >
    <option value="">Unassigned</option>

    {users.map((user) => (
      <option key={user._id} value={user._id}>
        {user.name}
      </option>
    ))}
  </select>
</div>


          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >

            <button
              type="button"
              onClick={handleRequestClose}            >
              Cancel
            </button>


            <button
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting ? "Creating..." : "Create Task"}
</button>

          </div>

        </form>

      </div>

    </div>
  );
}