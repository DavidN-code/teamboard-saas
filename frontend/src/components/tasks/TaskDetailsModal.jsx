import { useCallback, useRef, useEffect, useState } from "react";
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

import { useAuth } from "../../context/useAuth";

import pusher from "../../services/pusher";

function formatActivity(item) {
  const name = item.userId?.name || "Unknown User";

  switch (item.action) {
    case "CREATE_TASK":
      return `${name} created task "${item.details.taskTitle}"`;

      case "ASSIGN_TASK":
        if (!item.details.assignedTo) {
          return `${name} unassigned task "${item.details.taskTitle}"`;
        }
      
        return `${name} assigned task "${item.details.taskTitle}" to ${item.details.assignedTo}`;

      case "UPDATE_TASK": {
        const changes = item.details?.changes || [];
      
        if (changes.length === 0) {
          return `${name} updated task "${item.details.taskTitle}"`;
        }
      
        return (
          <>
            <div>
              {name} updated task "{item.details.taskTitle}"
            </div>
      
            <ul
              style={{
                margin: "4px 0 0 20px",
                padding: 0,
              }}
            >
              {changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          </>
        );
      }

    case "CREATE_COMMENT":
      return `${name} commented: "${item.details.commentPreview}"`;

    case "UPDATE_COMMENT":
      return `${name} updated a comment: "${item.details.commentPreview}"`;

      case "DELETE_COMMENT":
        return `${name} deleted a comment: "${item.details.commentPreview}"`;

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
  onActivityChange,
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
  const { user } = useAuth();
  const canEditTask = user?.role === "owner" || user?.role === "admin";
  const [activityRefresh, setActivityRefresh] = useState(0);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  // Load task fields when a task is opened/changed
useEffect(() => {
  if (!task) return;

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

}, [task]);


// Load users when task modal opens
useEffect(() => {
  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  loadUsers();

}, []);


// Load comments and activity when task changes
// or when Pusher tells us something changed
useEffect(() => {
  const loadComments = async () => {
    if (!task) return;

    const res = await getComments(task._id);
    setComments(res.data);
  };

  const loadActivity = async () => {
    if (!task) return;

    const res = await getTaskActivity(task._id);
    setActivity(res.data);
  };

  loadComments();
  loadActivity();

}, [task, activityRefresh]);

const taskId = task?._id;
const boardId = task?.board;

useEffect(() => {
  if (!taskId || !boardId) return;

  const channelName = `board-${boardId}`;
  const channel = pusher.subscribe(channelName);

  const handleTaskUpdated = (updatedTask) => {
    if (updatedTask._id !== taskId) {
      return;
    }

    setTitle(updatedTask.title || "");
    setDescription(updatedTask.description || "");
    setStatus(updatedTask.status || "todo");
    setPriority(updatedTask.priority || "medium");

    setDueDate(
      updatedTask.dueDate
        ? updatedTask.dueDate.split("T")[0]
        : ""
    );

    setAssignedTo(updatedTask.assignedTo?._id || "");

    setActivityRefresh((prev) => prev + 1);
  };

  channel.bind("task-updated", handleTaskUpdated);

  return () => {
    channel.unbind("task-updated", handleTaskUpdated);
  };
}, [taskId, boardId]);

  // ✅ safe render check AFTER hooks
  const refreshActivity = useCallback(async () => {
    if (!taskId) return;
  
    const res = await getTaskActivity(taskId);
    setActivity(res.data);
  }, [taskId]);
  
  
  const handleCreateComment = async (content) => {
    await createComment({
      taskId: task._id,
      content,
    });
  
    const updated = await getComments(task._id);
  
    setComments(updated.data);
  
    await refreshActivity();

if (onActivityChange) {
  onActivityChange();
}
  };
  
  
  const handleUpdateComment = async (id, content) => {
    await updateComment(id, {
      content,
    });
  
    const updated = await getComments(task._id);
  
    setComments(updated.data);
  
    await refreshActivity();

if (onActivityChange) {
  onActivityChange();
}
  };
  
  
  const handleDeleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
  
    await deleteComment(id);
  
    const updated = await getComments(task._id);
  
    setComments(updated.data);
  
    await refreshActivity();

if (onActivityChange) {
  onActivityChange();
}
  };

  useEffect(() => {
    if (!taskId) return;
  
    const channel = pusher.subscribe(
      `task-${taskId}`
    );
  
    // -------------------------
    // COMMENT CREATED
    // -------------------------
  
    channel.bind("comment-created", (newComment) => {
      setComments((prev) => {
        const exists = prev.some(
          (comment) => comment._id === newComment._id
        );
  
        if (exists) return prev;
  
        return [...prev, newComment];
      });
  
      refreshActivity();
    });
  
  
    // -------------------------
    // COMMENT UPDATED
    // -------------------------
  
    channel.bind("comment-updated", (updatedComment) => {
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === updatedComment._id
            ? updatedComment
            : comment
        )
      );
  
      refreshActivity();
    });
  
  
    // -------------------------
    // COMMENT DELETED
    // -------------------------
  
    channel.bind("comment-deleted", (data) => {
      setComments((prev) =>
        prev.filter(
          (comment) =>
            comment._id !== data.commentId
        )
      );
  
      refreshActivity();
    });
  
  
    return () => {
      channel.unbind_all();
    };
  
  }, [taskId, refreshActivity]);
  // Prevent rendering if modal is closed or task data is missing
  if (!isOpen || !task) return null;

  const selectedAssignee = users.find(
    (member) => member._id === assignedTo
  );

  const handleSave = async () => {
    if (savingRef.current) return;
  
    savingRef.current = true;
    setSaving(true);
  
    try {
      await onUpdateTask(task._id, {
        title,
        description,
        status,
        priority,
        dueDate,
        assignedTo,
      });
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
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
          <h2>{title}</h2>

          <div style={{ fontSize: "14px", color: "#666" }}>
  <div>
    Created by:{" "}
    {task.createdBy?.name || "Unknown"}
  </div>

  <div>
    Assigned to:{" "}
    {selectedAssignee?.name || "Unassigned"}
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
            disabled={!canEditTask}
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        {/* STATUS */}
        <div style={{ marginBottom: "16px" }}>
          <strong>Status</strong>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={!canEditTask}
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
    disabled={!canEditTask}
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
    disabled={!canEditTask}
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
    disabled={!canEditTask}
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
            disabled={!canEditTask}
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

  <div>
  {formatActivity(item)}
</div>
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
        {canEditTask && (
  <>
          <button onClick={() => onDeleteTask(task._id)}>
            Delete Task
          </button>

          <button
  type="button"
  onClick={handleSave}
  disabled={saving}
  style={{
    cursor: saving ? "not-allowed" : "pointer",
    opacity: saving ? 0.65 : 1,
  }}
>
  {saving ? "Saving..." : "Save Changes"}
</button>
          </>
)}
        </div>
      </div>
    </div>
  );
}