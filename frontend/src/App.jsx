import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext";


const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Dashboard (Protected)</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

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