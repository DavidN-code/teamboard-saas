import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import LoginPage from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";
import OrganizationMembers from "./pages/OrganizationMembers.jsx";
import MyTasks from "./pages/MyTasks";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/members" element={<OrganizationMembers />} />
      <Route path="/my-tasks" element={<MyTasks />} />

      {/* 🔐 Protected Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        />

      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute allowedRoles={["owner", "admin"]}>
            <AuditLogs />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;