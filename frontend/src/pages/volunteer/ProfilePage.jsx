import React, { useState } from "react";
import { Edit3, Save, X, Plus, Check, Camera, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Avatar, Spinner, Toast } from "../../components/UI";

const SUBJECTS  = ["Mathematics","Physics","Chemistry","Biology","English","History","Computer Science","Economics","Geography"];
const LANGUAGES = ["English","Hindi","Marathi","Tamil","Telugu","Bengali","Gujarati","Kannada"];
const DAYS      = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const SLOTS     = [
  {key:"morning",  label:"Morning",   time:"8–12"},
  {key:"afternoon",label:"Afternoon", time:"12–5"},
  {key:"evening",  label:"Evening",   time:"5–9"},
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [subInput, setSubInput] = useState("");
  const [langInput, setLangInput] = useState("");

  const [form, setForm] = useState({
    fullName: user?.fullName||"", email:user?.email||"", phone:user?.phone||"",
    dateOfBirth:user?.dateOfBirth||"", city:user?.city||"", state:user?.state||"",
    subjects:[...(user?.subjects||[])], languages:[...(user?.languages||[])],
    availability: JSON.parse(JSON.stringify(user?.availability||{})),
  });

  const set = (f) => (e) => setForm(p=>({...p,[f]:e.target.value}));
  const addTag = (f,v,setI) => { if(v&&!form[f].includes(v)) setForm(p=>({...p,[f]:[...p[f],v]})); setI(""); };
  const removeTag = (f,v) => setForm(p=>({...p,[f]:p[f].filter(x=>x!==v)}));
  const toggleAvail = (day,slot) => setForm(p=>({...p,availability:{...p.availability,[day]:{...p.availability[day],[slot]:!p.availability[day][slot]}}}));

  const handleSave = async () => {
    setLoading(true);
    const res = await updateProfile(form);
    setLoading(false);
    if(res.success){ setEditing(false); setToast({msg:"Profile updated!",type:"success"}); setTimeout(()=>setToast(null),3000); }
    else setToast({msg:"Update failed.",type:"error"});
  };

  const handleCancel = () => {
    setForm({ fullName:user?.fullName||"", email:user?.email||"", phone:user?.phone||"",
      dateOfBirth:user?.dateOfBirth||"", city:user?.city||"", state:user?.state||"",
      subjects:[...(user?.subjects||[])], languages:[...(user?.languages||[])],
      availability:JSON.parse(JSON.stringify(user?.availability||{})),
    });
    setEditing(false);
  };

  const card = { background:"white", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(124,77,255,0.06)", marginBottom:18 };
  const S = { fontFamily:"'Poppins', sans-serif" };

  return (
    <div style={{ padding:"28px 32px", background:"#f0eeff", minHeight:"100vh", ...S }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <h1 style={{ margin:0, fontWeight:700, fontSize:22, color:"#1a1a2e" }}>My Profile</h1>
          <p style={{ margin:"4px 0 0", fontSize:13, color:"#9e8fc0" }}>Manage your volunteer information</p>
        </div>
        {!editing
          ? <button className="btn-outline-purple" onClick={()=>setEditing(true)}><Edit3 size={14}/> Edit Profile</button>
          : <div style={{ display:"flex", gap:10 }}>
              <button className="btn-outline-purple" onClick={handleCancel}><X size={14}/> Cancel</button>
              <button className="btn-purple" onClick={handleSave} disabled={loading}>
                {loading ? <Spinner size={14} color="white"/> : <><Save size={14}/> Save</>}
              </button>
            </div>
        }
      </div>

      {/* Avatar + info */}
      <div style={{ ...card, display:"flex", alignItems:"center", gap:20 }}>
        <div style={{ position:"relative" }}>
          <Avatar name={user?.fullName||""} size="xl"/>
          {editing && (
            <button style={{
              position:"absolute", bottom:0, right:0, width:26, height:26, borderRadius:"50%",
              background:"#7c4dff", border:"2px solid white", display:"flex", alignItems:"center",
              justifyContent:"center", cursor:"pointer",
            }}>
              <Camera size={12} color="white"/>
            </button>
          )}
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:20, color:"#1a1a2e" }}>{user?.fullName}</div>
          <div style={{ fontSize:13, color:"#9e8fc0", marginTop:2 }}>{user?.email}</div>
          <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
            {user?.verified && <span className="badge badge-green">✓ Verified</span>}
            <span className="badge badge-purple">📍 {user?.city}, {user?.state}</span>
            <span className="badge badge-amber">⭐ {user?.rating} rating</span>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div style={card}>
        <div style={{ fontWeight:700, fontSize:15, color:"#1a1a2e", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
          <User size={16} style={{ color:"#7c4dff" }}/> Personal Information
        </div>
        {editing ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              {label:"Full Name *",     field:"fullName",    type:"text",     placeholder:"Your name"},
              {label:"Email *",         field:"email",       type:"email",    placeholder:"you@example.com"},
              {label:"Phone *",         field:"phone",       type:"tel",      placeholder:"+91 98765 43210"},
              {label:"Date of Birth",   field:"dateOfBirth", type:"date",     placeholder:""},
              {label:"City *",          field:"city",        type:"text",     placeholder:"Mumbai"},
              {label:"State *",         field:"state",       type:"text",     placeholder:"Maharashtra"},
            ].map(({label,field,type,placeholder})=>(
              <div key={field}>
                <label className="label">{label}</label>
                <input className="input-field" type={type} placeholder={placeholder} value={form[field]} onChange={set(field)}/>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            {[
              {icon:User,     label:"Full Name",     value:user?.fullName},
              {icon:Mail,     label:"Email",         value:user?.email},
              {icon:Phone,    label:"Phone",         value:user?.phone},
              {icon:Calendar, label:"Date of Birth", value:user?.dateOfBirth},
              {icon:MapPin,   label:"City",          value:user?.city},
              {icon:MapPin,   label:"State",         value:user?.state},
            ].map(({icon:Icon,label,value})=>(
              <div key={label}>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4 }}>
                  <Icon size={11} style={{ color:"#b0a8cc" }}/>
                  <span className="label" style={{ margin:0 }}>{label}</span>
                </div>
                <div style={{ fontSize:13, color:"#1a1a2e", fontWeight:500 }}>{value||"—"}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills */}
      <div style={card}>
        <div style={{ fontWeight:700, fontSize:15, color:"#1a1a2e", marginBottom:18 }}>Skills & Languages</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <div>
            <label className="label">Subjects</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom: editing ? 10 : 0 }}>
              {(editing ? form.subjects : user?.subjects||[]).map(s=>(
                <span key={s} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:50, background:"#ede9ff", color:"#7c4dff", fontSize:12, fontWeight:500 }}>
                  {s}
                  {editing && <button onClick={()=>removeTag("subjects",s)} style={{ background:"none",border:"none",cursor:"pointer",color:"#7c4dff",padding:0 }}><X size={10}/></button>}
                </span>
              ))}
            </div>
            {editing && (
              <div style={{ display:"flex", gap:8 }}>
                <select className="select-field" value={subInput} onChange={e=>setSubInput(e.target.value)}>
                  <option value="">Add subject...</option>
                  {SUBJECTS.filter(s=>!form.subjects.includes(s)).map(s=><option key={s}>{s}</option>)}
                </select>
                <button className="btn-purple" onClick={()=>addTag("subjects",subInput,setSubInput)} disabled={!subInput} style={{ padding:"9px 14px", whiteSpace:"nowrap" }}>
                  <Plus size={13}/>
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="label">Languages</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom: editing ? 10 : 0 }}>
              {(editing ? form.languages : user?.languages||[]).map(l=>(
                <span key={l} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:50, background:"#f5f5f5", color:"#666", fontSize:12, fontWeight:500 }}>
                  🌐 {l}
                  {editing && <button onClick={()=>removeTag("languages",l)} style={{ background:"none",border:"none",cursor:"pointer",color:"#999",padding:0 }}><X size={10}/></button>}
                </span>
              ))}
            </div>
            {editing && (
              <div style={{ display:"flex", gap:8 }}>
                <select className="select-field" value={langInput} onChange={e=>setLangInput(e.target.value)}>
                  <option value="">Add language...</option>
                  {LANGUAGES.filter(l=>!form.languages.includes(l)).map(l=><option key={l}>{l}</option>)}
                </select>
                <button className="btn-purple" onClick={()=>addTag("languages",langInput,setLangInput)} disabled={!langInput} style={{ padding:"9px 14px", whiteSpace:"nowrap" }}>
                  <Plus size={13}/>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Availability */}
      <div style={card}>
        <div style={{ fontWeight:700, fontSize:15, color:"#1a1a2e", marginBottom:18 }}>Availability Schedule</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign:"left", fontSize:11, fontWeight:700, color:"#b0a8cc", textTransform:"uppercase", letterSpacing:"0.08em", paddingBottom:12, width:110 }}>Day</th>
                {SLOTS.map(sl=>(
                  <th key={sl.key} style={{ textAlign:"center", paddingBottom:12, paddingLeft:8, paddingRight:8 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:"#1a1a2e" }}>{sl.label}</div>
                    <div style={{ fontSize:10, color:"#b0a8cc" }}>{sl.time}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map(day=>(
                <tr key={day} style={{ borderTop:"1px solid #f5f0ff" }}>
                  <td style={{ padding:"10px 0", fontSize:13, color:"#1a1a2e", fontWeight:500 }}>{day}</td>
                  {SLOTS.map(sl=>{
                    const avail = editing ? form.availability[day]?.[sl.key] : user?.availability?.[day]?.[sl.key];
                    return (
                      <td key={sl.key} style={{ textAlign:"center", padding:"10px 8px" }}>
                        {editing ? (
                          <button type="button" onClick={()=>toggleAvail(day,sl.key)} style={{
                            width:28, height:28, borderRadius:8, border:"none", cursor:"pointer",
                            background: avail ? "#7c4dff" : "#f5f0ff",
                            color: avail ? "white" : "#c4b8e0",
                            display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto",
                            transition:"all 0.15s",
                          }}>
                            {avail && <Check size={12}/>}
                          </button>
                        ) : (
                          <span style={{
                            display:"inline-flex", width:26, height:26, borderRadius:8,
                            alignItems:"center", justifyContent:"center", fontSize:12,
                            background: avail ? "#ede9ff" : "#f9f9f9",
                            color: avail ? "#7c4dff" : "#ccc",
                          }}>
                            {avail ? "✓" : "·"}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </div>
  );
}
