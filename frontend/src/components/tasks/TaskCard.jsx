import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDate } from "../../utils/formatDate";

export default function TaskCard({
  task,
  onClick,
  dragOverlay = false,
}) {  const isOverdue =
  task.dueDate &&
  new Date(task.dueDate) < new Date() &&
  task.status !== "done";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: dragOverlay
      ? `overlay-${task._id}`
      : task._id,
    disabled: dragOverlay,
  });

  const style = {
    transform: dragOverlay
      ? "scale(1.03)"
      : CSS.Transform.toString(transform),
  
    transition: dragOverlay
      ? "none"
      : transition || "transform 200ms ease",
  
    opacity: dragOverlay
      ? 1
      : isDragging
        ? 0.2
        : 1,
  
    boxShadow: dragOverlay
      ? "0 14px 30px rgba(0,0,0,0.18)"
      : "0 2px 6px rgba(0,0,0,0.06)",
  };

  const handleClick = (e) => {
    if (isDragging) return;
    onClick(e);
  };

  return (
    <div
  ref={dragOverlay ? null : setNodeRef}
  style={{
    ...style,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "12px",
    minWidth: 0,
overflow: "hidden",
  }}
>
      
      {/* Drag handle ONLY */}
      <div
  {...(!dragOverlay ? attributes : {})}
  {...(!dragOverlay ? listeners : {})}
  style={{
    cursor: dragOverlay ? "grabbing" : "grab",
    paddingBottom: "10px",
    color: "#9ca3af",
    fontSize: "18px",
  }}
>
  ☰
</div>

      {/* Click area */}
      <div
  onClick={handleClick}
  style={{
    cursor: "pointer",
    minWidth: 0,
    maxWidth: "100%",
    overflow: "hidden",
  }}
>
  <div
    style={{
      marginBottom: "6px",
      fontSize: "12px",
      fontWeight: "bold",
    }}
  >
    {task.priority === "high" && "🔴 High"}
    {task.priority === "medium" && "🟡 Medium"}
    {task.priority === "low" && "🟢 Low"}
    {!task.priority && "🟡 Medium"}
  </div>

  <div
  style={{
    fontSize: "17px",
    fontWeight: "700",
    color: "#111827",
    lineHeight: "1.3",
    maxWidth: "100%",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    whiteSpace: "normal",
  }}
>
  {task.title}
</div>

<p
  style={{
    fontSize: "14px",
    color: "#666",
    marginTop: "8px",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  {task.description || "No description"}
</p>

{task.assignedTo && (
  <p
    style={{
      fontSize: "13px",
      marginTop: "8px",
      color: "#444",
    }}
  >
    Assigned: <strong>{task.assignedTo.name}</strong>
  </p>
)}

{task.dueDate && (
  <p
    style={{
      fontSize: "13px",
      marginTop: "8px",
      color: "#444",
    }}
  >
Due: {formatDate(task.dueDate)}  </p>
)}

{isOverdue && (
  <p
    style={{
      color: "red",
      fontWeight: "bold",
      marginTop: "6px",
      fontSize: "13px",
    }}
  >
    ⚠ Overdue
  </p>
)}
      </div>
    </div>
  );
}