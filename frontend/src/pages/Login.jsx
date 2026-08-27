import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const accountCreated = location.state?.accountCreated;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setMessage("");

      const res = await api.post("/auth/login", form);

      const { token, user } = res.data;

      localStorage.setItem("token", token);

      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">T</div>

          <div>
            <div className="auth-brand-name">TeamBoard</div>
            <div className="auth-brand-tagline">
              Organize. Collaborate. Get things done.
            </div>
          </div>
        </div>

        <div className="auth-heading">
  <h1>
    {accountCreated
      ? "Welcome to TeamBoard"
      : "Welcome back"}
  </h1>

  <p>
    {accountCreated
      ? "Your account is ready. Sign in to continue."
      : "Sign in to continue to your workspace."}
  </p>
</div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-field">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {message && (
            <div
              className="auth-error"
              role="alert"
            >
              {message}
            </div>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-footer">
          <span>New to TeamBoard?</span>{" "}
          <Link to="/register">Create an account</Link>
        </div>
      </section>
    </main>
  );
};

export default Login;