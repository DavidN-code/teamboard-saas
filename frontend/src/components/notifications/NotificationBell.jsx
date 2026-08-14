import { useEffect, useRef, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../api/notifications";
import { useAuth } from "../../context/useAuth";
import pusher from "../../services/pusher";

export default function NotificationBell({ onOpenTask }) {
    const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const notificationRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
  
    if (!user?.id) {
      return () => {
        cancelled = true;
      };
    }
  
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
  
        if (!cancelled) {
          setNotifications(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load notifications", err);
        }
      }
    };
  
    fetchNotifications();
  
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
  
    const channelName = `user-${user.id}`;
    const channel = pusher.subscribe(channelName);
  
    const handleNotificationCreated = (newNotification) => {
      setNotifications((prev) => {
        const exists = prev.some(
          (notification) => notification._id === newNotification._id
        );
  
        return exists ? prev : [newNotification, ...prev];
      });
    };
  
    channel.bind(
      "notification-created",
      handleNotificationCreated
    );
  
    return () => {
      channel.unbind(
        "notification-created",
        handleNotificationCreated
      );
    };
  }, [user?.id]);

  useEffect(() => {
    if (!open) return;
  
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
  
    document.addEventListener("pointerdown", handleOutsideClick);
  
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [open]);

  const visibleNotifications = user?.id
  ? notifications.filter(
      (notification) =>
        String(notification.userId) === String(user.id)
    )
  : [];

  const unreadCount = visibleNotifications.filter(
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
<div
  ref={notificationRef}
  style={{ position: "relative" }}
>      <button
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

          {visibleNotifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            visibleNotifications.map((notification) => (
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