import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../api/notifications";

export default function NotificationBell({ onOpenTask }) {
    const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationRead(notification._id);
  
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id
            ? { ...n, read: true }
            : n
        )
      );
  
      if (notification.resourceId) {
        onOpenTask(notification.resourceId);
        setOpen(false);
      }
  
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
  
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );
  
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "TASK_ASSIGNED":
        return "📌";
  
      case "TASK_COMMENT":
        return "💬";
  
      case "UPDATE_TASK":
        return "🔄";
  
      case "CREATE_TASK":
        return "📝";
  
      case "DELETE_TASK":
        return "🗑️";
  
      default:
        return "🔔";
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
      >
        🔔 {unreadCount}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: 0,
            width: "320px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            zIndex: 1000,
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <h4>Notifications</h4>

  {unreadCount > 0 && (
    <button
      onClick={handleMarkAllRead}
      style={{
        fontSize: "12px",
        cursor: "pointer",
      }}
    >
      Mark all read
    </button>
  )}
</div>

          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() =>
                  handleNotificationClick(
                    notification
                  )
                }
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom:
                    "1px solid #eee",
                    background:
                    notification.read
                      ? "white"
                      : "#eff6ff",
                  
                  fontWeight:
                    notification.read
                      ? "normal"
                      : "600",
                  
                  borderRadius: "6px",
                }}
              >
                <div
  style={{
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
  }}
>
  <span>
    {getNotificationIcon(notification.type)}
  </span>

  <div>
    <div>
      {notification.message}
    </div>

    <small
      style={{
        color: "#666",
      }}
    >
      {new Date(
        notification.createdAt
      ).toLocaleString()}
    </small>
  </div>
</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}