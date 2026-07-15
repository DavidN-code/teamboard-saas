import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function CommentItem({
  comment,
  onDelete,
  onUpdate,
}) {
  const { user } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const [error, setError] = useState("");
  
  const saveEdit = async () => {
    setError("");
  
    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
  
    try {
      await onUpdate(comment._id, content);
      setEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Unable to update comment."
      );
    }
  };

  const canModifyComment =
  user?.role === "owner" ||
  user?.role === "admin" ||
  String(user?.id) === String(comment.createdBy?._id);


  return (
    <div
      style={{
        padding: "10px 0",
        marginBottom: "10px",
      }}
    >
      <strong>
        {comment.createdBy?.name || "User"}
      </strong>

      {!editing ? (
  <p>{comment.content}</p>
) : (
  <>
    <textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  maxLength={1000}
  style={{
    width: "100%",
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    resize: "vertical",
    boxSizing: "border-box",
  }}
/>

    {error && (
      <p
        style={{
          color: "red",
          marginTop: "6px",
          fontSize: "14px",
        }}
      >
        {error}
      </p>
    )}
  </>
)}

      <small>
        {new Date(comment.createdAt).toLocaleString()}
      </small>

      <div>
      {canModifyComment && (
  <>
        {editing ? (
          <button onClick={saveEdit}>
            Save
          </button>
        ) : (
          
          <button
  onClick={() => {
    setEditing(true);
    setError("");
  }}
  style={{
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px",
  }}
>
  Edit
</button>
        )}

<button
  onClick={() => onDelete(comment._id)}
  style={{
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Delete
</button>
</>
)}
      </div>
    </div>
  );
}