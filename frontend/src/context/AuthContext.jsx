import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import pusher from "../services/pusher";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "token") {
        setToken(event.newValue);
      }
  
      if (event.key === "user") {
        setUser(
          event.newValue
            ? JSON.parse(event.newValue)
            : null
        );
      }
    };
  
    window.addEventListener(
      "storage",
      handleStorageChange
    );
  
    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  useEffect(() => {
    if (!user?.organizationId || !user?.id) return;
  
    const channelName = `organization-${user.organizationId}`;
    const channel = pusher.subscribe(channelName);
  
    const handleRoleUpdated = ({ userId, role }) => {
      if (userId !== user.id) return;
  
      setUser((currentUser) => {
        if (!currentUser) return currentUser;
  
        const updatedUser = {
          ...currentUser,
          role,
        };
  
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
  
        return updatedUser;
      });
    };
  
    channel.bind("user-role-updated", handleRoleUpdated);
  
    return () => {
      channel.unbind(
        "user-role-updated",
        handleRoleUpdated
      );
    };
  }, [user?.organizationId, user?.id]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // Clear previous user's board selection
  localStorage.removeItem("activeBoard");
  
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");  
  
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};