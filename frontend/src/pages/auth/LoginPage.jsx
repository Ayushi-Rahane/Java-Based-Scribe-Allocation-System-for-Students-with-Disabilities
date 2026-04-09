import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Users,
  Mail,
  Lock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../components/UI";

const ROLES = [
  { key: "student", label: "Student", icon: GraduationCap },
  { key: "volunteer", label: "Volunteer", icon: Users },
];

/* ── inline styles ──────────────────────────────────────── */
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0eeff 0%, #e8e0ff 50%, #f5f3ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "fixed",
    top: -120,
    right: -120,
    width: 400,
    height: 400,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "fixed",
    bottom: -100,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(165,180,252,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  blob3: {
    position: "fixed",
    top: "40%",
    left: "10%",
    width: 200,
    height: 200,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124,77,255,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: 460,
    position: "relative",
    zIndex: 1,
  },
  // Logo brain icon
  logoWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4F46E5 0%, #7c4dff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 28px rgba(79,70,229,0.35)",
    marginBottom: 18,
  },
  logoTitle: {
    fontWeight: 800,
    fontSize: 26,
    color: "#1a1a2e",
    margin: "0 0 4px",
    letterSpacing: "-0.02em",
  },
  logoSub: {
    fontSize: 14,
    color: "#9e8fc0",
    fontWeight: 400,
    margin: 0,
  },
  // Role tabs
  tabRow: {
    display: "flex",
    justifyContent: "center",
    gap: 0,
    marginBottom: 28,
    background: "white",
    borderRadius: 50,
    padding: 4,
    boxShadow: "0 2px 12px rgba(79,70,229,0.08)",
    border: "1.5px solid #EDE9FE",
  },
  tab: (active) => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "11px 20px",
    borderRadius: 50,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
    background: active
      ? "linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)"
      : "transparent",
    color: active ? "white" : "#6D6A9C",
    boxShadow: active ? "0 4px 14px rgba(79,70,229,0.3)" : "none",
  }),
  // Card
  card: {
    background: "white",
    borderRadius: 24,
    padding: "36px 32px 32px",
    boxShadow: "0 12px 48px rgba(79,70,229,0.10), 0 2px 8px rgba(79,70,229,0.06)",
    border: "1px solid rgba(237,233,254,0.6)",
  },
  cardTitle: {
    margin: "0 0 4px",
    fontWeight: 700,
    fontSize: 22,
    color: "#1a1a2e",
  },
  cardSubtitle: (role) => ({
    margin: "0 0 28px",
    fontSize: 14,
    color: "#9e8fc0",
    lineHeight: 1.4,
  }),
  // Input group
  inputGroup: { marginBottom: 20 },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: 600,
    color: "#7c4dff",
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.15s",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    color: "#A5B4FC",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    background: "#F5F3FF",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "#DDD6FE",
    borderRadius: 12,
    padding: "12px 44px 12px 42px",
    color: "#1E1B4B",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#b0a8cc",
    display: "flex",
    alignItems: "center",
  },
  // Remember me
  rememberRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 22,
  },
  checkbox: {
    accentColor: "#4F46E5",
    width: 16,
    height: 16,
    cursor: "pointer",
  },
  rememberLabel: {
    fontSize: 13,
    color: "#6D6A9C",
    cursor: "pointer",
    userSelect: "none",
  },
  // Submit
  submitBtn: {
    width: "100%",
    padding: "14px",
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "'Poppins', sans-serif",
    color: "white",
    background: "linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)",
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.2s",
    boxShadow: "0 4px 18px rgba(79,70,229,0.35)",
  },
  submitBtnHover: {
    boxShadow: "0 6px 24px rgba(79,70,229,0.45)",
    transform: "translateY(-1px)",
  },
  // Divider
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#EDE9FE",
  },
  dividerText: {
    fontSize: 11,
    fontWeight: 600,
    color: "#b0a8cc",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    whiteSpace: "nowrap",
  },
  // Social buttons
  socialRow: {
    display: "flex",
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "11px 16px",
    border: "1.5px solid #DDD6FE",
    borderRadius: 12,
    background: "white",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#1E1B4B",
    transition: "all 0.2s",
  },
  // Footer
  footerText: {
    textAlign: "center",
    margin: "22px 0 0",
    fontSize: 14,
    color: "#9e8fc0",
  },
  footerLink: {
    color: "#4F46E5",
    fontWeight: 600,
    textDecoration: "none",
  },
  demoText: {
    textAlign: "center",
    fontSize: 11,
    color: "#b0a8cc",
    marginTop: 16,
  },
};

/* ── SVG icons for social buttons ───────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z" />
    <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 23 23">
    <rect fill="#F25022" x="1" y="1" width="10" height="10" />
    <rect fill="#7FBA00" x="12" y="1" width="10" height="10" />
    <rect fill="#00A4EF" x="1" y="12" width="10" height="10" />
    <rect fill="#FFB900" x="12" y="12" width="10" height="10" />
  </svg>
);

/* ── Component ──────────────────────────────────────────── */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [socialHover, setSocialHover] = useState(null);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(form.email, form.password, role);
    setLoading(false);
    if (res.success) navigate("/dashboard");
    else setError(res.error || "Invalid credentials.");
  };

  const roleLabel = role === "student" ? "student" : "volunteer";

  return (
    <div style={styles.wrapper}>
      {/* Decorative blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.container}>
        {/* Logo / Brand */}
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}>
            <BookOpen size={28} color="white" strokeWidth={2.2} />
          </div>
          <h1 style={styles.logoTitle}>Welcome to ScribeConnect</h1>
          <p style={styles.logoSub}>Sign in to access your dashboard</p>
        </div>

        {/* Role Tabs */}
        <div style={styles.tabRow}>
          {ROLES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setRole(key);
                setError("");
              }}
              style={styles.tab(role === key)}
            >
              <Icon size={17} strokeWidth={role === key ? 2.5 : 2} />
              {label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={styles.card} className="animate-slide-up">
          <h2 style={styles.cardTitle}>Login</h2>
          <p style={styles.cardSubtitle(role)}>
            Enter your credentials to access your {roleLabel} account.
          </p>

          {/* Error message */}
          {error && (
            <div
              style={{
                background: "#f0eeff",
                border: "1px solid #DDD6FE",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 20,
                fontSize: 13,
                color: "#4F46E5",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Lock size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <label className="label">Email</label>
              </div>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <Mail size={16} />
                </span>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                  autoFocus
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4F46E5";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(79,70,229,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#DDD6FE";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <label className="label">Password</label>
                <a href="#" style={styles.forgotLink}>
                  Forgot password?
                </a>
              </div>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <Lock size={16} />
                </span>
                <input
                  style={{ ...styles.input, paddingRight: 44 }}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4F46E5";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(79,70,229,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#DDD6FE";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={styles.eyeBtn}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div style={styles.rememberRow}>
              <input
                type="checkbox"
                id="remember"
                style={styles.checkbox}
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember" style={styles.rememberLabel}>
                Remember me for 30 days
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(btnHover && !loading ? styles.submitBtnHover : {}),
                ...(loading ? { opacity: 0.7, cursor: "not-allowed" } : {}),
              }}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              {loading ? (
                <Spinner size={18} color="white" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or continue with</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Social buttons */}
          <div style={styles.socialRow}>
            <button
              type="button"
              style={{
                ...styles.socialBtn,
                ...(socialHover === "google"
                  ? {
                    borderColor: "#4F46E5",
                    boxShadow: "0 2px 8px rgba(79,70,229,0.12)",
                    transform: "translateY(-1px)",
                  }
                  : {}),
              }}
              onMouseEnter={() => setSocialHover("google")}
              onMouseLeave={() => setSocialHover(null)}
            >
              <GoogleIcon />
              Google
            </button>
            <button
              type="button"
              style={{
                ...styles.socialBtn,
                ...(socialHover === "microsoft"
                  ? {
                    borderColor: "#4F46E5",
                    boxShadow: "0 2px 8px rgba(79,70,229,0.12)",
                    transform: "translateY(-1px)",
                  }
                  : {}),
              }}
              onMouseEnter={() => setSocialHover("microsoft")}
              onMouseLeave={() => setSocialHover(null)}
            >
              <MicrosoftIcon />
              Microsoft
            </button>
          </div>

          {/* Footer link */}
          <p style={styles.footerText}>
            Don't have an account?{" "}
            <Link to={role === "volunteer" ? "/register/volunteer" : "/register"} style={styles.footerLink}>
              Sign up
            </Link>
          </p>
        </div>

        <p style={styles.demoText}>
          Demo: enter any email + any password
        </p>
      </div>
    </div>
  );
}
