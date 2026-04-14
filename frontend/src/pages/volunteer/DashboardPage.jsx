import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  InboxIcon, ClipboardCheck, Award, TrendingUp,
  ArrowRight, Search, Bell, Calendar, Clock, Zap,
  CheckCircle2, MapPin, Languages, Hand
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import volunteerService from "../../services/volunteerService";
import { Avatar, Stars, DisabilityBadge, MatchScore } from "../../components/UI";

const C = {
  primary:      "#4F46E5",
  primaryBg:    "#EDE9FE",
  primaryLight: "#F5F3FF",
  border:       "#DDD6FE",
  textMain:     "#1E1B4B",
  textMuted:    "#6D6A9C",
  textFaint:    "#A5B4FC",
};

// ─── Top Bar ─────────────────────────────────────────────────────────────────
function TopBar({ user, unreadCount, navigate }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
      <div style={{ position: "relative" }}>
        <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.textFaint }} />
        <input className="search-bar" placeholder="Search requests, students..." style={{ paddingLeft: 42 }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={() => navigate("/notifications")}
          style={{
            position: "relative", background: "white",
            border: `1.5px solid ${C.border}`, borderRadius: 12,
            width: 40, height: 40, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
          }}
        >
          <Bell size={17} style={{ color: C.primary }} />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute", top: -4, right: -4,
              background: "#DC2626", color: "white", borderRadius: "50%",
              width: 16, height: 16, fontSize: 9, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {unreadCount}
            </span>
          )}
        </button>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "white", borderRadius: 50,
            padding: "6px 14px 6px 6px",
            border: `1.5px solid ${C.border}`, cursor: "pointer",
          }}
          onClick={() => navigate("/profile")}
        >
          <Avatar name={user?.fullName || ""} size="sm" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.textMain, lineHeight: 1.2, fontFamily: "'Poppins', sans-serif" }}>
              {user?.fullName}
            </div>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'Poppins', sans-serif" }}>
              Volunteer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Welcome Banner ───────────────────────────────────────────────────────────
function WelcomeBanner({ user }) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="welcome-banner">
      <div style={{ position: "relative", zIndex: 1, maxWidth: "60%" }}>
        <p style={{ margin: "0 0 4px", fontSize: 12, opacity: 0.8, fontFamily: "'Poppins', sans-serif" }}>{date}</p>
        <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
          {greeting}, {user?.fullName?.split(" ")[0]}! <Hand size={26} className="text-yellow-400" />
        </h1>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.85, fontFamily: "'Poppins', sans-serif" }}>
          Always making a difference — keep up the amazing work!
        </p>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            background: "rgba(255,255,255,0.2)", borderRadius: 50,
            padding: "4px 14px", fontSize: 12, fontWeight: 500,
            fontFamily: "'Poppins', sans-serif",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={13} /> Verified Volunteer</span>
          </span>
          <span style={{
            background: "rgba(255,255,255,0.2)", borderRadius: 50,
            padding: "4px 14px", fontSize: 12, fontWeight: 500,
            fontFamily: "'Poppins', sans-serif",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {user?.city}, {user?.state}</span>
          </span>
        </div>
      </div>

      {/* Banner image */}
      <img
        src="/banner.png"
        alt="volunteer"
        style={{
          position: "absolute",
          right: 32,
          bottom: -110,
          height: "300px",
          objectFit: "contain",
          zIndex: 1,
        }}
      />
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, iconColor, iconBg, delay }) {
  return (
    <div
      className="stat-card-new animate-slide-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.textMain, lineHeight: 1, fontFamily: "'Poppins', sans-serif" }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3, fontFamily: "'Poppins', sans-serif" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── Request Card (preview) ───────────────────────────────────────────────────
function RequestCard({ req, navigate }) {
  return (
    <div
      style={{
        background: C.primaryLight, borderRadius: 14,
        padding: "14px 16px", marginBottom: 12,
        border: `1.5px solid ${C.border}`, transition: "all 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = "0 4px 14px rgba(79,70,229,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={req.studentName} size="sm" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.textMain, fontFamily: "'Poppins', sans-serif" }}>{req.studentName}</div>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Poppins', sans-serif" }}>{req.city}</div>
          </div>
        </div>
        <MatchScore score={req.matchScore} />
      </div>

      {/* Subject in big font */}
      <div style={{ fontSize: 17, fontWeight: 700, color: C.textMain, marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>
        {req.subject}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        <DisabilityBadge type={req.disability} />
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
        {[
          { icon: Calendar, text: req.examDate },
          { icon: Clock,    text: req.examTime },
        ].map(({ icon: Icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.textMuted, fontFamily: "'Poppins', sans-serif" }}>
            <Icon size={12} />{text}
          </div>
        ))}
      </div>

      <button
        className="btn-purple"
        style={{ width: "100%", justifyContent: "center", fontSize: 12 }}
        onClick={() => navigate("/requests")}
      >
        View & Accept <ArrowRight size={13} />
      </button>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, unreadCount } = useAuth();
  const navigate = useNavigate();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeAssignments, setActiveAssignments] = useState([]);
  const [completedHistory, setCompletedHistory] = useState([]);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [requests, active, history, profile] = await Promise.all([
        volunteerService.getMatchedRequests(),
        volunteerService.getActiveAssignments(),
        volunteerService.getHistory(),
        volunteerService.getProfile(),
      ]);
      setIncomingRequests(requests);
      setActiveAssignments(active);
      setCompletedHistory(history);
      setProfileData(profile);
    };
    fetchAll();
  }, []);

  const upcomingExam = activeAssignments.find(r => r.examDate && new Date(r.examDate) >= new Date());
  const totalSessions = profileData?.totalSessionsCompleted || user?.totalSessionsCompleted || 0;

  return (
    <div style={{ padding: "28px 32px", background: C.primaryLight, minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>

      {/* Top bar */}
      <TopBar user={user} unreadCount={unreadCount} navigate={navigate} />

      {/* Welcome banner */}
      <WelcomeBanner user={user} />

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 28 }}>
        <StatCard icon={InboxIcon}      label="Incoming Requests"  value={incomingRequests.length}        iconColor="#4F46E5" iconBg="#EDE9FE" delay={0.05} />
        <StatCard icon={ClipboardCheck} label="Active Assignments" value={activeAssignments.length}       iconColor="#059669" iconBg="#D1FAE5" delay={0.10} />
        <StatCard icon={TrendingUp}     label="Total Sessions"     value={totalSessions}                  iconColor="#0891B2" iconBg="#CFFAFE" delay={0.15} />
        <StatCard icon={Award}          label="Avg Rating"         value={profileData?.rating?.toFixed(1) || "—"}  iconColor="#D97706" iconBg="#FEF3C7" delay={0.20} />
      </div>

      {/* Main 2-col grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 22 }}>

        {/* Left: Incoming requests */}
        <div>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: C.textMain }}>Incoming Requests</h3>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: C.textMuted }}>Sorted by match score</p>
              </div>
              <button className="btn-ghost" onClick={() => navigate("/requests")}>
                See all <ArrowRight size={13} />
              </button>
            </div>
            {incomingRequests.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: C.textFaint, fontSize: 13 }}>
                No new requests right now.
              </div>
            ) : (
              incomingRequests.slice(0, 3).map(req => (
                <RequestCard key={req.id} req={req} navigate={navigate} />
              ))
            )}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Upcoming exam card */}
          <div style={{
            background: C.primary,
            borderRadius: 16, padding: 20, color: "white",
            position: "relative", overflow: "hidden",
            minHeight: 110,
          }}>
            <div style={{
              position: "absolute", right: -20, top: -20,
              width: 100, height: 100, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }} />
            {upcomingExam ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <Zap size={14} />
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>
                    Upcoming Exam
                  </span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{upcomingExam.subject}</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 2 }}>{upcomingExam.studentName}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>{upcomingExam.examDate} · {upcomingExam.examTime}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>No upcoming exams</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Accept a request to get started!</div>
              </>
            )}

            {/* Exam image */}
            <img
              src="/exam.png"
              alt=""
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                height: "90px",
                objectFit: "contain",
                zIndex: 1,
                opacity: 0.9,
              }}
            />
          </div>

          {/* Subjects */}
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textMain, marginBottom: 12 }}>Your Subjects</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {(user?.subjects || []).map(s => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textMain, marginBottom: 12 }}>Languages</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {(user?.languages || []).map(l => (
                <span key={l} style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "4px 12px", borderRadius: 50,
                  background: "#F3F4F6", color: "#374151",
                  fontSize: 12, fontWeight: 500,
                }}>
                  <Languages size={13} /> {l}
                </span>
              ))}
            </div>
          </div>

          {/* Recent sessions */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textMain }}>Recent Sessions</div>
              <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => navigate("/ratings")}>
                See all
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {completedHistory.length === 0 ? (
                <div style={{ textAlign: "center", padding: "16px 0", color: C.textFaint, fontSize: 12 }}>
                  No completed sessions yet.
                </div>
              ) : (
                completedHistory.slice(0, 3).map(h => (
                  <div key={h.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Avatar name={h.studentName || "Student"} size="sm" />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.textMain }}>{h.subject}</div>
                        <div style={{ fontSize: 11, color: C.textFaint }}>{h.studentName || "Student"}</div>
                      </div>
                    </div>
                    <Stars rating={h.rating || 0} />
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}