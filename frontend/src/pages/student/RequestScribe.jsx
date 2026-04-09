import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Check, 
    ChevronRight, 
    FileText, 
    LayoutDashboard, 
    Loader2, 
    Sparkles 
} from "lucide-react";
import StudentSidebar from "../../components/student/StudentSidebar";
import ExamDetails from "../../components/student/requestScribe/ExamDetails";
import ScribeRequirements from "../../components/student/requestScribe/ScribeRequirements";
import ReviewStep from "../../components/student/requestScribe/ReviewStep";
import requestService from "../../services/requestService";
import { useAuth } from "../../context/AuthContext";

const RequestScribe = () => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Form data state
    const [formData, setFormData] = useState({
        subject: "",
        examType: "",
        examDate: "",
        examTime: "",
        duration: "",
        location: "",
        language: "",
        requirements: ""
    });

    // Update form data
    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate required fields
            if (!formData.subject || !formData.examType || !formData.examDate ||
                !formData.examTime || !formData.duration || !formData.location || !formData.language || !formData.requirements) {
                setError("Please fill in all required fields to proceed.");
                setLoading(false);
                return;
            }

            // Submit to backend
            const payload = {
                ...formData,
                duration: parseInt(formData.duration.split(" ")[0]),
                studentId: user?._id || user?.id
            };
            await requestService.createRequest(payload);

            // Show success modal
            setShowSuccess(true);

            // Redirect to dashboard after 2.5 seconds
            setTimeout(() => {
                navigate("/student/dashboard");
            }, 2500);

        } catch (err) {
            console.error("Error submitting request:", err);
            setError(err.message || "Failed to submit request. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <StudentSidebar />

            <div className="flex-1 md:ml-64 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 border-b bg-white flex items-center justify-between px-6 md:px-10 sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 md:hidden bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                            <FileText size={18} className="text-white" />
                        </div>
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest pl-10 md:pl-0">New Scribe Request</h2>
                    </div>

                    <button 
                        onClick={() => navigate("/student/dashboard")}
                        className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        <LayoutDashboard size={14} />
                        Back to Dashboard
                    </button>
                </header>

                <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                    {/* Header Section */}
                    <div className="max-w-4xl mx-auto text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[12px] font-bold mb-4 animate-fadeIn">
                             <Sparkles size={14} />
                             Matching with Best Volunteers
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Request an Assistant</h1>
                        <p className="text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                            Provide your exam details below. We'll broadcast your request to verified scribes matching your academic profile.
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="max-w-4xl mx-auto">
                        {/* Error Notification */}
                        {error && (
                            <div className="mb-8 bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-[24px] text-sm font-bold flex items-center gap-3 animate-slide-in">
                                <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Loader2 className="animate-spin text-rose-600" size={16} />
                                </div>
                                {error}
                            </div>
                        )}

                        {/* Stepper Progress */}
                        <Stepper currentStep={step} />

                        {/* Animated Step Rendering */}
                        <div className="transition-all duration-300 transform">
                            {step === 1 && (
                                <ExamDetails
                                    setStep={setStep}
                                    formData={formData}
                                    updateFormData={updateFormData}
                                />
                            )}
                            {step === 2 && (
                                <ScribeRequirements
                                    setStep={setStep}
                                    formData={formData}
                                    updateFormData={updateFormData}
                                />
                            )}
                            {step === 3 && (
                                <ReviewStep
                                    setStep={setStep}
                                    onSubmit={handleSubmit}
                                    formData={formData}
                                    loading={loading}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Success Feedback Overlay */}
            {showSuccess && <SuccessModal />}
        </div>
    );
};

/* ---------------- Components ---------------- */

const Stepper = ({ currentStep }) => {
    const steps = [
        { label: "Exam Details", icon: "01" },
        { label: "Scribe Needs", icon: "02" },
        { label: "Review", icon: "03" }
    ];

    return (
        <div className="flex items-center justify-center max-w-2xl mx-auto mb-12 relative overflow-x-auto pb-4 no-scrollbar">
            {steps.map((s, index) => {
                const stepNum = index + 1;
                const isActive = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;

                return (
                    <React.Fragment key={s.label}>
                        <div className="flex flex-col items-center flex-shrink-0 relative">
                            <div
                                className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-[20px] text-sm font-black transition-all duration-500
                  ${isCompleted
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                        : isActive
                                            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 scale-110"
                                            : "bg-white border-2 border-slate-100 text-slate-300"
                                    }`}
                            >
                                {isCompleted ? (
                                    <Check size={20} strokeWidth={3} className="animate-scaleIn" />
                                ) : (
                                    <span>{s.icon}</span>
                                )}
                            </div>

                            <span
                                className={`mt-3 text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-300 ${isActive || isCompleted ? "text-indigo-600" : "text-slate-300"
                                    }`}
                            >
                                {s.label}
                            </span>
                            
                            {isActive && (
                                <div className="absolute -bottom-2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                            )}
                        </div>

                        {index !== steps.length - 1 && (
                            <div className="mx-4 mb-8 flex-shrink-0 flex items-center">
                                <div className={`w-10 md:w-20 lg:w-32 h-[3px] rounded-full transition-all duration-700 ${isCompleted ? "bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]" : "bg-slate-100"}`} />
                                <ChevronRight className={`transition-colors duration-300 ${isCompleted ? 'text-indigo-600' : 'text-slate-100'}`} size={16} />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const SuccessModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] animate-fadeIn">
        <div className="bg-white rounded-[40px] p-12 max-w-md mx-4 text-center shadow-3xl border border-slate-100 animate-scaleIn relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-indigo-600"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
            
            {/* Success Icon */}
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-emerald-500/5">
                <Check size={40} strokeWidth={3} className="animate-scaleIn" />
            </div>

            {/* Message */}
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Request Sent!</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Your scribe request has been successfully broadcasted. You'll receive a notification as soon as a volunteer accepts.
            </p>

            {/* Loading indicator */}
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Redirecting to Dashboard</p>
            </div>
        </div>
    </div>
);

export default RequestScribe;
