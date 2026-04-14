import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck, Calendar, Clock, Download, Zap,
  CheckCircle2, Loader2, Languages, MapPin
} from "lucide-react";
import volunteerService from "../../services/volunteerService";
import { Avatar, DisabilityBadge, EmptyState } from "../../components/UI";

function ActiveCard({ req }) {
  const daysUntil = req.examDate
    ? Math.ceil((new Date(req.examDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;
  const urgent = daysUntil !== null && daysUntil <= 1 ? "urgent"
    : daysUntil !== null && daysUntil <= 3 ? "soon" : "normal";
  const urgencyColor = { urgent: "#e74c3c", soon: "#f39c12", normal: "#7c4dff" };
  const urgencyBg   = { urgent: "#fff0f0", soon: "#fff8e8", normal: "#f0eeff" };
  const urgencyText = { urgent: "Tomorrow!", soon: `${daysUntil} days`, normal: `${daysUntil} days` };

  return (
    <div style={{
      background: "white", borderRadius: 16, padding: 22,
      boxShadow: "0 2px 12px rgba(124,77,255,0.06)",
      border: urgent === "urgent" ? "1.5px solid #ffcdd2"
            : urgent === "soon" ? "1.5px solid #ffe0b2" : "1.5px solid #f0eeff",
      marginBottom: 18, fontFamily: "'Poppins', sans-serif",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={req.studentName || "Student"} size="md" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>{req.studentName || "Student"}</div>
            <div style={{ fontSize: 11, color: "#9e8fc0", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={10} /> {req.city}, {req.state}
            </div>
          </div>
        </div>
        {daysUntil !== null && (
          <span style={{
            padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700,
            background: urgencyBg[urgent], color: urgencyColor[urgent],
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {urgent === "urgent" && <Zap size={11} />}
            {urgencyText[urgent]}
          </span>
        )}
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }}>
        <span className="badge badge-purple">{req.subject}</span>
        {req.disabilityType && <DisabilityBadge type={req.disabilityType} />}
        {req.preferredLanguage && (
          <span className="badge badge-gray" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Languages size={11} /> {req.preferredLanguage}
          </span>
        )}
      </div>

      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
        {[
          { icon: Calendar, label: "Date",     value: req.examDate },
          { icon: Clock,    label: "Time",     value: req.examTime },
          { icon: Clock,    label: "Duration", value: req.duration ? `${req.duration} hrs` : "N/A" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} style={{ background: "#f8f6ff", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
              <Icon size={11} style={{ color: "#b0a8cc" }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: "#b0a8cc", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a2e" }}>{value || "—"}</div>
          </div>
        ))}
      </div>

      {/* Materials */}
      {req.materials?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div className="label">Study Materials</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {req.materials.map(m => (
              <a key={m} href={`/api/files/${m}`} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 8,
                background: "#f0eeff", color: "#7c4dff",
                border: "1px solid #e0d9ff", cursor: "pointer",
                fontSize: 12, fontWeight: 500,
                textDecoration: "none",
              }}>
                <Download size={12} />{m}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #f5f0ff", gap: 12 }}>
        <span className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <CheckCircle2 size={11} /> Accepted
        </span>
        <p style={{ margin: 0, fontSize: 11, color: "#9e8fc0", fontStyle: "italic" }}>
          Student will mark this session as complete.
        </p>
      </div>
    </div>
  );
}

export default function ActivePage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    const data = await volunteerService.getActiveAssignments();
    setAssignments(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: "28px 32px", background: "#f0eeff", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#1a1a2e" }}>Active Assignments</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9e8fc0" }}>
          {loading ? "Loading..." : `${assignments.length} exam${assignments.length !== 1 ? "s" : ""} you've committed to`}
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Loader2 size={40} className="animate-spin" style={{ color: "#7c4dff" }} />
        </div>
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No active assignments"
          subtitle="Accept a request to see it here."
          action={<button className="btn-purple" onClick={() => navigate("/requests")}>Browse Requests</button>}
        />
      ) : (
        assignments.map((req, i) => (
          <div key={req.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
            <ActiveCard req={req} />
          </div>
        ))
      )}
    </div>
  );
}
