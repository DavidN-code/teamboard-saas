import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import PageLayout from "../components/layout/PageLayout";
import "./OrganizationMembers.css";

const OrganizationMembers = () => {
  const { user } = useAuth();

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

if (user?.role === "owner") {
  fetchInvitations();
}
}, [user]);
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

  const handleRoleChange = async (selectedUser, newRole) => {

    const confirmed = window.confirm(
      `Change ${selectedUser.name}'s role from ${selectedUser.role} to ${newRole}?`
    );
  
    if (!confirmed) {
      return;
    }
  
    try {
      const res = await api.put(`/users/${selectedUser._id}/role`, {
        role: newRole,
      });
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? res.data : user
        )
      );
  
    } catch (err) {
      console.error(
        err.response?.data?.message ||
        "Failed to update role"
      );
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

  const handleResendInvitation = async (invitationId) => {
    try {
      await api.put(`/invitations/${invitationId}/resend`);
  
      setInviteMessage("Invitation resent successfully");
  
    } catch (err) {
      console.error(
        err.response?.data?.message ||
        "Failed to resend invitation"
      );
    }
  };

  return (
    <PageLayout title="Organization Members">
      <div className="members-page">
  
        <section className="members-section">
          <div className="section-heading">
            <div>
              <h2>Members</h2>
              <p>
                Manage people in your organization and review their roles.
              </p>
            </div>
  
            <span className="member-count">
              {users.length} {users.length === 1 ? "member" : "members"}
            </span>
          </div>
  
          <div className="members-table-wrapper">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
  
                  {user?.role === "owner" && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>
  
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td data-label="Name">
                      <strong>{u.name}</strong>
                    </td>
  
                    <td data-label="Email">
                      {u.email}
                    </td>
  
                    <td data-label="Role">
                      {u.role === "owner" ? (
                        <span
                          className={`member-role-badge ${getRoleBadgeClass(
                            u.role
                          )}`}
                        >
                          👑 Owner
                        </span>
                      ) : user?.role === "owner" ? (
                        <select
                          className="role-select"
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u, e.target.value)
                          }
                        >
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                        </select>
                      ) : (
                        <span
                          className={`member-role-badge ${getRoleBadgeClass(
                            u.role
                          )}`}
                        >
                          {u.role}
                        </span>
                      )}
                    </td>
  
                    {user?.role === "owner" && (
                      <td data-label="Actions">
                        {user._id !== u._id ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u._id)}
                            className="danger-button"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="muted-text">
                            Current user
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
  
        {user?.role === "owner" && (
          <>
            <section className="members-section">
              <div className="section-heading">
                <div>
                  <h2>Pending Invitations</h2>
                  <p>
                    Invitations that have been sent but not yet accepted.
                  </p>
                </div>
  
                <span className="member-count">
                  {invitations.length}
                </span>
              </div>
  
              {invitations.length === 0 ? (
                <div className="empty-members-state">
                  No pending invitations.
                </div>
              ) : (
                <div className="members-table-wrapper">
                  <table className="members-table invitations-table">
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
                          <td data-label="Email">
                            {invite.email}
                          </td>
  
                          <td data-label="Invited By">
                            {invite.invitedBy?.name ||
                              invite.invitedBy?.email ||
                              "Unknown"}
                          </td>
  
                          <td data-label="Created">
                            {new Date(
                              invite.createdAt
                            ).toLocaleDateString()}
                          </td>
  
                          <td data-label="Actions">
                            <div className="member-actions">
                              <button
                                type="button"
                                onClick={() =>
                                  handleResendInvitation(
                                    invite._id
                                  )
                                }
                                className="secondary-button"
                              >
                                Resend
                              </button>
  
                              <button
                                type="button"
                                onClick={() =>
                                  handleRevokeInvitation(
                                    invite._id
                                  )
                                }
                                className="danger-button"
                              >
                                Revoke
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
  
            <section className="members-section invite-section">
              <div className="section-heading">
                <div>
                  <h2>Invite User</h2>
                  <p>
                    Send an invitation to join this organization.
                  </p>
                </div>
              </div>
  
              {inviteMessage && (
                <p className="success-message">
                  {inviteMessage}
                </p>
              )}
  
              {inviteError && (
                <p className="error-message">
                  {inviteError}
                </p>
              )}
  
              <form
                className="invite-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleInviteUser();
                }}
              >
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) =>
                    setInviteEmail(e.target.value)
                  }
                  required
                />
  
                <button
                  type="submit"
                  className="primary-button"
                >
                  Send Invite
                </button>
              </form>
            </section>
          </>
        )}
  
      </div>
    </PageLayout>
  );
};

export default OrganizationMembers;