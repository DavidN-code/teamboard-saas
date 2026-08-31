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
                overflowWrap: "anywhere",
                wordBreak: "break-word",
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

  const originalDueDate = task.dueDate
  ? task.dueDate.split("T")[0]
  : "";

const originalAssignedTo =
  task.assignedTo?._id || "";

const hasUnsavedChanges =
  canEditTask &&
  (
    title !== (task.title || "") ||
    description !== (task.description || "") ||
    status !== (task.status || "todo") ||
    priority !== (task.priority || "medium") ||
    dueDate !== originalDueDate ||
    assignedTo !== originalAssignedTo
  );

  const handleRequestClose = () => {
    if (hasUnsavedChanges) {
      const shouldDiscard = window.confirm(
        "You have unsaved changes. Close without saving them?"
      );
  
      if (!shouldDiscard) {
        return;
      }
  
      resetTaskFields();
    }
  
    onClose();
  };

  const resetTaskFields = () => {
    setTitle(task.title || "");
    setDescription(task.description || "");
    setStatus(task.status || "todo");
    setPriority(task.priority || "medium");
    setDueDate(
      task.dueDate
        ? task.dueDate.split("T")[0]
        : ""
    );
    setAssignedTo(task.assignedTo?._id || "");
  };

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
    onClick={handleRequestClose}
  style={{
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "24px 16px",
    overflowY: "auto",
    zIndex: 1000,
  }}
>
  <div
    onClick={(e) => e.stopPropagation()}
    style={{
      background: "#ffffff",
      width: "100%",
      maxWidth: "720px",
      maxHeight: "none",
      overflowY: "visible",
      borderRadius: "14px",
      boxShadow: "0 24px 60px rgba(0, 0, 0, 0.22)",
      padding: "28px 32px 32px",
      boxSizing: "border-box",
    }}
  >
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    paddingBottom: "20px",
    marginBottom: "24px",
    borderBottom: "1px solid #e5e7eb",
  }}
>
<div
  style={{
    minWidth: 0,
    flex: 1,
  }}
>
  <h2
    style={{
      margin: "0 0 8px",
      fontSize: "24px",
      lineHeight: 1.25,
      color: "#111827",
      maxWidth: "100%",
      overflowWrap: "anywhere",
      wordBreak: "break-word",
      whiteSpace: "normal",
    }}
  >
    {title || "Untitled Task"}
  </h2>

    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 20px",
        fontSize: "14px",
        color: "#6b7280",
      }}
    >
      <span>
        Created by{" "}
        <strong style={{ color: "#374151" }}>
          {task.createdBy?.name || "Unknown"}
        </strong>
      </span>

      <span>
        Assigned to{" "}
        <strong style={{ color: "#374151" }}>
          {selectedAssignee?.name || "Unassigned"}
        </strong>
      </span>
    </div>
  </div>

  <button
    type="button"
    onClick={handleRequestClose}
    aria-label="Close task details"
    style={{
      flexShrink: 0,
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
</div>

        {/* TITLE */}
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
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    disabled={!canEditTask}
    style={{
      width: "100%",
      boxSizing: "border-box",
      padding: "11px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      background: canEditTask ? "#fff" : "#f9fafb",
      color: "#111827",
      fontSize: "15px",
      outline: "none",
    }}
  />
</div>

        {/* STATUS */}
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "20px",
  }}
>
  <div>
    <label
      style={{
        display: "block",
        marginBottom: "7px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
      }}
    >
      Status
    </label>

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      disabled={!canEditTask}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "11px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: canEditTask ? "#fff" : "#f9fafb",
        fontSize: "15px",
      }}
    >
      <option value="todo">Todo</option>
      <option value="in-progress">In Progress</option>
      <option value="done">Done</option>
    </select>
  </div>

  <div>
    <label
      style={{
        display: "block",
        marginBottom: "7px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
      }}
    >
      Assigned To
    </label>

    <select
      value={assignedTo}
      onChange={(e) => setAssignedTo(e.target.value)}
      disabled={!canEditTask}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "11px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: canEditTask ? "#fff" : "#f9fafb",
        fontSize: "15px",
      }}
    >
      <option value="">Unassigned</option>

      {users.map((user) => (
        <option key={user._id} value={user._id}>
          {user.name}
        </option>
      ))}
    </select>
  </div>

  <div>
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
      disabled={!canEditTask}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "11px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: canEditTask ? "#fff" : "#f9fafb",
        fontSize: "15px",
      }}
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </div>

  <div>
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
    if (
      canEditTask &&
      typeof e.currentTarget.showPicker === "function"
    ) {
      e.currentTarget.showPicker();
    }
  }}
  disabled={!canEditTask}
  style={{
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: canEditTask ? "#fff" : "#f9fafb",
    fontSize: "15px",
    cursor: canEditTask ? "pointer" : "default",
  }}
/>
  </div>
</div>

        {/* DESCRIPTION */}
<div style={{ marginBottom: "28px" }}>
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
    disabled={!canEditTask}
    rows={4}
    style={{
      width: "100%",
      boxSizing: "border-box",
      padding: "11px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      background: canEditTask ? "#fff" : "#f9fafb",
      color: "#111827",
      fontSize: "15px",
      lineHeight: 1.5,
      resize: "vertical",
      minHeight: "100px",
      maxHeight: "300px",
      overflowY: "auto",
      outline: "none",
    }}
  />
</div>

        {/* COMMENTS */}
        <div
  style={{
    marginTop: "8px",
    marginBottom: "24px",
    padding: "20px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
  }}
>
  <h3
    style={{
      margin: "0 0 16px",
      fontSize: "16px",
      color: "#111827",
    }}
  >
    Comments
  </h3>

  <CommentList
    comments={comments}
    onDelete={handleDeleteComment}
    onUpdate={handleUpdateComment}
  />

  <div style={{ marginTop: "16px" }}>
    <CommentForm onCreate={handleCreateComment} />
  </div>
</div>

{/* ACTIVITY TIMELINE */}
<div
  style={{
    marginBottom: "24px",
    padding: "20px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
  }}
>
  <h3
    style={{
      margin: "0 0 14px",
      fontSize: "16px",
      color: "#111827",
    }}
  >
    Activity Timeline
  </h3>

  {activity.length === 0 ? (
    <p
      style={{
        margin: 0,
        color: "#6b7280",
        fontSize: "14px",
      }}
    >
      No activity yet.
    </p>
  ) : (
    activity.map((item) => (
      <div
        key={item._id}
        style={{
          display: "flex",
          gap: "12px",
          padding: "12px 0",
          borderBottom: "1px solid #f0f1f3",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            background: "#f3f4f6",
            fontSize: "16px",
          }}
        >
          {getActivityIcon(item.action)}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#374151",
              fontSize: "14px",
              lineHeight: 1.5,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {formatActivity(item)}
          </div>

          <div
            style={{
              marginTop: "4px",
              color: "#9ca3af",
              fontSize: "12px",
            }}
          >
            {new Date(item.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    ))
  )}
</div>

        {/* ACTIONS */}
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
  }}
>
  {canEditTask && (
    <>
      <button
        type="button"
        onClick={() => onDeleteTask(task._id)}
        style={{
          padding: "10px 16px",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          background: "#fff",
          color: "#dc2626",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Delete Task
      </button>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          background: saving ? "#93c5fd" : "#2563eb",
          color: "#fff",
          fontWeight: "600",
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.75 : 1,
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