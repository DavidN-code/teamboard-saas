import { useRef, useState } from "react";

export default function CommentForm({ onCreate }) {
  const [content, setContent] = useState("");

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);
const submittingRef = useRef(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (submittingRef.current) return;

  setError("");

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    setError("Comment cannot be empty.");
    return;
  }

  if (trimmedContent.length > 1000) {
    setError("Comment cannot exceed 1000 characters.");
    return;
  }

  submittingRef.current = true;
  setSubmitting(true);

  try {
    await onCreate(trimmedContent);

    setContent("");
    setError("");
  } catch (err) {
    setError(
      err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Unable to add comment."
    );
  } finally {
    submittingRef.current = false;
    setSubmitting(false);
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
  disabled={submitting}
  style={{
    background: submitting ? "#93c5fd" : "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: submitting ? "not-allowed" : "pointer",
    fontWeight: "600",
    opacity: submitting ? 0.75 : 1,
  }}
>
  {submitting ? "Adding..." : "Add Comment"}
</button>
    </form>
  );
}