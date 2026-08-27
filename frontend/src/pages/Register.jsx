import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";import api from "../api/axios";
import "./Login.css";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [invitation, setInvitation] = useState(null);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
  });

  const [message, setMessage] = useState("");
  const [invitationError, setInvitationError] = useState("");

  useEffect(() => {
    const validateInvitation = async () => {
      if (!token) return;

      try {
        setLoadingInvite(true);
        setInvitationError("");

        const res = await api.get(
          `/invitations/token/${token}`
        );

        setInvitation(res.data);

        setForm((prev) => ({
          ...prev,
          email: res.data.email,
        }));
      } catch (err) {
        console.error(err);

        setInvitationError(
          err.response?.data?.message ||
            "Unable to validate invitation."
        );
      } finally {
        setLoadingInvite(false);
      }
    };

    validateInvitation();
  }, [token]);

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

      await api.post("/auth/register", {
        ...form,
        invitationToken: token || undefined,
      });
      
      setMessage(
        "Account created successfully. Redirecting to sign in..."
      );
      
      setTimeout(() => {
        navigate("/login", {
          state: { accountCreated: true },
        });
      }, 1200);
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.message ||
          "Unable to create your account."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (invitationError) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-brand">
            <div className="auth-logo">T</div>

            <div>
              <div className="auth-brand-name">
                TeamBoard
              </div>
              <div className="auth-brand-tagline">
                Organize. Collaborate. Get things done.
              </div>
            </div>
          </div>

          <div className="auth-heading">
            <h1>Invitation unavailable</h1>
            <p>
              This invitation can't be used to create an
              account.
            </p>
          </div>

          <div className="auth-error" role="alert">
            {invitationError}
          </div>

          <p className="auth-help-text">
            Please contact your organization administrator
            to request a new invitation.
          </p>

          <div className="auth-footer">
            <Link to="/login">Return to sign in</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">T</div>

          <div>
            <div className="auth-brand-name">
              TeamBoard
            </div>
            <div className="auth-brand-tagline">
              Organize. Collaborate. Get things done.
            </div>
          </div>
        </div>

        <div className="auth-heading">
          <h1>
            {invitation
              ? "Join your team"
              : "Create your account"}
          </h1>

          <p>
            {invitation
              ? "Complete your account to join your TeamBoard workspace."
              : "Set up your workspace and start organizing your team's work."}
          </p>
        </div>

        {loadingInvite && (
          <div className="auth-info">
            Validating invitation...
          </div>
        )}

        {invitation && !loadingInvite && (
          <div className="auth-invitation">
            <span className="auth-invitation-label">
              Invitation for
            </span>

            <strong>{invitation.email}</strong>
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-field">
            <label htmlFor="name">Full name</label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={!!invitation}
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
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
            />
            <p className="auth-field-hint">
  Use 8–72 characters.
</p>
          </div>

          {!invitation && (
            <div className="auth-field">
              <label htmlFor="organizationName">
                Organization name
              </label>

              <input
                id="organizationName"
                name="organizationName"
                type="text"
                placeholder="Your organization"
                value={form.organizationName}
                onChange={handleChange}
                autoComplete="organization"
                required
              />
            </div>
          )}

          {message && (
            <div
              className={
                message.startsWith("Account created")
                  ? "auth-success"
                  : "auth-error"
              }
              role="status"
            >
              {message}
            </div>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={isSubmitting || loadingInvite}
          >
            {isSubmitting
              ? "Creating account..."
              : invitation
                ? "Join TeamBoard"
                : "Create account"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>{" "}
          <Link to="/login">Sign in</Link>
        </div>
      </section>
    </main>
  );
};

export default Register;