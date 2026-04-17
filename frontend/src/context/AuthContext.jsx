import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

// Removed unused MOCK data.

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeRequests, setActiveRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("sc_user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  // ---------------- LOGIN----------------
  const login = async (email, password, role = "student") => {
    try {
      const url =
        role === "volunteer"
          ? "http://localhost:8080/api/volunteers/login"
          : "http://localhost:8080/api/students/login";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        // Flatten the nested student/volunteer object if present
        const userData = data.student || data.volunteer || data;
        const userObj = {
          ...userData,
          id: userData.id || data.studentId || data.volunteerId,
          token: data.token,
          role: role.toLowerCase()
        };
        setUser(userObj);
        localStorage.setItem("sc_user", JSON.stringify(userObj));
        return { success: true };
      }

      return { success: false, error: data.error || "Login failed" };
    } catch (err) {
      return { success: false, error: "Server connection error" };
    }
  };

  // ---------------- REGISTER FIXED ----------------
  const register = async (data) => {
    try {
      const url =
        data.role === "volunteer"
          ? "http://localhost:8080/api/volunteers/register"
          : "http://localhost:8080/api/students/register";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (response.ok) {
        // Flatten nested object if present
        const userData = resData.student || resData.volunteer || resData;
        const userObj = {
          ...userData,
          id: userData.id || resData.studentId || resData.volunteerId,
          token: resData.token,
          role: data.role.toLowerCase()
        };
        setUser(userObj);
        localStorage.setItem("sc_user", JSON.stringify(userObj));
        return { success: true };
      }

      return {
        success: false,
        error: resData.error || "Registration failed",
      };
    } catch (err) {
      return { success: false, error: "Server connection error" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sc_user");
  };

  const updateProfile = async (data) => {
    try {
      if (!user) return { success: false, error: "Not logged in" };
      let updatedUser = { ...user };
      const role = user.role.toLowerCase();

      if (role === "volunteer") {
        // Send main profile data
        const res = await fetch(`http://localhost:8080/api/volunteers/${user.id}/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update volunteer profile");

        let serverData = await res.json();

        // If availability is included, send to availability endpoint
        if (data.availability) {
          const availRes = await fetch(`http://localhost:8080/api/volunteers/${user.id}/availability`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.availability)
          });
          if (availRes.ok) {
            const availData = await availRes.json();
            serverData.availability = availData.availability || data.availability;
          }
        }

        // Refetch complete profile to ensure fresh data
        const freshRes = await fetch(`http://localhost:8080/api/volunteers/${user.id}/profile`);
        if (freshRes.ok) {
          serverData = await freshRes.json();
        }

        updatedUser = { ...updatedUser, ...serverData, id: user.id || serverData.id, token: user.token, role: "volunteer" };

      } else {
        // Student update
        const res = await fetch(`http://localhost:8080/api/students/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update student profile");
        const serverData = await res.json();
        updatedUser = { ...updatedUser, ...serverData, id: user.id || serverData.id, token: user.token, role: "student" };
      }

      setUser(updatedUser);
      localStorage.setItem("sc_user", JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: "Update failed: " + err.message };
    }
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        activeRequests,
        history,
        notifications,
        unreadCount,
        markNotificationRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};