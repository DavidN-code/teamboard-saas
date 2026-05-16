export default function TaskDetailsModal({
    task,
    isOpen,
    onClose,
  }) {
    if (!isOpen || !task) return null;
  
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            width: "500px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2>{task.title}</h2>
  
            <button onClick={onClose}>
              X
            </button>
          </div>
  
          <div style={{ marginBottom: "16px" }}>
            <strong>Status:</strong>
            <p>{task.status}</p>
          </div>
  
          <div>
            <strong>Description:</strong>
            <p>
              {task.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>
    );
  }