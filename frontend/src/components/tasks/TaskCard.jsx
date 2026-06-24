import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e) => {
    if (isDragging) return;
    onClick(e);
  };

  return (
    <div ref={setNodeRef} style={style}>
      
      {/* Drag handle ONLY */}
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: "grab", paddingBottom: "6px" }}
      >
        ☰
      </div>

      {/* Click area */}
      <div onClick={handleClick}>

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

  <strong>{task.title}</strong>

        <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
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
      </div>
    </div>
  );
}