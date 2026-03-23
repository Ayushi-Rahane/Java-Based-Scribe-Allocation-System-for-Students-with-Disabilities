import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PageLoader } from "./components/UI";
import Sidebar from "./components/Sidebar";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RequestsPage from "./pages/RequestsPage";
import ActivePage from "./pages/ActivePage";
import HistoryPage from "./pages/HistoryPage";
import RatingsPage from "./pages/RatingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";

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

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />

      {/* Protected */}
      <Route
        path="/dashboard"
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
        path="/history"
        element={
          <Protected>
            <AppLayout><HistoryPage /></AppLayout>
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

      {/* Fallback */}
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
