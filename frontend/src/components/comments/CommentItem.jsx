import { useState } from "react";

export default function CommentItem({
  comment,
  onDelete,
  onUpdate,
}) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const saveEdit = async () => {
    await onUpdate(comment._id, content);
    setEditing(false);
  };

  return (
    <div
      style={{
        borderBottom: "1px solid #ddd",
        padding: "10px 0",
      }}
    >
      <strong>
        {comment.createdBy?.name || "User"}
      </strong>

      {!editing ? (
        <p>{comment.content}</p>
      ) : (
        <textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />
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
          <button onClick={() => setEditing(true)}>
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