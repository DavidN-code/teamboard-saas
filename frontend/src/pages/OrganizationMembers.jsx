import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const OrganizationMembers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    fetchUsers();
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
      console.error("Failed to update role:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
  
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <div>
      <h1>Organization Members</h1>
      
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
  {user?.role === "owner" && user._id !== u._id && (
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
    </div>
  );
};

export default OrganizationMembers;