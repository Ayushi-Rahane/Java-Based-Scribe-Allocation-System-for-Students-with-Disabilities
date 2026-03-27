import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

// Mock data for development — replace with real API calls
const MOCK_VOLUNTEER = {
  id: "vol_001",
  fullName: "Aryan Mehta",
  email: "aryan.mehta@example.com",
  phone: "+91 98765 43210",
  dateOfBirth: "2000-05-14",
  city: "Mumbai",
  state: "Maharashtra",
  subjects: ["Mathematics", "Physics", "Computer Science"],
  languages: ["English", "Hindi", "Marathi"],
  availability: {
    Monday:    { morning: true,  afternoon: false, evening: true  },
    Tuesday:   { morning: false, afternoon: true,  evening: false },
    Wednesday: { morning: true,  afternoon: true,  evening: false },
    Thursday:  { morning: false, afternoon: false, evening: true  },
    Friday:    { morning: true,  afternoon: false, evening: false },
    Saturday:  { morning: true,  afternoon: true,  evening: true  },
    Sunday:    { morning: false, afternoon: false, evening: false },
  },
  totalSessions: 24,
  rating: 4.8,
  completedSessions: 22,
  badges: ["Top Contributor", "Math Expert", "Multilingual"],
  joinedDate: "2024-08-01",
  verified: true,
  certificatesEarned: 3,
  role: "volunteer",
};

const MOCK_INCOMING = [
  {
    id: "req_101",
    studentName: "Priya Sharma",
    disability: "Visual Impairment",
    subject: "Calculus",
    examDate: "2025-11-12",
    examTime: "10:00 AM",
    duration: "3 hours",
    language: "English",
    city: "Mumbai",
    state: "Maharashtra",
    notes: "Need assistance with handwriting during exam. I'll provide syllabus beforehand.",
    matchScore: 92,
    status: "pending",
    materials: ["calculus_syllabus.pdf"],
    postedAt: "2025-11-08T09:30:00",
  },
  {
    id: "req_102",
    studentName: "Rohan Desai",
    disability: "Motor Disability",
    subject: "Physics",
    examDate: "2025-11-14",
    examTime: "2:00 PM",
    duration: "2.5 hours",
    language: "Marathi",
    city: "Mumbai",
    state: "Maharashtra",
    notes: "Requires scribe who can write in both English and Marathi.",
    matchScore: 85,
    status: "pending",
    materials: [],
    postedAt: "2025-11-08T11:15:00",
  },
  {
    id: "req_103",
    studentName: "Sneha Kulkarni",
    disability: "Learning Disability",
    subject: "Computer Science",
    examDate: "2025-11-16",
    examTime: "9:00 AM",
    duration: "2 hours",
    language: "Hindi",
    city: "Mumbai",
    state: "Maharashtra",
    notes: "Prefers clear and slow dictation during exam.",
    matchScore: 78,
    status: "pending",
    materials: ["cs_notes.pdf", "past_paper.pdf"],
    postedAt: "2025-11-07T14:45:00",
  },
];

const MOCK_ACTIVE = [
  {
    id: "req_099",
    studentName: "Anjali Rao",
    disability: "Visual Impairment",
    subject: "English Literature",
    examDate: "2025-11-10",
    examTime: "11:00 AM",
    duration: "3 hours",
    language: "English",
    city: "Mumbai",
    state: "Maharashtra",
    notes: "Bring your own pen and notebook. Exam hall details shared via email.",
    matchScore: 95,
    status: "accepted",
    materials: ["eng_lit_ref.pdf"],
    acceptedAt: "2025-11-06T10:00:00",
  },
];

const MOCK_HISTORY = [
  {
    id: "req_080",
    studentName: "Kunal Patil",
    subject: "Biology",
    examDate: "2025-10-20",
    duration: "3 hours",
    status: "completed",
    rating: 5,
    review: "Aryan was extremely patient and professional. Highly recommend!",
  },
  {
    id: "req_075",
    studentName: "Meera Joshi",
    subject: "Mathematics",
    examDate: "2025-10-05",
    duration: "2.5 hours",
    status: "completed",
    rating: 5,
    review: "Excellent scribe, very clear handwriting.",
  },
  {
    id: "req_070",
    studentName: "Tejas Sawant",
    subject: "Physics",
    examDate: "2025-09-28",
    duration: "3 hours",
    status: "completed",
    rating: 4,
    review: "Good experience overall.",
  },
  {
    id: "req_065",
    studentName: "Divya Nair",
    subject: "Computer Science",
    examDate: "2025-09-15",
    duration: "2 hours",
    status: "completed",
    rating: 5,
    review: "Brilliant! Will request again.",
  },
];

const MOCK_NOTIFICATIONS = [
  { id: "n1", message: "New request matching your profile — Calculus exam on Nov 12", time: "2h ago", read: false, type: "request" },
  { id: "n2", message: "Anjali Rao's exam is tomorrow at 11:00 AM. Don't forget!", time: "5h ago", read: false, type: "reminder" },
  { id: "n3", message: "Kunal Patil left you a 5-star review. Excellent work!", time: "2d ago", read: true, type: "review" },
  { id: "n4", message: "You've earned the 'Top Contributor' badge. Keep going!", time: "5d ago", read: true, type: "badge" },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [incomingRequests, setIncomingRequests] = useState(MOCK_INCOMING);
  const [activeRequests, setActiveRequests] = useState(MOCK_ACTIVE);
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  useEffect(() => {
    // Simulate checking local session
    const saved = localStorage.getItem("sc_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role = "volunteer") => {
    // Mock login — replace with: POST /api/auth/login
    await new Promise((r) => setTimeout(r, 800));
    if (email && password) {
      const userObj = role === "student" 
        ? { id: "std_" + Date.now(), fullName: "Student User", email, role: "student" }
        : { ...MOCK_VOLUNTEER, email, role: "volunteer" };
      
      setUser(userObj);
      localStorage.setItem("sc_user", JSON.stringify(userObj));
      return { success: true };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const register = async (data) => {
    // Mock register — replace with: POST /api/volunteer/register
    await new Promise((r) => setTimeout(r, 1000));
    const role = data.role || "volunteer";
    const userObj = role === "volunteer" 
      ? { ...MOCK_VOLUNTEER, ...data, id: "vol_" + Date.now(), role: "volunteer" }
      : { id: "std_" + Date.now(), ...data, role: "student" };
    
    setUser(userObj);
    localStorage.setItem("sc_user", JSON.stringify(userObj));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sc_user");
  };

  const updateProfile = async (data) => {
    // Replace with: PUT /api/volunteer/profile
    await new Promise((r) => setTimeout(r, 600));
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("sc_volunteer", JSON.stringify(updated));
    return { success: true };
  };

  const acceptRequest = async (requestId) => {
    // Replace with: POST /api/requests/{id}/accept
    await new Promise((r) => setTimeout(r, 500));
    const req = incomingRequests.find((r) => r.id === requestId);
    if (req) {
      const accepted = { ...req, status: "accepted", acceptedAt: new Date().toISOString() };
      setActiveRequests((prev) => [accepted, ...prev]);
      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    }
    return { success: true };
  };

  const declineRequest = async (requestId) => {
    // Replace with: POST /api/requests/{id}/decline
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
        logout,
        register,
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
