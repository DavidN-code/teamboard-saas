import { useEffect, useRef, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearReadNotifications,
} from "../../api/notifications";
import { useAuth } from "../../context/useAuth";
import pusher from "../../services/pusher";

export default function NotificationBell({ onOpenTask }) {
    const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [notificationError, setNotificationError] = useState(null);

  const [mobileMenuTop, setMobileMenuTop] = useState(0);
  const notificationRef = useRef(null);
  const notificationButtonRef = useRef(null);
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

    setNotificationError(null);

    if (notification.resourceId) {
      const result = await onOpenTask(notification.resourceId);

      if (result?.success) {
        setOpen(false);
      } else {
        setNotificationError({
          notificationId: notification._id,
          message:
            result?.message ||
            "Unable to open this task. Please try again.",
        });
      }
    }
  } catch (err) {
    console.error(err);

    setNotificationError({
      notificationId: notification._id,
      message: "Unable to open this notification. Please try again.",
    });
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

  const handleClearRead = async () => {
    try {
      await clearReadNotifications();
  
      setNotifications((prev) =>
        prev.filter((notification) => !notification.read)
      );
  
      setNotificationError(null);
    } catch (err) {
      console.error("Failed to clear read notifications", err);
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
  ref={notificationButtonRef}
  onClick={() => {
    if (!open && notificationButtonRef.current) {
      const rect =
        notificationButtonRef.current.getBoundingClientRect();
  
      setMobileMenuTop(rect.bottom + 8);
    }
  
    setOpen((current) => !current);
  }}  style={{
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  }}
>
  🔔 {unreadCount}
</button>

      {open && (
        <div
        style={{
          position:
            window.innerWidth <= 768
              ? "fixed"
              : "absolute",
        
          top:
            window.innerWidth <= 768
              ? `${mobileMenuTop}px`
              : "40px",
        
          right:
            window.innerWidth <= 768
              ? "16px"
              : 0,
        
          left:
            window.innerWidth <= 768
              ? "16px"
              : "auto",
        
          width:
            window.innerWidth <= 768
              ? "auto"
              : "320px",
        
          maxWidth:
            window.innerWidth <= 768
              ? "none"
              : "320px",

              maxHeight: "70vh",
              overflowY: "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
        
          boxSizing: "border-box",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "12px",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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

  <div
  style={{
    display: "flex",
    gap: "8px",
    alignItems: "center",
  }}
>

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

  {visibleNotifications.some((notification) => notification.read) && (
    <button
      onClick={handleClearRead}
      style={{
        fontSize: "12px",
        cursor: "pointer",
      }}
    >
      Clear read
    </button>
  )}
</div>

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

  <div style={{ minWidth: 0, flex: 1 }}>
  <div
  style={{
    minWidth: 0,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    whiteSpace: "normal",
  }}
>
  {notification.message}
</div>

{notificationError?.notificationId === notification._id && (
  <div
    role="alert"
    style={{
      marginTop: "6px",
      padding: "6px 8px",
      background: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: "6px",
      color: "#b91c1c",
      fontSize: "12px",
      fontWeight: "500",
      lineHeight: "1.4",
    }}
  >
    {notificationError.message}
  </div>
)}

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