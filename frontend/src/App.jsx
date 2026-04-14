import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PageLoader } from "./components/UI";
import Sidebar from "./components/Sidebar";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import StudentRegisterPage from "./pages/auth/StudentRegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import RequestScribe from "./pages/student/RequestScribe";
import ActiveRequests from "./pages/student/ActiveRequests";
import Availability from "./pages/student/Availability";
import History from "./pages/student/History";
import Profile from "./pages/student/Profile";
import DashboardPage from "./pages/volunteer/DashboardPage";
import RequestsPage from "./pages/volunteer/RequestsPage";
import ActivePage from "./pages/volunteer/ActivePage";
import RatingsPage from "./pages/volunteer/RatingsPage";
import ProfilePage from "./pages/volunteer/ProfilePage";
import NotificationsPage from "./pages/volunteer/NotificationsPage";

// Protected layout wrapper
function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden page-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

// Guard: redirect to login if not authenticated
function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Guard: redirect to dashboard if already logged in
function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

// Redirects based on role
function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "student") return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/volunteer/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><StudentRegisterPage /></PublicOnly>} />
      <Route path="/register/volunteer" element={<PublicOnly><RegisterPage /></PublicOnly>} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardRedirect />
          </Protected>
        }
      />
      <Route
        path="/student/dashboard"
        element={
          <Protected>
            <StudentDashboard />
          </Protected>
        }
      />
      <Route
        path="/student/request"
        element={
          <Protected>
            <RequestScribe />
          </Protected>
        }
      />
      <Route
        path="/student/active"
        element={
          <Protected>
            <ActiveRequests />
          </Protected>
        }
      />
      <Route
        path="/student/availability"
        element={
          <Protected>
            <Availability />
          </Protected>
        }
      />
      <Route
        path="/student/history"
        element={
          <Protected>
            <History />
          </Protected>
        }
      />
      <Route
        path="/student/profile"
        element={
          <Protected>
            <Profile />
          </Protected>
        }
      />
      <Route
        path="/volunteer/dashboard"
        element={
          <Protected>
            <AppLayout><DashboardPage /></AppLayout>
          </Protected>
        }
      />
      <Route
        path="/requests"
        element={
          <Protected>
            <AppLayout><RequestsPage /></AppLayout>
          </Protected>
        }
      />
      <Route
        path="/active"
        element={
          <Protected>
            <AppLayout><ActivePage /></AppLayout>
          </Protected>
        }
      />

      <Route
        path="/ratings"
        element={
          <Protected>
            <AppLayout><RatingsPage /></AppLayout>
          </Protected>
        }
      />
      <Route
        path="/profile"
        element={
          <Protected>
            <AppLayout><ProfilePage /></AppLayout>
          </Protected>
        }
      />
      <Route
        path="/notifications"
        element={
          <Protected>
            <AppLayout><NotificationsPage /></AppLayout>
          </Protected>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
