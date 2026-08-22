import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function PageLayout({ children, title }) {
  const { user } = useAuth();

  const { isMobile } = useOutletContext();

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => sessionStorage.getItem("teamboard-sidebar-open") === "true"
  );
  
  const openSidebar = () => {
    sessionStorage.setItem("teamboard-sidebar-open", "true");
    setIsSidebarOpen(true);
  };
  
  const closeSidebar = () => {
    sessionStorage.setItem("teamboard-sidebar-open", "false");
    setIsSidebarOpen(false);
  };
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = (event) => {
      setIsMobile(event.matches);

      if (!event.matches) {
        closeSidebar();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >

      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: isMobile ? "16px" : "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              minWidth: 0,
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
          </div>

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
    </div>
  );
}