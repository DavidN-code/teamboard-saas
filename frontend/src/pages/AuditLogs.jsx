import { useEffect, useState } from "react";
import api from "../api/axios";
import "./AuditLogs.css";
import PageLayout from "../components/layout/PageLayout";

const formatAction = (action) => {
  const actionMap = {
    CREATE_TASK: "Created Task",
    UPDATE_TASK: "Updated Task",
    DELETE_TASK: "Deleted Task",

    CREATE_COMMENT: "Created Comment",
    UPDATE_COMMENT: "Updated Comment",
    DELETE_COMMENT: "Deleted Comment",

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

const SkeletonRow = () => (
  <tr className="skeleton-row">
    <td><div className="skeleton skeleton-text"></div></td>
    <td><div className="skeleton skeleton-text"></div></td>
    <td><div className="skeleton skeleton-text"></div></td>
    <td><div className="skeleton skeleton-text"></div></td>
  </tr>
);

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
    const fetchData = async () => {  
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
      } 
      catch (err) {
        console.error("Failed to load audit logs:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [actionFilter, resourceFilter, page]);

  const getPageNumbers = () => {
    const pages = [];
  
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
  
      return pages;
    }
  
    pages.push(1);
  
    if (page > 4) {
      pages.push("start-ellipsis");
    }
  
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
  
    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }
  
    if (page < totalPages - 3) {
      pages.push("end-ellipsis");
    }
  
    pages.push(totalPages);
  
    return pages;
  };

  return (
    <PageLayout title="Audit Logs">
      <div className="audit-page">
  
      {loading && logs.length === 0 && (
        <p style={{ marginBottom: "10px" }}>Loading...</p>
      )}
  
  <div className="audit-header">
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
  
      {/* EMPTY STATE */}
      {!loading && logs.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        <>
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
            {loading && logs.length === 0 ? (
  [...Array(6)].map((_, i) => (
    <SkeletonRow key={i} />
  ))
) : (
  logs.map((log) => (
                  <tr key={log._id}>
                    <td>{log.userId?.name || "Unknown"}</td>
  
                    <td>
                      <span className={`action-badge ${getActionClass(log.action)}`}>
                        {formatAction(log.action)}
                      </span>
                    </td>
  
                    <td>{log.resourceType}</td>
  
                    <td className="timestamp">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
  
  <div className="pagination">
  <button
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
  >
    Previous
  </button>

  {getPageNumbers().map((item) => {
    if (
      item === "start-ellipsis" ||
      item === "end-ellipsis"
    ) {
      return (
        <span key={item}>
          …
        </span>
      );
    }

    return (
      <button
        key={item}
        type="button"
        onClick={() => setPage(item)}
        aria-current={page === item ? "page" : undefined}
        style={{
          fontWeight: page === item ? "700" : "400",
          background: page === item ? "#e5e7eb" : undefined,
        }}
      >
        {item}
      </button>
    );
  })}

  <button
    disabled={page === totalPages}
    onClick={() => setPage((p) => p + 1)}
  >
    Next
  </button>

  <span>
    Page {page} of {totalPages}
  </span>
</div>
    </div>
    </PageLayout>
  );
};

export default AuditLogs;