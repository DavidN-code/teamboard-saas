import { useEffect, useRef, useState } from "react";
import { getUsers } from "../../api/users";

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


  return (
    <div
      onClick={handleRequestClose}
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
  onClick={(e) => e.stopPropagation()}
  style={{
    background: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
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


          <div style={{ marginBottom: "12px" }}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
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
              maxLength={5000}
              style={{
                width: "100%",
                padding: "10px",
                resize: "vertical",
                minHeight: "100px",
                maxHeight: "300px",
                overflowY: "auto",
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
  onClick={(e) => {
    if (typeof e.currentTarget.showPicker === "function") {
      e.currentTarget.showPicker();
    }
  }}
  min="1900-01-01"
  max="2100-12-31"
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    cursor: "pointer",
  }}
/>
          </div>


          <div style={{ marginBottom: "12px" }}>
            <label>
              <strong>Assign To</strong>
            </label>

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            >

              <option value="">
                Unassigned
              </option>

              {users.map((user) => (
                <option
                  key={user._id}
                  value={user._id}
                >
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