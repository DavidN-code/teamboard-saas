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
  if (action.startsWith("CREATE")) return "action-create";
  if (action.startsWith("UPDATE")) return "action-update";
  if (action.startsWith("DELETE")) return "action-delete";
  return "";
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionFilter, setActionFilter] = useState("");
  const [resourceFilter, setResourceFilter] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [totalPages, setTotalPages] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [actionFilter, resourceFilter]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);

        const res = await api.get("/audit-logs", {
          params: {
            action: actionFilter || undefined,
            resourceType: resourceFilter || undefined,
            page,
            limit,
          },
        });

        setLogs(res.data.logs);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [actionFilter, resourceFilter, page]);

  return (
    <div className="audit-page">

      {loading && <p style={{ marginBottom: "10px" }}>Loading...</p>}

      <div className="audit-header">
        <h1>Audit Logs</h1>
        <p>Track activity across your organization.</p>
      </div>

      <div className="filter-bar">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="">All Actions</option>
          <option value="CREATE_TASK">Created Task</option>
          <option value="UPDATE_TASK">Updated Task</option>
          <option value="DELETE_TASK">Deleted Task</option>
        </select>

        <select
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
        >
          <option value="">All Resources</option>
          <option value="Task">Task</option>
          <option value="Board">Board</option>
        </select>
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

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuditLogs;