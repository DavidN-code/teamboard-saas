import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [invitation, setInvitation] = useState(null);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: ""
  });
  const [message, setMessage] = useState("");
  const [invitationError, setInvitationError] = useState("");

  useEffect(() => {
    const validateInvitation = async () => {
      if (!token) return;
  
      try {
        setLoadingInvite(true);
  
        const res = await axios.get(
          `http://localhost:5050/api/invitations/token/${token}`
        );
  
        setInvitation(res.data);
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/api/auth/register", form);
      setMessage(`Success! User ID: ${res.data.userId}`);
    } catch (err) {
      console.error(err); // see the full error in browser console
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  if (invitationError) {
    return (
      <div
        style={{
          maxWidth: "500px",
          margin: "80px auto",
          textAlign: "center",
        }}
      >
        <h1>Invitation Unavailable</h1>
  
        <p>{invitationError}</p>
  
        <p>
          Please contact your organization administrator
          to request a new invitation.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Register</h1>
      {loadingInvite && <p>Validating invitation...</p>}

{invitation && (
  <div>
    <p>
      Invitation detected for:
      <strong> {invitation.email}</strong>
    </p>
  </div>
)}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" value={invitation ? invitation.email : form.email}
  onChange={handleChange}
  disabled={!!invitation} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <input name="organizationName" placeholder="Organization Name" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;