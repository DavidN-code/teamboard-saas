import { useEffect, useState } from "react";
import CommentList from "../comments/CommentList";
import CommentForm from "../comments/CommentForm";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../api/comments";
import { getUsers } from "../../api/users";
import { getTaskActivity } from "../../api/auditLogs";

function formatActivity(item) {
  const name = item.userId?.name || "Unknown User";

  switch (item.action) {
    case "CREATE_TASK":
      return `${name} created task "${item.details.taskTitle}"`;

    case "ASSIGN_TASK":
      return `${name} assigned task "${item.details.taskTitle}" to ${item.details.assignedTo}`;

    case "UPDATE_TASK":
      return `${name} updated task "${item.details.taskTitle}"`;

    case "CREATE_COMMENT":
      return `${name} commented: "${item.details.commentPreview}"`;

    case "UPDATE_COMMENT":
      return `${name} updated a comment: "${item.details.commentPreview}"`;

    case "DELETE_COMMENT":
      return `${name} deleted a comment`;

    case "DELETE_TASK":
      return `${name} deleted task "${item.details.taskTitle}"`;

    default:
      return `${name} performed ${item.action}`;
  }
}

function getActivityIcon(action) {
  switch (action) {
    case "CREATE_TASK":
      return "📝";

    case "ASSIGN_TASK":
      return "👤";

    case "UPDATE_TASK":
      return "✏️";

    case "DELETE_TASK":
      return "🗑️";

    case "CREATE_COMMENT":
      return "💬";

    case "UPDATE_COMMENT":
      return "🛠️";

    case "DELETE_COMMENT":
      return "❌";

    default:
      return "📌";
  }
}

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
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (task) {
      setAssignedTo(task.assignedTo?._id || "");
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "todo");
      setDueDate(
        task.dueDate
          ? task.dueDate.split("T")[0]
          : ""
      );
      setPriority(task.priority || "medium");
    }

    const loadUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
  
    loadUsers();

    const loadComments = async () => {
      if (task) {
        const res = await getComments(task._id);
        setComments(res.data);
      }
    };
    loadComments();

    const loadActivity = async () => {
      if (task) {
        const res = await getTaskActivity(task._id);
        setActivity(res.data);
      }
    };
    
    loadActivity();
  }, [task]);

  // ✅ safe render check AFTER hooks
  if (!isOpen || !task) return null;

  const handleCreateComment = async (content) => {
    await createComment({
      taskId: task._id,
      content,
    });
  
    const updated = await getComments(task._id);
  
    setComments(updated.data);
  };
  
  
  const handleUpdateComment = async (id, content) => {
    const res = await updateComment(id, {
      content,
    });
  
    setComments(
      comments.map((comment) =>
        comment._id === id
          ? res.data
          : comment
      )
    );
  };
  
  
  const handleDeleteComment = async (id) => {
    await deleteComment(id);
  
    setComments(
      comments.filter(
        (comment) => comment._id !== id
      )
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "40px",
      }}
    >
      <div
  style={{
    background: "white",
    padding: "24px",
    borderRadius: "8px",
    width: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
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

          <div style={{ fontSize: "14px", color: "#666" }}>
  <div>
    Created by:{" "}
    {task.createdBy?.name || "Unknown"}
  </div>

  <div>
    Assigned to:{" "}
    {task.assignedTo?.name || "Unassigned"}
  </div>
</div>

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

        <div style={{ marginBottom: "16px" }}>
  <strong>Assigned To</strong>

  <select
    value={assignedTo}
    onChange={(e) => setAssignedTo(e.target.value)}
    style={{
      width: "100%",
      padding: "10px",
      marginTop: "6px",
    }}
  >
    <option value="">Unassigned</option>

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

{/* PRIORITY */}
<div style={{ marginBottom: "16px" }}>
  <strong>Priority</strong>

  <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    style={{
      width: "100%",
      padding: "10px",
      marginTop: "6px",
    }}
  >
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
</div>

<div style={{ marginBottom: "16px" }}>
  <strong>Due Date</strong>

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

        {/* COMMENTS */}
<div style={{ marginBottom: "16px" }}>
  <strong>Comments</strong>

  <CommentList
    comments={comments}
    onDelete={handleDeleteComment}
    onUpdate={handleUpdateComment}
  />

  <CommentForm
    onCreate={handleCreateComment}
  />
</div>

{/* ACTIVITY TIMELINE */}
<div style={{ marginBottom: "16px" }}>
  <strong>Activity Timeline</strong>

  {activity.length === 0 ? (
    <p>No activity yet.</p>
  ) : (
    activity.map((item) => (
      <div
        key={item._id}
        style={{
          padding: "8px 0",
          borderBottom: "1px solid #eee",
        }}
      >
        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>
  <span style={{ fontSize: "20px" }}>
    {getActivityIcon(item.action)}
  </span>

  <span>
    {formatActivity(item)}
  </span>
</div>

        <small>
          {new Date(
            item.createdAt
          ).toLocaleString()}
        </small>
      </div>
    ))
  )}
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
                priority,
                dueDate,
                assignedTo,
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