import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Plus, X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../components/UI";

const SUBJECTS  = ["Mathematics","Physics","Chemistry","Biology","English","History","Computer Science","Economics","Geography"];
const LANGUAGES = ["English","Hindi","Marathi","Tamil","Telugu","Bengali","Gujarati","Kannada"];
const DAYS      = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const SLOTS     = [
  { key: "morning",   label: "Morning",   time: "8AM–12PM" },
  { key: "afternoon", label: "Afternoon", time: "12PM–5PM" },
  { key: "evening",   label: "Evening",   time: "5PM–9PM" },
];
const STEPS = ["Account", "Skills", "Availability", "Review"];

const defaultAvail = () => DAYS.reduce((a, d) => ({ ...a, [d]: { morning:false, afternoon:false, evening:false } }), {});

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subInput, setSubInput] = useState("");
  const [langInput, setLangInput] = useState("");

  const [form, setForm] = useState({
    fullName:"", email:"", password:"", confirmPassword:"",
    phone:"", dateOfBirth:"", city:"", state:"",
    subjects:[], languages:[], availability: defaultAvail(),
  });

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));
  const addTag = (f, v, setI) => { if (v && !form[f].includes(v)) setForm(p => ({ ...p, [f]: [...p[f], v] })); setI(""); };
  const removeTag = (f, v) => setForm(p => ({ ...p, [f]: p[f].filter(x => x !== v) }));
  const toggleAvail = (day, slot) => setForm(p => ({ ...p, availability: { ...p.availability, [day]: { ...p.availability[day], [slot]: !p.availability[day][slot] } } }));

  const validate = () => {
    if (step === 0) {
      if (!form.fullName || !form.email || !form.password || !form.phone || !form.dateOfBirth) return "Fill all required fields.";
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
      if (form.password.length < 8) return "Password must be 8+ characters.";
    }
    if (step === 1) {
      if (!form.city || !form.state) return "City and State required.";
      if (!form.subjects.length) return "Add at least one subject.";
      if (!form.languages.length) return "Add at least one language.";
    }
    return null;
  };

  const next = () => { const e = validate(); if (e) { setError(e); return; } setError(""); setStep(s => s + 1); };
  const back = () => { setError(""); setStep(s => s - 1); };

  const handleSubmit = async () => {
    setLoading(true); setError("");
    const res = await register({ ...form, role: "volunteer" });
    setLoading(false);
    if (res.success) navigate("/dashboard");
    else setError(res.error || "Registration failed.");
  };

  const S = { fontFamily: "'Poppins', sans-serif" };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#f0eeff,#e8e0ff)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, ...S }}>
      <div style={{ width:"100%", maxWidth: 640 }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center", marginBottom:28 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#7c4dff,#b57bee)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(124,77,255,0.35)" }}>
            <BookOpen size={19} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight:800, fontSize:18, color:"#1a1a2e" }}>ScribeConnect</span>
        </div>

        {/* Step indicator */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:24 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{
                  width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, fontWeight:700,
                  background: i < step ? "#7c4dff" : i === step ? "#ede9ff" : "#f5f0ff",
                  color: i < step ? "white" : i === step ? "#7c4dff" : "#c4b8e0",
                  border: i === step ? "2px solid #7c4dff" : "2px solid transparent",
                  transition:"all 0.2s",
                }}>
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                <span style={{ fontSize:12, color: i === step ? "#1a1a2e" : "#b0a8cc", fontWeight: i === step ? 600 : 400, display:"none" }}
                  className="sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ height:2, width:40, background: i < step ? "#7c4dff" : "#e0d9ff", borderRadius:2, transition:"background 0.3s" }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div style={{ background:"white", borderRadius:20, padding:36, boxShadow:"0 8px 40px rgba(124,77,255,0.1)" }} className="animate-fade-in">
          {error && (
            <div style={{ background:"#fff0f0", border:"1px solid #ffcdd2", borderRadius:10, padding:"10px 14px", marginBottom:20, fontSize:13, color:"#e74c3c" }}>
              {error}
            </div>
          )}

          {/* Step 0 */}
          {step === 0 && (
            <div>
              <h2 style={{ margin:"0 0 20px", fontWeight:700, fontSize:18, color:"#1a1a2e" }}>Personal & Account Info</h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {[
                  { label:"Full Name *",     field:"fullName",        type:"text",  placeholder:"Aryan Mehta" },
                  { label:"Email *",         field:"email",           type:"email", placeholder:"aryan@example.com" },
                  { label:"Phone *",         field:"phone",           type:"tel",   placeholder:"+91 98765 43210" },
                  { label:"Date of Birth *", field:"dateOfBirth",     type:"date",  placeholder:"" },
                  { label:"Password *",      field:"password",        type:"password", placeholder:"Min 8 chars" },
                  { label:"Confirm Password *", field:"confirmPassword", type:"password", placeholder:"Repeat password" },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field}>
                    <label className="label">{label}</label>
                    <input className="input-field" type={type} placeholder={placeholder} value={form[field]} onChange={set(field)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 style={{ margin:"0 0 20px", fontWeight:700, fontSize:18, color:"#1a1a2e" }}>Location & Skills</h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
                <div><label className="label">City *</label><input className="input-field" placeholder="Mumbai" value={form.city} onChange={set("city")} /></div>
                <div><label className="label">State *</label><input className="input-field" placeholder="Maharashtra" value={form.state} onChange={set("state")} /></div>
              </div>
              <div style={{ marginBottom:18 }}>
                <label className="label">Subjects *</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:10 }}>
                  {form.subjects.map(s => (
                    <span key={s} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:50, background:"#ede9ff", color:"#7c4dff", fontSize:12, fontWeight:500 }}>
                      {s} <button onClick={() => removeTag("subjects",s)} style={{ background:"none",border:"none",cursor:"pointer",color:"#7c4dff",padding:0,lineHeight:1 }}><X size={10}/></button>
                    </span>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <select className="select-field" value={subInput} onChange={e=>setSubInput(e.target.value)}>
                    <option value="">Add a subject...</option>
                    {SUBJECTS.filter(s=>!form.subjects.includes(s)).map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="btn-purple" onClick={()=>addTag("subjects",subInput,setSubInput)} disabled={!subInput} style={{ whiteSpace:"nowrap", padding:"9px 16px" }}>
                    <Plus size={14}/> Add
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Languages *</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:10 }}>
                  {form.languages.map(l => (
                    <span key={l} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:50, background:"#f5f5f5", color:"#666", fontSize:12, fontWeight:500 }}>
                      {l} <button onClick={()=>removeTag("languages",l)} style={{ background:"none",border:"none",cursor:"pointer",color:"#999",padding:0,lineHeight:1 }}><X size={10}/></button>
                    </span>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <select className="select-field" value={langInput} onChange={e=>setLangInput(e.target.value)}>
                    <option value="">Add a language...</option>
                    {LANGUAGES.filter(l=>!form.languages.includes(l)).map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                  <button className="btn-purple" onClick={()=>addTag("languages",langInput,setLangInput)} disabled={!langInput} style={{ whiteSpace:"nowrap", padding:"9px 16px" }}>
                    <Plus size={14}/> Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 style={{ margin:"0 0 6px", fontWeight:700, fontSize:18, color:"#1a1a2e" }}>Availability Schedule</h2>
              <p style={{ margin:"0 0 20px", fontSize:13, color:"#9e8fc0" }}>Select days and times you can volunteer.</p>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign:"left", fontSize:11, fontWeight:700, color:"#b0a8cc", textTransform:"uppercase", letterSpacing:"0.08em", paddingBottom:12, width:110 }}>Day</th>
                      {SLOTS.map(sl => (
                        <th key={sl.key} style={{ textAlign:"center", paddingBottom:12, paddingLeft:8, paddingRight:8 }}>
                          <div style={{ fontSize:11, fontWeight:600, color:"#1a1a2e" }}>{sl.label}</div>
                          <div style={{ fontSize:10, color:"#b0a8cc" }}>{sl.time}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map(day => (
                      <tr key={day} style={{ borderTop:"1px solid #f5f0ff" }}>
                        <td style={{ padding:"10px 0", fontSize:13, color:"#1a1a2e", fontWeight:500 }}>{day}</td>
                        {SLOTS.map(sl => (
                          <td key={sl.key} style={{ textAlign:"center", padding:"10px 8px" }}>
                            <button type="button" onClick={()=>toggleAvail(day,sl.key)} style={{
                              width:30, height:30, borderRadius:8, cursor:"pointer", border:"none",
                              background: form.availability[day][sl.key] ? "#7c4dff" : "#f5f0ff",
                              color: form.availability[day][sl.key] ? "white" : "#c4b8e0",
                              display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto",
                              transition:"all 0.15s",
                            }}>
                              {form.availability[day][sl.key] && <Check size={13}/>}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 style={{ margin:"0 0 20px", fontWeight:700, fontSize:18, color:"#1a1a2e" }}>Review Your Profile</h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[
                  ["Full Name", form.fullName],["Email", form.email],
                  ["Phone", form.phone],["Date of Birth", form.dateOfBirth],
                  ["City", form.city],["State", form.state],
                ].map(([lbl, val]) => (
                  <div key={lbl} style={{ background:"#f8f6ff", borderRadius:12, padding:"12px 16px", border:"1px solid #e0d9ff" }}>
                    <div className="label" style={{ marginBottom:4 }}>{lbl}</div>
                    <div style={{ fontSize:13, color:"#1a1a2e", fontWeight:500 }}>{val || "—"}</div>
                  </div>
                ))}
                <div style={{ background:"#f8f6ff", borderRadius:12, padding:"12px 16px", border:"1px solid #e0d9ff" }}>
                  <div className="label" style={{ marginBottom:8 }}>Subjects</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {form.subjects.map(s=><span key={s} style={{ padding:"2px 10px", borderRadius:50, background:"#ede9ff", color:"#7c4dff", fontSize:11, fontWeight:600 }}>{s}</span>)}
                  </div>
                </div>
                <div style={{ background:"#f8f6ff", borderRadius:12, padding:"12px 16px", border:"1px solid #e0d9ff" }}>
                  <div className="label" style={{ marginBottom:8 }}>Languages</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {form.languages.map(l=><span key={l} style={{ padding:"2px 10px", borderRadius:50, background:"#f5f5f5", color:"#666", fontSize:11, fontWeight:500 }}>{l}</span>)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:28 }}>
            {step > 0
              ? <button onClick={back} className="btn-outline-purple"><ChevronLeft size={15}/> Back</button>
              : <Link to="/login" style={{ display:"inline-flex", alignItems:"center", gap:6, color:"#7c4dff", fontWeight:600, fontSize:13, textDecoration:"none" }}><ChevronLeft size={15} /> Login</Link>
            }
            {step < STEPS.length - 1
              ? <button onClick={next} className="btn-purple">Next <ChevronRight size={15}/></button>
              : <button onClick={handleSubmit} disabled={loading} className="btn-purple" style={{ padding:"10px 28px" }}>
                  {loading ? <Spinner size={16} color="white"/> : "Create Account 🎉"}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
