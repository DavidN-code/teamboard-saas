import { useEffect, useState } from "react";
import api from "../api/axios";
import "./AuditLogs.css";

const formatAction = (action) => {
  const actionMap = {
    CREATE_TASK: "Created Task",
    UPDATE_TASK: "Updated Task",
    DELETE_TASK: "Deleted Task",
    CREATE_BOARD: "Created Board",
    UPDATE_BOARD: "Updated Board",
    DELETE_BOARD: "Deleted Board",
  };

  return actionMap[action] || action;
};

const getActionClass = (action) => {
  if (action.startsWith("CREATE")) {
    return "action-create";
  }

  if (action.startsWith("UPDATE")) {
    return "action-update";
  }

  if (action.startsWith("DELETE")) {
    return "action-delete";
  }

  return "";
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/audit-logs");
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p>Loading audit logs...</p>;

  return (
    <div className="audit-page">
      <div className="audit-header">
  <h1>Audit Logs</h1>
  <p>Track activity across your organization.</p>
</div>

      {logs.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        <table className="audit-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.userId?.name || "Unknown"}</td>
                <td>
            <span
              className={`action-badge ${getActionClass(log.action)}`}
            >
              {formatAction(log.action)}
            </span>
          </td>
                <td>{log.resourceType}</td>
                <td className="timestamp">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLogs;