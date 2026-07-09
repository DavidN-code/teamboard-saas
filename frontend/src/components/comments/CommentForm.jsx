import { useState } from "react";

export default function CommentForm({ onCreate }) {
  const [content, setContent] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setError("");
  
    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
  
    if (content.length > 1000) {
      setError("Comment cannot exceed 1000 characters.");
      return;
    }
  
    try {
      await onCreate(content);
  
      setContent("");
      setError("");
  
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Unable to add comment."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
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
      marginBottom: "10px",
      fontSize: "14px",
    }}
  >
    {error}
  </p>
)}

<button
  type="submit"
  style={{
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  Add Comment
</button>
    </form>
  );
}