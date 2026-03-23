import React from "react";
import { Bell, InboxIcon, Star, Award, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { EmptyState } from "../components/UI";

const typeConfig = {
  request:  { icon: InboxIcon, bg:"#f0eeff", color:"#7c4dff" },
  reminder: { icon: Clock,     bg:"#fff8e8", color:"#f39c12" },
  review:   { icon: Star,      bg:"#e8f8f0", color:"#27ae60" },
  badge:    { icon: Award,     bg:"#f8f0ff", color:"#9c27b0" },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useAuth();
  const unread = notifications.filter(n => !n.read);
  const read   = notifications.filter(n => n.read);

  const renderNotif = (n, i) => {
    const cfg = typeConfig[n.type] || typeConfig.request;
    const Icon = cfg.icon;
    return (
      <button key={n.id} onClick={() => markNotificationRead(n.id)}
        className="animate-slide-up"
        style={{
          width:"100%", textAlign:"left",
          display:"flex", alignItems:"flex-start", gap:14,
          padding:"14px 16px", borderRadius:14, border:"none", cursor:"pointer",
          background: n.read ? "#fafafa" : "white",
          boxShadow: n.read ? "none" : "0 2px 10px rgba(124,77,255,0.07)",
          border: n.read ? "1px solid #f0f0f0" : "1px solid #ede9ff",
          marginBottom:10, transition:"all 0.15s",
          fontFamily:"'Poppins', sans-serif",
          animationDelay:`${i*0.04}s`, animationFillMode:"both",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor="#b39ddb"}
        onMouseLeave={e => e.currentTarget.style.borderColor = n.read ? "#f0f0f0" : "#ede9ff"}
      >
        <div style={{
          width:38, height:38, borderRadius:10, flexShrink:0,
          background: cfg.bg, display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon size={17} style={{ color: cfg.color }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{
            margin:"0 0 4px", fontSize:13, lineHeight:1.5,
            color: n.read ? "#888" : "#1a1a2e",
            fontWeight: n.read ? 400 : 500,
          }}>
            {n.message}
          </p>
          <p style={{ margin:0, fontSize:11, color:"#b0a8cc" }}>{n.time}</p>
        </div>
        {!n.read && (
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#7c4dff", flexShrink:0, marginTop:6 }} />
        )}
      </button>
    );
  };

  return (
    <div style={{ padding:"28px 32px", background:"#f0eeff", minHeight:"100vh", fontFamily:"'Poppins', sans-serif" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:0, fontWeight:700, fontSize:22, color:"#1a1a2e" }}>Notifications</h1>
        <p style={{ margin:"4px 0 0", fontSize:13, color:"#9e8fc0" }}>
          {unread.length > 0 ? `${unread.length} unread notification${unread.length>1?"s":""}` : "You're all caught up!"}
        </p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet"
          subtitle="You'll be notified about new requests, reminders, and achievements here." />
      ) : (
        <div style={{ maxWidth:620 }}>
          {unread.length > 0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#b0a8cc", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>
                Unread
              </div>
              {unread.map((n, i) => renderNotif(n, i))}
            </div>
          )}
          {read.length > 0 && (
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#b0a8cc", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>
                Earlier
              </div>
              {read.map((n, i) => renderNotif(n, i))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
