import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/UI";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) navigate("/dashboard");
    else setError(res.error || "Invalid credentials.");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0eeff 0%, #e8e0ff 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Poppins', sans-serif", padding: 20,
    }}>
      {/* Decorative blobs */}
      <div style={{ position: "fixed", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,77,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -80, left: -80, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(181,123,238,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 36 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg, #7c4dff, #b57bee)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 20px rgba(124,77,255,0.4)",
          }}>
            <BookOpen size={23} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#1a1a2e" }}>ScribeConnect</div>
            <div style={{ fontSize: 10, color: "#9e8fc0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Volunteer Portal</div>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: 20, padding: 36, boxShadow: "0 8px 40px rgba(124,77,255,0.12)" }}
          className="animate-slide-up">
          <h1 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 22, color: "#1a1a2e" }}>Welcome back 👋</h1>
          <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9e8fc0" }}>Sign in to your volunteer account</p>

          {error && (
            <div style={{
              background: "#fff0f0", border: "1px solid #ffcdd2", borderRadius: 10,
              padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#e74c3c",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label className="label">Email Address</label>
              <input className="input-field" type="email" placeholder="you@example.com"
                value={form.email} onChange={set("email")} required autoFocus />
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <input className="input-field" type={showPw ? "text" : "password"}
                  placeholder="••••••••" value={form.password} onChange={set("password")}
                  required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#b0a8cc" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-purple"
              style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 14, marginTop: 4 }}>
              {loading ? <Spinner size={18} color="white" /> : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          <p style={{ textAlign: "center", margin: "22px 0 0", fontSize: 13, color: "#9e8fc0" }}>
            New volunteer?{" "}
            <Link to="/register" style={{ color: "#7c4dff", fontWeight: 600, textDecoration: "none" }}>
              Create account
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#b0a8cc", marginTop: 16 }}>
          Demo: enter any email + any password
        </p>
      </div>
    </div>
  );
}
