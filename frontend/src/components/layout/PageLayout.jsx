import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";import { useAuth } from "../../context/useAuth";
import NotificationBell from "../notifications/NotificationBell";

export default function PageLayout({ children, title }) {
  const { user } = useAuth();
  const { isMobile } = useOutletContext();
  const navigate = useNavigate();

const handleOpenNotificationTask = async (taskId) => {
  navigate("/dashboard", {
    state: {
      notificationTaskId: taskId,
    },
  });

  return { success: true };
};

  return (
    <main
      style={{
        width: "100%",
        minWidth: 0,
        padding: isMobile ? "16px" : "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: isMobile ? "14px" : "16px",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            margin: isMobile ? "0 0 0 52px" : 0,
            fontSize: isMobile ? "22px" : "30px",
            color: "#111827",
          }}
        >
          {title}
        </h1>
        <div
  style={{
    display: "flex",
    gap: "12px",
    alignItems: "center",
    justifyContent: isMobile ? "flex-end" : "initial",
    marginLeft: isMobile ? "52px" : 0,
    flexWrap: "wrap",
  }}
>
<NotificationBell
  onOpenTask={handleOpenNotificationTask}
/>
  {user && (
    <div
      style={{
        fontSize: "14px",
        color: "#6b7280",
        whiteSpace: "nowrap",
      }}
    >
      <strong style={{ color: "#374151" }}>
        {user.name}
      </strong>
      {" · "}
      {user.role
        ? user.role.charAt(0).toUpperCase() +
          user.role.slice(1)
        : ""}
    </div>
  )}
</div>
      </div>

      {children}
    </main>
  );
}