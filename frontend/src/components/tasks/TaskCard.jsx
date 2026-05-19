export default function TaskCard({
    task,
    onClick,
  }) {
    return (
      <div
        onClick={onClick}
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "12px",
          cursor: "pointer",
          background: "white",
        }}
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