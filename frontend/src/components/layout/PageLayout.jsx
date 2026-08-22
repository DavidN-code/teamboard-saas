import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function PageLayout({ children, title }) {
  const { user } = useAuth();
  const { isMobile } = useOutletContext();

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
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
          paddingLeft: isMobile ? "52px" : 0,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: isMobile ? "22px" : "30px",
            color: "#111827",
          }}
        >
          {title}
        </h1>

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

      {children}
    </main>
  );
}