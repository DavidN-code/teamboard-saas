import { useState } from "react";

export default function CommentItem({
  comment,
  onDelete,
  onUpdate,
}) {
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
>
  Edit
</button>
        )}

        <button
          onClick={() => onDelete(comment._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}