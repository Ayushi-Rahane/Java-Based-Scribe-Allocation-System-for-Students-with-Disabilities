import React, { useState } from "react";
import { Search, History } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Avatar, Stars, EmptyState } from "../components/UI";

export default function HistoryPage() {
  const { history } = useAuth();
  const [search, setSearch] = useState("");

  const filtered = history.filter(s => {
    const q = search.toLowerCase();
    return !q || s.studentName.toLowerCase().includes(q) || s.subject.toLowerCase().includes(q);
  });

  const avg = history.length ? (history.reduce((a,b)=>a+b.rating,0)/history.length).toFixed(1) : "—";
  const hrs = history.reduce((a,s)=>a+(parseFloat(s.duration)||0),0);

  return (
    <div style={{ padding:"28px 32px", background:"#f0eeff", minHeight:"100vh", fontFamily:"'Poppins', sans-serif" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:0, fontWeight:700, fontSize:22, color:"#1a1a2e" }}>Session History</h1>
        <p style={{ margin:"4px 0 0", fontSize:13, color:"#9e8fc0" }}>Your completed scribe assignments</p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {[
          { label:"Total Sessions", value:history.length },
          { label:"Avg Rating",     value:avg },
          { label:"Total Hours",    value:`${hrs}h` },
        ].map(({label,value})=>(
          <div key={label} style={{ background:"white", borderRadius:14, padding:"18px 20px", boxShadow:"0 2px 10px rgba(124,77,255,0.06)", textAlign:"center" }}>
            <div style={{ fontSize:26, fontWeight:800, color:"#7c4dff" }}>{value}</div>
            <div style={{ fontSize:12, color:"#9e8fc0", marginTop:4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position:"relative", marginBottom:20, maxWidth:400 }}>
        <Search size={15} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#b0a8cc" }}/>
        <input className="search-bar" style={{ paddingLeft:42, width:"100%" }} placeholder="Search sessions…"
          value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      {/* List */}
      {filtered.length === 0
        ? <EmptyState icon={History} title="No history yet" subtitle="Completed sessions appear here."/>
        : filtered.map((s,i)=>(
          <div key={s.id} className="animate-slide-up" style={{ animationDelay:`${i*0.04}s`, animationFillMode:"both" }}>
            <div style={{ background:"white", borderRadius:14, padding:"16px 20px", marginBottom:12, boxShadow:"0 2px 8px rgba(124,77,255,0.05)", border:"1px solid #f0eeff" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <Avatar name={s.studentName} size="md"/>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:14, color:"#1a1a2e" }}>{s.studentName}</div>
                      <div style={{ fontSize:11, color:"#9e8fc0", marginTop:2 }}>{s.subject} · {s.examDate} · {s.duration}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                      <Stars rating={s.rating}/>
                      <span className="badge badge-green" style={{ fontSize:10 }}>Completed</span>
                    </div>
                  </div>
                  {s.review && (
                    <p style={{ margin:"10px 0 0", fontSize:12, color:"#777", background:"#f8f6ff", borderRadius:8, padding:"8px 12px", lineHeight:1.6, fontStyle:"italic" }}>
                      "{s.review}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}
