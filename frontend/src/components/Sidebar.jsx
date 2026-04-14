import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, InboxIcon, ClipboardCheck,
  History, Award, User, Bell, LogOut, BookOpen,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard",          path: "/dashboard", icon: LayoutDashboard },
  { label: "Incoming Requests",  path: "/requests",  icon: InboxIcon },
  { label: "Active Assignments", path: "/active",    icon: ClipboardCheck },
  { label: "Ratings & History",  path: "/ratings",   icon: Award },
  { label: "My Profile",         path: "/profile",   icon: User },
];

const C = {
  primary:      "#4F46E5",
  primaryBg:    "#EDE9FE",
  primaryLight: "#F5F3FF",
  border:       "#EDE9FE",
  textMain:     "#1E1B4B",
  textMuted:    "#6D6A9C",
  textFaint:    "#A5B4FC",
};

export default function Sidebar() {
  const { user, logout, unreadCount } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initials = (name = "") =>
    name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";

  return (
    <aside style={{
      background: "white", width: 220, minWidth: 220, height: "100vh",
      display: "flex", flexDirection: "column",
      boxShadow: "4px 0 20px rgba(79,70,229,0.07)",
      borderRight: `1px solid ${C.border}`,
      fontFamily: "'Poppins', sans-serif", position: "relative", zIndex: 10,
    }}>

      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${C.primaryLight}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: C.primary,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
          }}>
            <BookOpen size={19} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.textMain, lineHeight: 1.3 }}>ScribeConnect</div>
            <div style={{ fontSize: 9, color: C.textFaint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.09em" }}>Volunteer Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        <div style={{ padding: "8px 20px 10px", fontSize: 9, fontWeight: 700, color: C.textFaint, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Main Menu
        </div>

        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const active = pathname === path || pathname.startsWith(path + "/");
          return (
            <button key={path} onClick={() => navigate(path)}
              style={{
                display: "flex", alignItems: "center", gap: 11, padding: "11px 20px",
                background: active ? C.primaryBg : "transparent",
                borderRight: `3px solid ${active ? C.primary : "transparent"}`,
                color: active ? C.primary : C.textMuted,
                fontWeight: active ? 600 : 500, fontSize: 13,
                cursor: "pointer", border: "none", width: "100%", textAlign: "left",
                transition: "all 0.15s", fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.primaryLight; e.currentTarget.style.color = C.primary; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; }}}
            >
              <Icon size={17} />
              <span style={{ flex: 1 }}>{label}</span>
              {path === "/requests" && unreadCount > 0 && (
                <span style={{ background: C.primary, color: "white", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}

        <div style={{ margin: "10px 20px", height: 1, background: C.primaryLight }} />

        {(() => {
          const active = pathname === "/notifications";
          return (
            <button onClick={() => navigate("/notifications")}
              style={{
                display: "flex", alignItems: "center", gap: 11, padding: "11px 20px",
                background: active ? C.primaryBg : "transparent",
                borderRight: `3px solid ${active ? C.primary : "transparent"}`,
                color: active ? C.primary : C.textMuted,
                fontWeight: active ? 600 : 500, fontSize: 13,
                cursor: "pointer", border: "none", width: "100%", textAlign: "left",
                transition: "all 0.15s", fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.primaryLight; e.currentTarget.style.color = C.primary; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; }}}
            >
              <Bell size={17} />
              <span style={{ flex: 1 }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{ background: "#DC2626", color: "white", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })()}
      </nav>

      {/* User footer */}
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.primaryLight}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
            {initials(user?.fullName)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.textMain, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.fullName}</div>
            <div style={{ fontSize: 10, color: C.textFaint }}>{user?.city}</div>
          </div>
        </div>
        <button onClick={logout}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif", width: "100%", transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#FECACA"}
          onMouseLeave={e => e.currentTarget.style.background = "#FEE2E2"}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );
}