import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  User,
  GraduationCap,
  Accessibility,
  Settings,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../components/UI";

/* ── Step config ──────────────────────────────────────────── */
const STEP_CONFIG = [
  { num: 1, label: "Account", icon: User },
  { num: 2, label: "Academic", icon: GraduationCap },
  { num: 3, label: "Accessibility", icon: Accessibility },
  { num: 4, label: "Preferences", icon: Settings },
];

/* ── Inline styles ──────────────────────────────────────── */
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0eeff 0%, #e8e0ff 50%, #f5f3ff 100%)",
    padding: "40px 16px",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "fixed", top: -120, right: -120, width: 400, height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "fixed", bottom: -100, left: -100, width: 350, height: 350,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(165,180,252,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    maxWidth: 780,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  /* Header */
  headerWrap: {
    textAlign: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 64, height: 64, borderRadius: "50%",
    background: "linear-gradient(135deg, #4F46E5 0%, #7c4dff 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 8px 28px rgba(79,70,229,0.35)",
    margin: "0 auto 18px",
  },
  headerTitle: {
    fontWeight: 800, fontSize: 28, color: "#1a1a2e",
    margin: "0 0 6px", letterSpacing: "-0.02em",
  },
  headerSub: {
    fontSize: 15, color: "#9e8fc0", margin: 0, fontWeight: 400,
  },
  /* Stepper */
  stepperWrap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    padding: "0 12px",
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  stepCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  stepCircle: (active, completed) => ({
    width: 48, height: 48, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 600, fontSize: 16,
    background: completed
      ? "linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)"
      : active
        ? "linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)"
        : "#EDE9FE",
    color: completed || active ? "white" : "#9e8fc0",
    boxShadow: completed || active
      ? "0 4px 14px rgba(79,70,229,0.3)"
      : "none",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
  }),
  stepLabel: (active, completed) => ({
    fontSize: 12, marginTop: 8, fontWeight: active || completed ? 600 : 400,
    color: active || completed ? "#4F46E5" : "#b0a8cc",
    transition: "all 0.2s",
  }),
  stepLine: (completed) => ({
    height: 3, flex: 1, margin: "0 8px",
    borderRadius: 2,
    background: completed
      ? "linear-gradient(90deg, #4F46E5, #6366f1)"
      : "#E0D9FF",
    transition: "background 0.3s",
    marginTop: 23,
  }),
  /* Card */
  card: {
    background: "white",
    borderRadius: 24,
    padding: "32px 28px",
    boxShadow: "0 12px 48px rgba(79,70,229,0.10), 0 2px 8px rgba(79,70,229,0.06)",
    border: "1px solid rgba(237,233,254,0.6)",
  },
  sectionTitle: {
    margin: "0 0 6px", fontWeight: 700, fontSize: 20, color: "#1a1a2e",
  },
  sectionSub: {
    margin: "0 0 24px", fontSize: 14, color: "#9e8fc0",
  },
  /* Error */
  errorBox: {
    background: "#f0eeff",
    border: "1.5px solid #DDD6FE",
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: 24,
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
  errorIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    background: "#EDE9FE",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  errorTitle: {
    fontSize: 14, fontWeight: 600, color: "#4F46E5", margin: "0 0 2px",
  },
  errorMsg: {
    fontSize: 13, color: "#6D6A9C", margin: 0,
  },
  /* Grid */
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  /* Input */
  inputLabel: {
    display: "block", fontSize: 13, color: "#6D6A9C",
    fontWeight: 500, marginBottom: 6,
  },
  inputRequired: {
    color: "#4F46E5",
  },
  inputField: {
    width: "100%",
    background: "#F5F3FF",
    border: "1.5px solid #DDD6FE",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#1E1B4B",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  selectField: {
    width: "100%",
    background: "#F5F3FF",
    border: "1.5px solid #DDD6FE",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#1E1B4B",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  textareaField: {
    width: "100%",
    background: "#F5F3FF",
    border: "1.5px solid #DDD6FE",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#1E1B4B",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
    outline: "none",
    resize: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  /* Tags */
  tagWrap: {
    display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12,
  },
  tag: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "5px 14px", borderRadius: 50, fontSize: 13, fontWeight: 500,
    background: "#EDE9FE",
    color: "#4F46E5",
  },
  tagRemove: {
    background: "none", border: "none", cursor: "pointer",
    color: "#4F46E5",
    padding: 0, lineHeight: 1, display: "flex", alignItems: "center",
  },
  /* Note box */
  noteBox: {
    background: "#EDE9FE",
    border: "1.5px solid #DDD6FE",
    borderRadius: 12,
    padding: "14px 18px",
    marginTop: 20,
  },
  noteText: {
    fontSize: 13, color: "#4F46E5", margin: 0, lineHeight: 1.5,
  },
  /* Nav buttons */
  navRow: {
    display: "flex", justifyContent: "space-between",
    marginTop: 32, paddingTop: 24,
    borderTop: "1.5px solid #EDE9FE",
  },
  prevBtn: (disabled) => ({
    display: "flex", alignItems: "center", gap: 8,
    padding: "12px 24px", borderRadius: 12,
    fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600,
    border: "none", cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "#F5F3FF" : "#EDE9FE",
    color: disabled ? "#DDD6FE" : "#4F46E5",
    transition: "all 0.2s",
  }),
  nextBtn: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "12px 28px", borderRadius: 12,
    fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700,
    border: "none", cursor: "pointer",
    background: "linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)",
    color: "white",
    boxShadow: "0 4px 18px rgba(79,70,229,0.35)",
    transition: "all 0.2s",
  },
  /* Login link */
  loginLink: {
    textAlign: "center", fontSize: 14, color: "#9e8fc0", marginTop: 24,
  },
  loginAnchor: {
    color: "#4F46E5", fontWeight: 600, textDecoration: "none",
    cursor: "pointer",
  },
};

/* ── focus helpers ─────────────────────────────────────────── */
const onFocus = (e) => {
  e.target.style.borderColor = "#4F46E5";
  e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.12)";
};
const onBlur = (e) => {
  e.target.style.borderColor = "#DDD6FE";
  e.target.style.boxShadow = "none";
};

/* ── Reusable components ──────────────────────────────────── */
function InputField({ label, name, type = "text", value, onChange, required, placeholder }) {
  return (
    <div>
      <label style={S.inputLabel}>
        {label} {required && <span style={S.inputRequired}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={S.inputField}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <div>
      <label style={S.inputLabel}>
        {label} {required && <span style={S.inputRequired}>*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={S.selectField}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */
export default function StudentRegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subjectInput, setSubjectInput] = useState("");

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    university: "",
    course: "",
    city: "",
    state: "",
    // Disability Information
    disabilityType: "",
    certificateNumber: "",
    specificNeeds: "",
    // Academic Requirements
    currentYear: "",
    examFrequency: "",
    preferredSubjects: [],
    academicNotes: "",
    // Communication Preferences
    preferredLanguage: "",
    notificationMethod: "",
    preferredTime: "",
  });

  /* Handlers */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const addSubject = (e) => {
    if (e.key === "Enter" && subjectInput.trim()) {
      e.preventDefault();
      if (!formData.preferredSubjects.includes(subjectInput.trim())) {
        setFormData((p) => ({
          ...p,
          preferredSubjects: [...p.preferredSubjects, subjectInput.trim()],
        }));
      }
      setSubjectInput("");
    }
  };

  const removeSubject = (subject) => {
    setFormData((p) => ({
      ...p,
      preferredSubjects: p.preferredSubjects.filter((s) => s !== subject),
    }));
  };

  /* Validation */
  const validate = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password || !formData.phone || !formData.dateOfBirth || !formData.university || !formData.course || !formData.city || !formData.state)
        return "Please fill all required fields.";
      if (formData.password !== formData.confirmPassword)
        return "Passwords do not match.";
      if (formData.password.length < 8)
        return "Password must be at least 8 characters.";
    }
    if (step === 2) {
      if (!formData.currentYear || !formData.examFrequency)
        return "Current Year and Exam Frequency are required.";
    }
    if (step === 3) {
      if (!formData.disabilityType || !formData.specificNeeds)
        return "Disability type and specific needs are required.";
    }
    if (step === 4) {
      if (!formData.preferredLanguage || !formData.notificationMethod || !formData.preferredTime)
        return "Please fill all preference fields.";
    }
    return null;
  };

  const nextStep = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    const { confirmPassword, ...registrationData } = formData;
    const res = await register({ ...registrationData, role: "student" });
    setLoading(false);
    if (res.success) navigate("/dashboard");
    else setError(res.error || "Registration failed. Please try again.");
  };

  const [hoverNext, setHoverNext] = useState(false);
  const [hoverPrev, setHoverPrev] = useState(false);

  return (
    <div style={S.page}>
      <div style={S.blob1} />
      <div style={S.blob2} />

      <div style={S.container}>
        {/* Header */}
        <div style={S.headerWrap}>
          <div style={S.logoCircle}>
            <GraduationCap size={28} color="white" strokeWidth={2.2} />
          </div>
          <h1 style={S.headerTitle}>Student Registration</h1>
          <p style={S.headerSub}>Create your ScribeConnect student account</p>
        </div>

        {/* Stepper */}
        <div style={S.stepperWrap}>
          {STEP_CONFIG.map((s, idx) => {
            const completed = step > s.num;
            const active = step === s.num;
            const Icon = s.icon;
            return (
              <div key={s.num} style={S.stepItem}>
                <div style={S.stepCol}>
                  <div style={S.stepCircle(active, completed)}>
                    {completed ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                  </div>
                  <span style={S.stepLabel(active, completed)}>{s.label}</span>
                </div>
                {idx < 3 && <div style={S.stepLine(completed)} />}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div style={S.card}>
          <form onSubmit={handleSubmit}>
            {/* Error */}
            {error && (
              <div style={S.errorBox}>
                <div style={S.errorIconWrap}>
                  <X size={16} color="#4F46E5" />
                </div>
                <div>
                  <p style={S.errorTitle}>Registration Error</p>
                  <p style={S.errorMsg}>{error}</p>
                </div>
              </div>
            )}

            {/* ─── Step 1: Personal & Account ─── */}
            {step === 1 && (
              <div>
                <h2 style={S.sectionTitle}>Personal & Account Information</h2>
                <p style={S.sectionSub}>Create your student account to get started</p>
                <div style={S.grid2}>
                  <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Priya Sharma" />
                  <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="priya@example.com" />
                  <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Min 8 characters" />
                  <InputField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="Repeat password" />
                  <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" />
                  <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                  <InputField label="University / College" name="university" value={formData.university} onChange={handleChange} required placeholder="Mumbai University" />
                  <InputField label="Course / Program" name="course" value={formData.course} onChange={handleChange} required placeholder="B.Sc Computer Science" />
                  <InputField label="City" name="city" value={formData.city} onChange={handleChange} required placeholder="Mumbai" />
                  <InputField label="State" name="state" value={formData.state} onChange={handleChange} required placeholder="Maharashtra" />
                </div>
              </div>
            )}

            {/* ─── Step 2: Academic Information ─── */}
            {step === 2 && (
              <div>
                <h2 style={S.sectionTitle}>Academic Information</h2>
                <p style={S.sectionSub}>Tell us about your academic details</p>
                <div style={S.grid2}>
                  <InputField label="Current Year / Semester" name="currentYear" value={formData.currentYear} onChange={handleChange} required placeholder="e.g., 3rd Year, 5th Semester" />
                  <SelectField
                    label="Exam Frequency"
                    name="examFrequency"
                    value={formData.examFrequency}
                    onChange={handleChange}
                    options={["Weekly", "Monthly", "Quarterly", "Semester-wise"]}
                    required
                  />
                </div>

                {/* Preferred Subjects */}
                <div style={{ marginTop: 20 }}>
                  <label style={S.inputLabel}>
                    Preferred Subjects
                  </label>
                  <div style={S.tagWrap}>
                    {formData.preferredSubjects.map((subject) => (
                      <span key={subject} style={S.tag}>
                        {subject}
                        <button type="button" onClick={() => removeSubject(subject)} style={S.tagRemove}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyDown={addSubject}
                    placeholder="Type a subject and press Enter to add"
                    style={S.inputField}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                {/* Academic Notes */}
                <div style={{ marginTop: 20 }}>
                  <label style={S.inputLabel}>Additional Academic Notes</label>
                  <textarea
                    name="academicNotes"
                    value={formData.academicNotes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any additional information about your academic needs..."
                    style={S.textareaField}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>
            )}

            {/* ─── Step 3: Accessibility Information ─── */}
            {step === 3 && (
              <div>
                <h2 style={S.sectionTitle}>Accessibility Information</h2>
                <p style={S.sectionSub}>Help us understand your specific needs</p>
                <div style={S.grid2}>
                  <SelectField
                    label="Type of Disability"
                    name="disabilityType"
                    value={formData.disabilityType}
                    onChange={handleChange}
                    options={[
                      "Visual Impairment",
                      "Hearing Impairment",
                      "Motor Disability",
                      "Learning Disability",
                      "Multiple Disabilities",
                      "Other",
                    ]}
                    required
                  />
                  <InputField
                    label="Disability Certificate Number"
                    name="certificateNumber"
                    value={formData.certificateNumber}
                    onChange={handleChange}
                    placeholder="e.g., DIS/2024/12345"
                  />
                </div>

                <div style={{ marginTop: 20 }}>
                  <label style={S.inputLabel}>
                    Specific Needs / Accommodations Required <span style={S.inputRequired}>*</span>
                  </label>
                  <textarea
                    name="specificNeeds"
                    value={formData.specificNeeds}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your specific needs and accommodations required during exams..."
                    style={S.textareaField}
                    required
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <div style={S.noteBox}>
                  <p style={S.noteText}>
                    <strong>Note:</strong> All information is kept strictly confidential and used only to match you with the right scribe assistance.
                  </p>
                </div>
              </div>
            )}

            {/* ─── Step 4: Communication Preferences ─── */}
            {step === 4 && (
              <div>
                <h2 style={S.sectionTitle}>Communication Preferences</h2>
                <p style={S.sectionSub}>How would you like us to reach you?</p>
                <div style={S.grid2}>
                  <SelectField
                    label="Preferred Language"
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                    options={["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali"]}
                    required
                  />
                  <SelectField
                    label="Notification Method"
                    name="notificationMethod"
                    value={formData.notificationMethod}
                    onChange={handleChange}
                    options={["Email", "SMS", "WhatsApp", "All"]}
                    required
                  />
                  <SelectField
                    label="Preferred Time for Sessions"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    options={["Morning (6AM–12PM)", "Afternoon (12PM–6PM)", "Evening (6PM–10PM)", "Flexible"]}
                    required
                  />
                </div>

                <div style={S.noteBox}>
                  <p style={S.noteText}>
                    <strong>Note:</strong> You can update these preferences anytime from your profile settings after registration.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={S.navRow}>
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                style={{
                  ...S.prevBtn(step === 1),
                  ...(hoverPrev && step > 1
                    ? { background: "#DDD6FE", transform: "translateY(-1px)" }
                    : {}),
                }}
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    ...S.nextBtn,
                    ...(hoverNext
                      ? { boxShadow: "0 6px 24px rgba(79,70,229,0.45)", transform: "translateY(-1px)" }
                      : {}),
                  }}
                  onMouseEnter={() => setHoverNext(true)}
                  onMouseLeave={() => setHoverNext(false)}
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...S.nextBtn,
                    ...(loading ? { opacity: 0.7, cursor: "not-allowed" } : {}),
                    ...(hoverNext && !loading
                      ? { boxShadow: "0 6px 24px rgba(79,70,229,0.45)", transform: "translateY(-1px)" }
                      : {}),
                  }}
                  onMouseEnter={() => setHoverNext(true)}
                  onMouseLeave={() => setHoverNext(false)}
                >
                  {loading ? (
                    <Spinner size={18} color="white" />
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Login link */}
        <p style={S.loginLink}>
          Already have an account?{" "}
          <Link to="/login" style={S.loginAnchor}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
