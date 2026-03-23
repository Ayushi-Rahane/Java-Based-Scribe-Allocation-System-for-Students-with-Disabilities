import React from "react";
import { Loader2 } from "lucide-react";

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 18, color = "#7c4dff", className = "" }) => (
  <Loader2 size={size} className={`animate-spin ${className}`} style={{ color }} />
);

// ─── Page loader ──────────────────────────────────────────────────────────────
export const PageLoader = () => (
  <div style={{ minHeight: "100vh", background: "#f0eeff", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: "linear-gradient(135deg, #7c4dff, #b57bee)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Spinner size={22} color="white" />
      </div>
      <p style={{ color: "#9e8fc0", fontSize: 13, fontFamily: "'Poppins', sans-serif" }}>Loading…</p>
    </div>
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, subtitle, action }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: 14 }}>
    <div style={{
      width: 60, height: 60, borderRadius: 16,
      background: "#f5f0ff", border: "1.5px solid #e0d9ff",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {Icon && <Icon size={26} style={{ color: "#b0a8cc" }} />}
    </div>
    <div style={{ textAlign: "center" }}>
      <p style={{ fontWeight: 600, fontSize: 15, color: "#1a1a2e", margin: "0 0 4px", fontFamily: "'Poppins', sans-serif" }}>{title}</p>
      {subtitle && <p style={{ fontSize: 13, color: "#9e8fc0", margin: 0, fontFamily: "'Poppins', sans-serif" }}>{subtitle}</p>}
    </div>
    {action && <div style={{ marginTop: 4 }}>{action}</div>}
  </div>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
export const Avatar = ({ name = "", size = "md", className = "" }) => {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
  const sizes = { sm: 32, md: 40, lg: 52, xl: 72 };
  const fontSize = { sm: 12, md: 14, lg: 18, xl: 24 };
  const gradients = [
    "linear-gradient(135deg, #7c4dff, #b57bee)",
    "linear-gradient(135deg, #2196f3, #64b5f6)",
    "linear-gradient(135deg, #ff6b6b, #ff8e53)",
    "linear-gradient(135deg, #11998e, #38ef7d)",
    "linear-gradient(135deg, #f953c6, #b91d73)",
    "linear-gradient(135deg, #f7971e, #ffd200)",
  ];
  const grad = gradients[name.charCodeAt(0) % gradients.length];
  const s = sizes[size] || 40;

  return (
    <div style={{
      width: s, height: s, borderRadius: "50%",
      background: grad,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontWeight: 700, fontSize: fontSize[size] || 14,
      fontFamily: "'Poppins', sans-serif", flexShrink: 0,
    }} className={className}>
      {initials}
    </div>
  );
};

// ─── Match Score ──────────────────────────────────────────────────────────────
export const MatchScore = ({ score }) => {
  const bg = score >= 90 ? "#7c4dff" : score >= 75 ? "#27ae60" : "#f39c12";
  return (
    <span style={{
      background: bg + "18", color: bg,
      border: `1px solid ${bg}30`,
      borderRadius: 50, padding: "2px 10px",
      fontSize: 11, fontWeight: 700,
      fontFamily: "'Poppins', sans-serif",
      display: "inline-flex", alignItems: "center", gap: 3,
    }}>
      ⚡ {score}% match
    </span>
  );
};

// ─── Stars ────────────────────────────────────────────────────────────────────
export const Stars = ({ rating, max = 5 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} style={{ fontSize: 13, color: i < Math.round(rating) ? "#f39c12" : "#e0d9ff" }}>★</span>
    ))}
  </div>
);

// ─── Disability Badge ─────────────────────────────────────────────────────────
export const DisabilityBadge = ({ type }) => {
  const map = {
    "Visual Impairment":   { emoji: "👁", bg: "#e8f4ff", color: "#2196f3" },
    "Hearing Impairment":  { emoji: "👂", bg: "#f3e8ff", color: "#9c27b0" },
    "Motor Disability":    { emoji: "🤲", bg: "#fff3e8", color: "#ff9800" },
    "Learning Disability": { emoji: "🧠", bg: "#ffe8f0", color: "#e91e63" },
    "Multiple Disabilities":{ emoji: "♿", bg: "#e8fff5", color: "#00bcd4" },
  };
  const s = map[type] || { emoji: "♿", bg: "#f5f5f5", color: "#888" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 50,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600,
      fontFamily: "'Poppins', sans-serif",
    }}>
      {s.emoji} {type}
    </span>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────────────
export const Toast = ({ message, type = "success", onClose }) => {
  const styles = {
    success: { bg: "#e8f8f0", color: "#27ae60", border: "#27ae6030" },
    error:   { bg: "#fff0f0", color: "#e74c3c", border: "#e74c3c30" },
    info:    { bg: "#f0edff", color: "#7c4dff", border: "#7c4dff30" },
  };
  const s = styles[type] || styles.success;
  return (
    <div className="animate-slide-up" style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 18px", borderRadius: 12,
      background: s.bg, border: `1px solid ${s.border}`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      fontFamily: "'Poppins', sans-serif",
    }}>
      <span style={{ fontSize: 13, color: s.color, fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", color: s.color, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>✕</button>
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
export const SectionHeader = ({ title, subtitle, right }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
    <div>
      <h2 style={{ margin: 0, fontWeight: 700, fontSize: 17, color: "#1a1a2e", fontFamily: "'Poppins', sans-serif" }}>{title}</h2>
      {subtitle && <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9e8fc0", fontFamily: "'Poppins', sans-serif" }}>{subtitle}</p>}
    </div>
    {right && <div>{right}</div>}
  </div>
);

// ─── Info row ─────────────────────────────────────────────────────────────────
export const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <span style={{ fontSize: 10, fontWeight: 600, color: "#b0a8cc", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Poppins', sans-serif" }}>{label}</span>
    <span style={{ fontSize: 13, color: "#1a1a2e", fontFamily: "'Poppins', sans-serif" }}>{value || "—"}</span>
  </div>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
export const Divider = () => (
  <div style={{ height: 1, background: "#f5f0ff", margin: "14px 0" }} />
);
