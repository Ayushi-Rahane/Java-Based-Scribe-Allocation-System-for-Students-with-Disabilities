import React from "react";
import { Download } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Avatar, Stars } from "../components/UI";

const CERTS = [
  { id:"c1", title:"Dedicated Volunteer", subtitle:"Completed 10+ sessions", date:"Oct 2025", icon:"🏅", color:"#f39c12", bg:"#fff8e8" },
  { id:"c2", title:"Math Expert Scribe",  subtitle:"5 mathematics sessions",  date:"Sep 2025", icon:"🔢", color:"#7c4dff", bg:"#f0eeff" },
  { id:"c3", title:"Top Contributor",     subtitle:"Top 10% this semester",   date:"Aug 2025", icon:"🌟", color:"#9c27b0", bg:"#f8f0ff" },
];
const BADGES = [
  {label:"Top Contributor",icon:"🌟",earned:true},
  {label:"Math Expert",    icon:"🔢",earned:true},
  {label:"Multilingual",   icon:"🌐",earned:true},
  {label:"5-Star Streak",  icon:"⭐",earned:false},
  {label:"50 Sessions",    icon:"🏆",earned:false},
  {label:"Night Owl",      icon:"🦉",earned:false},
];

export default function RatingsPage() {
  const { user, history } = useAuth();
  const avg = history.length ? history.reduce((a,b)=>a+b.rating,0)/history.length : 0;
  const dist = [5,4,3,2,1].map(s=>({
    star:s, count:history.filter(h=>h.rating===s).length,
    pct:history.length ? Math.round(history.filter(h=>h.rating===s).length/history.length*100) : 0,
  }));

  return (
    <div style={{ padding:"28px 32px", background:"#f0eeff", minHeight:"100vh", fontFamily:"'Poppins', sans-serif" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:0, fontWeight:700, fontSize:22, color:"#1a1a2e" }}>Ratings & Certificates</h1>
        <p style={{ margin:"4px 0 0", fontSize:13, color:"#9e8fc0" }}>Your performance and recognition</p>
      </div>

      {/* Rating overview */}
      <div style={{ background:"white", borderRadius:16, padding:24, marginBottom:22, boxShadow:"0 2px 12px rgba(124,77,255,0.06)" }}>
        <div style={{ display:"flex", gap:36, alignItems:"flex-start", flexWrap:"wrap" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:52, fontWeight:800, color:"#7c4dff", lineHeight:1 }}>{avg.toFixed(1)}</div>
            <Stars rating={avg}/>
            <div style={{ fontSize:11, color:"#9e8fc0", marginTop:6 }}>{history.length} reviews</div>
          </div>
          <div style={{ flex:1, minWidth:200 }}>
            {dist.map(({star,count,pct})=>(
              <div key={star} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ fontSize:12, fontWeight:700, color:"#f39c12", width:20 }}>{star}★</span>
                <div style={{ flex:1, height:8, background:"#f5f0ff", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:"#f39c12", borderRadius:4, transition:"width 0.5s" }}/>
                </div>
                <span style={{ fontSize:11, color:"#9e8fc0", width:16, textAlign:"right" }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ marginBottom:22 }}>
        <h3 style={{ fontWeight:700, fontSize:16, color:"#1a1a2e", margin:"0 0 14px" }}>Recent Reviews</h3>
        {history.filter(h=>h.review).map((h,i)=>(
          <div key={h.id} style={{ background:"white", borderRadius:14, padding:"14px 18px", marginBottom:10, boxShadow:"0 2px 8px rgba(124,77,255,0.05)", border:"1px solid #f0eeff" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <Avatar name={h.studentName} size="sm"/>
              <div style={{ flex:1 }}>
                <span style={{ fontWeight:600, fontSize:13, color:"#1a1a2e" }}>{h.studentName}</span>
                <span style={{ fontSize:11, color:"#b0a8cc", marginLeft:8 }}>{h.subject}</span>
              </div>
              <Stars rating={h.rating}/>
            </div>
            <p style={{ margin:0, fontSize:12, color:"#777", fontStyle:"italic", lineHeight:1.6 }}>"{h.review}"</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div style={{ marginBottom:22 }}>
        <h3 style={{ fontWeight:700, fontSize:16, color:"#1a1a2e", margin:"0 0 14px" }}>Badges</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {BADGES.map(b=>(
            <div key={b.label} style={{
              background:"white", borderRadius:12, padding:"14px 16px",
              display:"flex", alignItems:"center", gap:10,
              border: b.earned ? "1.5px solid #e0d9ff" : "1.5px solid #f0f0f0",
              opacity: b.earned ? 1 : 0.45,
              boxShadow: b.earned ? "0 2px 10px rgba(124,77,255,0.06)" : "none",
            }}>
              <span style={{ fontSize:24 }}>{b.icon}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:"#1a1a2e" }}>{b.label}</div>
                <div style={{ fontSize:10, color: b.earned ? "#7c4dff" : "#bbb", marginTop:2 }}>{b.earned?"Earned":"Locked"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates */}
      <div>
        <h3 style={{ fontWeight:700, fontSize:16, color:"#1a1a2e", margin:"0 0 14px" }}>Certificates</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {CERTS.map(c=>(
            <div key={c.id} style={{
              background:`linear-gradient(135deg, ${c.bg} 0%, white 100%)`,
              border:`1.5px solid ${c.color}22`,
              borderRadius:16, padding:22,
              display:"flex", justifyContent:"space-between", alignItems:"center",
              position:"relative", overflow:"hidden",
              boxShadow:`0 4px 16px ${c.color}15`,
            }}>
              <div style={{ position:"absolute", right:-20, top:-20, width:90, height:90, borderRadius:"50%", background:`${c.color}12` }}/>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <span style={{ fontSize:36 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:c.color }}>{c.title}</div>
                  <div style={{ fontSize:12, color:"#555", marginTop:2 }}>{c.subtitle}</div>
                  <div style={{ fontSize:11, color:"#999", marginTop:4 }}>Issued {c.date}</div>
                </div>
              </div>
              <button className="btn-outline-purple" style={{ borderColor:c.color, color:c.color, fontSize:12, padding:"7px 16px" }}
                onClick={()=>alert("Download feature — connect to backend!")}>
                <Download size={13}/> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
