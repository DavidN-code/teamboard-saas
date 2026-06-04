import { useEffect, useState } from "react";
import api from "../api/axios";

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

  return (
    <div>
      <h1>Organization Members</h1>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
              <span
  className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeClass(
    u.role
  )}`}
>
  {u.role.toUpperCase()}
</span>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizationMembers;