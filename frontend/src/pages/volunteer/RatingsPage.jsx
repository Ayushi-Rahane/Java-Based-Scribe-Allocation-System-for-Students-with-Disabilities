import React, { useState, useEffect } from "react";
import { Search, History as HistoryIcon, Loader2, Star } from "lucide-react";
import volunteerService from "../../services/volunteerService";
import { Avatar, Stars, EmptyState } from "../../components/UI";

export default function RatingsPage() {
  const [certData, setCertData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [cData, hData] = await Promise.all([
      volunteerService.getCertificate(),
      volunteerService.getHistory()
    ]);
    setCertData(cData);
    setHistory(hData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0eeff" }}>
        <Loader2 size={48} className="animate-spin" style={{ color: "#7c4dff" }} />
      </div>
    );
  }

  const avg = certData?.averageRating || 0;
  const totalRatingsCount = certData?.totalRatings || 0;
  
  // Only count sessions that actually have a rating for the distribution
  const ratedHistory = history.filter(h => h.rating && h.rating > 0);
  const dist = [5,4,3,2,1].map(s => {
    const count = ratedHistory.filter(h => h.rating === s).length;
    const pct = ratedHistory.length ? Math.round((count / ratedHistory.length) * 100) : 0;
    return { star: s, count, pct };
  });

  const filtered = history.filter(s => {
    const q = search.toLowerCase();
    const studentName = (s.studentName || "").toLowerCase();
    const subject = (s.subject || "").toLowerCase();
    return !q || studentName.includes(q) || subject.includes(q);
  });

  return (
    <div style={{ padding: "28px 32px", background: "#f0eeff", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#1a1a2e" }}>Ratings & History</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9e8fc0" }}>Your impact on the academic community and previous assignments</p>
      </div>

      {/* Rating overview */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 22, boxShadow: "0 2px 12px rgba(124,77,255,0.06)" }}>
        <div style={{ display: "flex", gap: 36, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: "#7c4dff", lineHeight: 1 }}>{avg.toFixed(1)}</div>
            <Stars rating={avg} />
            <div style={{ fontSize: 11, color: "#9e8fc0", marginTop: 6 }}>{totalRatingsCount} student reviews</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            {dist.map(({ star, count, pct }) => (
              <div key={star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#f39c12", width: 20, display: "flex", alignItems: "center" }}>{star}<Star size={10} fill="currentColor" strokeWidth={2} style={{ marginLeft: 2 }} /></span>
                <div style={{ flex: 1, height: 8, background: "#f5f0ff", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "#f39c12", borderRadius: 4, transition: "width 0.5s" }} />
                </div>
                <span style={{ fontSize: 11, color: "#9e8fc0", width: 16, textAlign: "right" }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session History & Search */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e", margin: 0 }}>Session History & Feedback</h3>
            <div style={{ position: "relative", width: 300 }}>
                <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#b0a8cc" }} />
                <input
                  className="search-bar"
                  style={{ paddingLeft: 42, width: "100%", paddingRight: 14, paddingBottom: 10, paddingTop: 10, borderRadius: 12, border: "1px solid #e0d9ff", fontSize: 13 }}
                  placeholder="Search by student or subject…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
            </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={HistoryIcon} title="No history yet" subtitle="Completed sessions will appear here." />
        ) : (
          filtered.map((s, i) => (
            <div key={s.id || i} className="animate-slide-up" style={{ animationDelay: `${i * 0.04}s`, animationFillMode: "both" }}>
              <div style={{ background: "white", borderRadius: 14, padding: "16px 20px", marginBottom: 12, boxShadow: "0 2px 8px rgba(124,77,255,0.05)", border: "1px solid #f0eeff" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Avatar name={s.studentName || "S"} size="md" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>{s.studentName || "Anonymous Student"}</div>
                        <div style={{ fontSize: 11, color: "#9e8fc0", marginTop: 2 }}>
                          {s.subject} · {s.examDate} · {s.duration} hrs
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                        <Stars rating={s.rating || 0} />
                        <span className="badge badge-green" style={{ fontSize: 10 }}>Completed</span>
                      </div>
                    </div>
                    {s.review && (
                      <p style={{ margin: "10px 0 0", fontSize: 12, color: "#777", background: "#f8f6ff", borderRadius: 8, padding: "8px 12px", lineHeight: 1.6, fontStyle: "italic" }}>
                        "{s.review}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
