import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const OrganizationMembers = () => {
  const [users, setUsers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
const [inviteError, setInviteError] = useState("");
const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    const fetchInvitations = async () => {
      try {
        const res = await api.get("/invitations");
        setInvitations(res.data);
      } catch (err) {
        console.error("Failed to load invitations:", err);
      }
    };

    fetchUsers();
    fetchInvitations();
  }, []);

  const { user } = useAuth();

  console.log("Current User:", user);
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/users/${userId}/role`, {
        role: newRole,
      });
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? res.data : user
        )
      );
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleInviteUser = async () => {
    try {
      setInviteError("");
    setInviteMessage("");

      await api.post("/invitations", {
        email: inviteEmail,
      });
      
      setInviteMessage("Invitation sent");
      setInviteEmail("");

    } catch (err) {
      setInviteMessage("");

    setInviteError(
      err.response?.data?.message || "Failed to send invitation"
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
  
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleRevokeInvitation = async (invitationId) => {
    try {
      await api.delete(`/invitations/${invitationId}`);
  
      setInvitations((prev) =>
        prev.filter((invite) => invite._id !== invitationId)
      );
    } catch (err) {
      console.error(
        err.response?.data?.message ||
        "Failed to revoke invitation"
      );
    }
  };

  return (
    <div>
      <h1>Organization Members</h1>
      
      <div style={{ marginBottom: "20px" }}>
  <h3>Invite User</h3>

  {inviteMessage && (
  <p style={{ color: "green" }}>{inviteMessage}</p>
)}

{inviteError && (
  <p style={{ color: "red" }}>{inviteError}</p>
)}

<form
  onSubmit={(e) => {
    e.preventDefault();
    handleInviteUser();
  }}
>
  <input
    type="email"
    placeholder="email@example.com"
    value={inviteEmail}
    onChange={(e) => setInviteEmail(e.target.value)}
  />

  <button type="submit">
    Send Invite
  </button>
</form>
</div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
  {user?.role === "owner" ? (
    <select
    value={u.role}
    onChange={(e) =>
      handleRoleChange(u._id, e.target.value)
    }
  >
      <option value="owner">Owner</option>
      <option value="admin">Admin</option>
      <option value="member">Member</option>
    </select>
  ) : (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeClass(
        u.role
      )}`}
    >
      {u.role.toUpperCase()}
    </span>
  )}
</td>
<td>
  {user?.role === "owner" && (user?.id || user?._id) !== u._id && (
    <button
      onClick={() => handleDeleteUser(u._id)}
      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
    >
      Remove
    </button>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Pending Invitations</h3>
      <table>
  <thead>
    <tr>
      <th>Email</th>
      <th>Invited By</th>
      <th>Created</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {invitations.map((invite) => (
      <tr key={invite._id}>
        <td>{invite.email}</td>

        <td>
          {invite.invitedBy?.name || invite.invitedBy?.email || "Unknown"}
        </td>

        <td>
          {new Date(invite.createdAt).toLocaleDateString()}
        </td>

        <td>
          <button
            onClick={() => handleRevokeInvitation(invite._id)}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Revoke
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default OrganizationMembers;