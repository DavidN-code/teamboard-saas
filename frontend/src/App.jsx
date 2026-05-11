import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register.jsx";
import LoginPage from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard.jsx";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 Protected Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        />
    </Routes>
  );
}

export default App;