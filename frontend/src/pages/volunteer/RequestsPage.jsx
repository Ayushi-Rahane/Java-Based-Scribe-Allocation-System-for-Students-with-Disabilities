import React, { useState } from "react";
import { Search, InboxIcon, Calendar, Clock, FileText, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Avatar, MatchScore, DisabilityBadge, EmptyState, Spinner, Toast } from "../../components/UI";

function RequestCard({ req, onAccept, onDecline }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(null);

  const timeAgo = (iso) => {
    const m = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h/24)}d ago`;
  };

  return (
    <div style={{
      background:"white", borderRadius:16, padding:20,
      boxShadow:"0 2px 12px rgba(124,77,255,0.06)",
      border:"1.5px solid #f0eeff", marginBottom:16,
      transition:"all 0.2s", fontFamily:"'Poppins', sans-serif",
    }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 6px 24px rgba(124,77,255,0.12)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(124,77,255,0.06)"}
    >
      {/* Top */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Avatar name={req.studentName} size="md" />
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:"#1a1a2e" }}>{req.studentName}</div>
            <div style={{ fontSize:11, color:"#9e8fc0", marginTop:2 }}>Posted {timeAgo(req.postedAt)} · {req.city}</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <MatchScore score={req.matchScore} />
          <button onClick={()=>setExpanded(!expanded)} style={{ background:"none", border:"none", cursor:"pointer", color:"#b0a8cc", padding:4 }}>
            <ChevronDown size={16} style={{ transform: expanded ? "rotate(180deg)" : "none", transition:"transform 0.2s" }} />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:14 }}>
        <span className="badge badge-purple">{req.subject}</span>
        <DisabilityBadge type={req.disability} />
        <span className="badge badge-gray">🗣 {req.language}</span>
      </div>

      {/* Exam info */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        {[
          { icon:Calendar, label:"Exam Date", value:req.examDate },
          { icon:Clock,    label:"Time",      value:req.examTime },
          { icon:Clock,    label:"Duration",  value:req.duration },
        ].map(({icon:Icon,label,value})=>(
          <div key={label} style={{ background:"#f8f6ff", borderRadius:10, padding:"10px 12px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4 }}>
              <Icon size={11} style={{ color:"#b0a8cc" }}/>
              <span style={{ fontSize:9, fontWeight:700, color:"#b0a8cc", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
            </div>
            <div style={{ fontSize:12, fontWeight:600, color:"#1a1a2e" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ borderTop:"1px solid #f5f0ff", paddingTop:14, marginBottom:14 }} className="animate-fade-in">
          {req.notes && (
            <div style={{ marginBottom:12 }}>
              <div className="label">Student Notes</div>
              <p style={{ margin:0, fontSize:13, color:"#555", background:"#f8f6ff", borderRadius:10, padding:"10px 14px", lineHeight:1.6 }}>{req.notes}</p>
            </div>
          )}
          {req.materials?.length > 0 && (
            <div>
              <div className="label">Materials</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {req.materials.map(m=>(
                  <div key={m} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8, background:"#f0eeff", color:"#7c4dff", fontSize:12, fontWeight:500 }}>
                    <FileText size={12}/>{m}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display:"flex", gap:10 }}>
        <button className="btn-purple" style={{ flex:1, justifyContent:"center" }}
          disabled={!!loading}
          onClick={async()=>{ setLoading("accept"); await onAccept(req.id); setLoading(null); }}>
          {loading==="accept" ? <Spinner size={15} color="white"/> : <><CheckCircle2 size={14}/> Accept</>}
        </button>
        <button className="btn-outline-purple" style={{ flex:1, justifyContent:"center" }}
          disabled={!!loading}
          onClick={async()=>{ setLoading("decline"); await onDecline(req.id); setLoading(null); }}>
          {loading==="decline" ? <Spinner size={15}/> : <><XCircle size={14}/> Decline</>}
        </button>
      </div>
    </div>
  );
}

export default function RequestsPage() {
  const { incomingRequests, acceptRequest, declineRequest } = useAuth();
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const filtered = [...incomingRequests]
    .filter(r => {
      const q = search.toLowerCase();
      return !q || r.studentName.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) || r.disability.toLowerCase().includes(q);
    })
    .sort((a,b) => b.matchScore - a.matchScore);

  return (
    <div style={{ padding:"28px 32px", background:"#f0eeff", minHeight:"100vh", fontFamily:"'Poppins', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:0, fontWeight:700, fontSize:22, color:"#1a1a2e" }}>Incoming Requests</h1>
        <p style={{ margin:"4px 0 0", fontSize:13, color:"#9e8fc0" }}>{incomingRequests.length} requests matching your profile</p>
      </div>

      {/* Search */}
      <div style={{ position:"relative", marginBottom:24, maxWidth:400 }}>
        <Search size={15} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#b0a8cc" }}/>
        <input className="search-bar" style={{ paddingLeft:42, width:"100%" }} placeholder="Search by student, subject…"
          value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {/* Cards */}
      {filtered.length === 0
        ? <EmptyState icon={InboxIcon} title="No requests found" subtitle="No incoming requests match your filters." />
        : filtered.map((req,i)=>(
          <div key={req.id} className="animate-slide-up" style={{ animationDelay:`${i*0.05}s`, animationFillMode:"both" }}>
            <RequestCard req={req}
              onAccept={async id=>{ const r=await acceptRequest(id); if(r.success) showToast("Request accepted! Check Active Assignments."); }}
              onDecline={async id=>{ await declineRequest(id); showToast("Request declined.","info"); }}
            />
          </div>
        ))
      }
      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </div>
  );
}
