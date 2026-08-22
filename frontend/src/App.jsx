import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import LoginPage from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";
import OrganizationMembers from "./pages/OrganizationMembers.jsx";
import MyTasks from "./pages/MyTasks";
import AppLayout from "./components/layout/AppLayout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/my-tasks" element={<MyTasks />} />

        <Route
          path="/members"
          element={
            <ProtectedRoute allowedRoles={["owner", "admin"]}>
              <OrganizationMembers />
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
      </Route>
    </Routes>
  );
}

export default App;