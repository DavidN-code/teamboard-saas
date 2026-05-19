import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task._id, // 🔥 THIS is what connects drag system to this card
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "12px",
    background: "white",
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      <strong>{task.title}</strong>

      <p
        style={{
          fontSize: "14px",
          color: "#666",
          marginTop: "8px",
        }}
      >
        {task.description || "No description"}
      </p>
    </div>
  );
}