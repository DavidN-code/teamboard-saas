import { useEffect, useState } from "react";
import CommentList from "../comments/CommentList";
import CommentForm from "../comments/CommentForm";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../api/comments";

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
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "todo");
    }
    const loadComments = async () => {
      if (task) {
        const res = await getComments(task._id);
        setComments(res.data);
      }
    };
    loadComments();
  }, [task]);

  // ✅ safe render check AFTER hooks
  if (!isOpen || !task) return null;

  const handleCreateComment = async (content) => {
    const res = await createComment({
      taskId: task._id,
      content,
    });
  
    setComments([...comments, res.data]);
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