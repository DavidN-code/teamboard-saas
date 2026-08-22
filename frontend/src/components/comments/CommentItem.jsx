import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/useAuth";

export default function CommentItem({
  comment,
  onDelete,
  onUpdate,
}) {
  const { user } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const [savingEdit, setSavingEdit] = useState(false);
const savingEditRef = useRef(false);

  useEffect(() => {
    if (!editing) {
      setContent(comment.content);
    }
  }, [comment.content, editing]);

  const [error, setError] = useState("");
  
  const saveEdit = async () => {
    if (savingEditRef.current) return;
  
    setError("");
  
    const trimmedContent = content.trim();
  
    if (!trimmedContent) {
      setError("Comment cannot be empty.");
      return;
    }
  
    savingEditRef.current = true;
    setSavingEdit(true);
  
    try {
      await onUpdate(comment._id, trimmedContent);
      setContent(trimmedContent);
      setEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.msg ||
          err.response?.data?.message ||
          "Unable to update comment."
      );
    } finally {
      savingEditRef.current = false;
      setSavingEdit(false);
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
        minWidth: 0,
maxWidth: "100%",
      }}
    >
      <strong>
        {comment.createdBy?.name || "User"}
      </strong>

      {!editing ? (
        <p
  style={{
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  }}
>
  {comment.content}
</p>) : (
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
    minHeight: "80px",
    maxHeight: "220px",
    overflowY: "auto",
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
          <button
          type="button"
          onClick={saveEdit}
          disabled={savingEdit}
          style={{
            cursor: savingEdit ? "not-allowed" : "pointer",
            opacity: savingEdit ? 0.65 : 1,
          }}
        >
          {savingEdit ? "Saving..." : "Save"}
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