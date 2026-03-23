import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, Calendar, Clock, Download, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Avatar, DisabilityBadge, EmptyState } from "../../components/UI";

function ActiveCard({ req }) {
  const daysUntil = Math.ceil((new Date(req.examDate) - new Date()) / (1000*60*60*24));
  const urgent = daysUntil <= 1 ? "urgent" : daysUntil <= 3 ? "soon" : "normal";
  const urgencyColor = { urgent:"#e74c3c", soon:"#f39c12", normal:"#7c4dff" };
  const urgencyBg    = { urgent:"#fff0f0", soon:"#fff8e8", normal:"#f0eeff" };
  const urgencyText  = { urgent:"Tomorrow!", soon:`${daysUntil} days`, normal:`${daysUntil} days` };

  return (
    <div style={{
      background:"white", borderRadius:16, padding:22,
      boxShadow:"0 2px 12px rgba(124,77,255,0.06)",
      border: urgent==="urgent" ? "1.5px solid #ffcdd2" : urgent==="soon" ? "1.5px solid #ffe0b2" : "1.5px solid #f0eeff",
      marginBottom:18, fontFamily:"'Poppins', sans-serif",
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Avatar name={req.studentName} size="md"/>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:"#1a1a2e" }}>{req.studentName}</div>
            <div style={{ fontSize:11, color:"#9e8fc0", marginTop:2 }}>{req.city}, {req.state}</div>
          </div>
        </div>
        <span style={{
          padding:"4px 12px", borderRadius:50, fontSize:11, fontWeight:700,
          background:urgencyBg[urgent], color:urgencyColor[urgent],
          display:"flex", alignItems:"center", gap:4,
        }}>
          {urgent==="urgent" && <Zap size={11}/>}
          {urgencyText[urgent]}
        </span>
      </div>

      {/* Tags */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:14 }}>
        <span className="badge badge-purple">{req.subject}</span>
        <DisabilityBadge type={req.disability}/>
        <span className="badge badge-gray">🗣 {req.language}</span>
      </div>

      {/* Info grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
        {[
          {icon:Calendar,label:"Date",    value:req.examDate},
          {icon:Clock,   label:"Time",    value:req.examTime},
          {icon:Clock,   label:"Duration",value:req.duration},
        ].map(({icon:Icon,label,value})=>(
          <div key={label} style={{ background:"#f8f6ff", borderRadius:10, padding:"10px 12px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>
              <Icon size={11} style={{ color:"#b0a8cc" }}/>
              <span style={{ fontSize:9, fontWeight:700, color:"#b0a8cc", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
            </div>
            <div style={{ fontSize:12, fontWeight:600, color:"#1a1a2e" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {req.notes && (
        <div style={{ marginBottom:14 }}>
          <div className="label">Instructions</div>
          <p style={{ margin:0, fontSize:13, color:"#555", background:"#f8f6ff", borderRadius:10, padding:"10px 14px", lineHeight:1.6 }}>{req.notes}</p>
        </div>
      )}

      {/* Materials */}
      {req.materials?.length > 0 && (
        <div style={{ marginBottom:14 }}>
          <div className="label">Study Materials</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {req.materials.map(m=>(
              <button key={m} style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"7px 14px", borderRadius:8,
                background:"#f0eeff", color:"#7c4dff",
                border:"1px solid #e0d9ff", cursor:"pointer",
                fontSize:12, fontWeight:500, fontFamily:"'Poppins', sans-serif",
              }}>
                <Download size={12}/>{m}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:12, borderTop:"1px solid #f5f0ff" }}>
        <span className="badge badge-green">● Accepted</span>
        <span style={{ fontSize:11, color:"#b0a8cc" }}>Accepted {new Date(req.acceptedAt).toLocaleDateString("en-IN")}</span>
      </div>
    </div>
  );
}

export default function ActivePage() {
  const { activeRequests } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding:"28px 32px", background:"#f0eeff", minHeight:"100vh", fontFamily:"'Poppins', sans-serif" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:0, fontWeight:700, fontSize:22, color:"#1a1a2e" }}>Active Assignments</h1>
        <p style={{ margin:"4px 0 0", fontSize:13, color:"#9e8fc0" }}>{activeRequests.length} exam{activeRequests.length!==1?"s":""} you've committed to</p>
      </div>

      {activeRequests.length === 0
        ? <EmptyState icon={ClipboardCheck} title="No active assignments"
            subtitle="Accept a request to see it here."
            action={<button className="btn-purple" onClick={()=>navigate("/requests")}>Browse Requests</button>}/>
        : activeRequests.map((req,i)=>(
          <div key={req.id} className="animate-slide-up" style={{ animationDelay:`${i*0.07}s`, animationFillMode:"both" }}>
            <ActiveCard req={req}/>
          </div>
        ))
      }
    </div>
  );
}
