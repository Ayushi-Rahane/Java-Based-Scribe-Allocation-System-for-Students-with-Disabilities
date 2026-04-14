import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

// Mock data (UNCHANGED)
const MOCK_VOLUNTEER = { /* same as your code */ };
const MOCK_INCOMING = [ /* same as your code */ ];
const MOCK_ACTIVE = [ /* same as your code */ ];
const MOCK_HISTORY = [ /* same as your code */ ];
const MOCK_NOTIFICATIONS = [ /* same as your code */ ];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [incomingRequests, setIncomingRequests] = useState(MOCK_INCOMING);
  const [activeRequests, setActiveRequests] = useState(MOCK_ACTIVE);
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  useEffect(() => {
    const saved = localStorage.getItem("sc_user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  // ---------------- LOGIN FIXED ----------------
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
    await new Promise((r) => setTimeout(r, 600));
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("sc_user", JSON.stringify(updated));
    return { success: true };
  };

  const acceptRequest = async (requestId) => {
    await new Promise((r) => setTimeout(r, 500));
    const req = incomingRequests.find((r) => r.id === requestId);
    if (req) {
      const accepted = {
        ...req,
        status: "accepted",
        acceptedAt: new Date().toISOString(),
      };
      setActiveRequests((prev) => [accepted, ...prev]);
      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    }
    return { success: true };
  };

  const declineRequest = async (requestId) => {
    await new Promise((r) => setTimeout(r, 400));
    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    return { success: true };
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
        incomingRequests,
        activeRequests,
        history,
        notifications,
        unreadCount,
        acceptRequest,
        declineRequest,
        markNotificationRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};