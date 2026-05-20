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
        <strong>{task.title}</strong>

        <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
          {task.description || "No description"}
        </p>
      </div>
    </div>
  );
}