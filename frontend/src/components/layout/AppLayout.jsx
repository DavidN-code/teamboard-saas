import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/useAuth";

export default function AppLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 768px)").matches
  );

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
      {!isMobile && <Sidebar />}

      {isMobile && (
        <>
          {isSidebarOpen && (
            <div
              onClick={closeSidebar}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: "rgba(15, 23, 42, 0.45)",
              }}
            />
          )}

          <Sidebar
            isMobile
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />

          <button
            type="button"
            onClick={openSidebar}
            aria-label="Open navigation"
            style={{
              position: "fixed",
              top: "16px",
              left: "16px",
              zIndex: 900,
              width: "42px",
              height: "42px",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#374151",
              fontSize: "20px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
            }}
          >
            ☰
          </button>
        </>
      )}

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    padding: isMobile ? "16px 16px 0 70px" : "16px 20px 0",
  }}
>
  <button
    type="button"
    onClick={() => {
      logout();
      navigate("/login");
    }}
  >
    Logout
  </button>
</div>
        <Outlet context={{ isMobile }} />
      </div>
    </div>
  );
}