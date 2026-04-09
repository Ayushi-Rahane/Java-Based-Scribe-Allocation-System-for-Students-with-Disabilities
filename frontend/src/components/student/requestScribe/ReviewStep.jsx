import React from "react";
import { 
    ArrowLeft, 
    CheckCircle, 
    Calendar, 
    Clock, 
    FileText, 
    Info, 
    Layers, 
    Loader2, 
    ShieldCheck 
} from "lucide-react";

const ReviewStep = ({ setStep, onSubmit, formData, loading }) => {
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Format time for display
    const formatTime = (timeString) => {
        if (!timeString) return "Not set";
        return timeString;
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden animate-fadeIn">
            <div className="border-t-[6px] border-indigo-600 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Review Your Request</h3>
                </div>

                {/* Exam Summary */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-4 w-1 bg-indigo-600 rounded-full"></div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Exam Summary</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[28px] border border-slate-100">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Subject</p>
                            <p className="text-sm font-bold text-slate-900">{formData.subject || "Not set"}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Exam Type</p>
                            <div className="flex items-center gap-1.5">
                                <Layers size={12} className="text-indigo-600" />
                                <p className="text-sm font-bold text-slate-900">{formData.examType || "Not set"}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Date & Time</p>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={12} className="text-indigo-600" />
                                <p className="text-sm font-bold text-slate-900">
                                    {formatDate(formData.examDate)} at {formatTime(formData.examTime)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Duration</p>
                            <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-indigo-600" />
                                <p className="text-sm font-bold text-slate-900">{formData.duration || "Not set"}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Location</p>
                            <div className="flex items-center gap-1.5">
                                <FileText size={12} className="text-indigo-600" />
                                <p className="text-sm font-bold text-slate-900">{formData.location || "Not set"}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Language</p>
                            <div className="flex items-center gap-1.5">
                                <Layers size={12} className="text-indigo-600" />
                                <p className="text-sm font-bold text-slate-900">{formData.language || "Not set"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requirements */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-4 w-1 bg-indigo-600 rounded-full"></div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Specific Requirements</h4>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm">
                        <div className="flex gap-4">
                            <FileText size={20} className="text-indigo-600 mt-1 shrink-0" />
                            <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {formData.requirements || "No requirements specified"}
                            </p>
                        </div>
                        
                        {/* Display Files */}
                        {formData.materials && formData.materials.length > 0 && (
                            <div className="mt-5 pt-5 border-t border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Attached Materials</p>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(formData.materials).map((file, i) => (
                                        <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                                            📄 {file.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notice */}
                <div className="flex items-start gap-4 bg-indigo-50 border border-indigo-100/50 rounded-[24px] p-6">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600 shrink-0">
                        <Info size={20} />
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-sm font-bold text-indigo-900">Important Note</h5>
                        <p className="text-xs font-semibold text-indigo-700/80 leading-relaxed">
                            By submitting this request, you agree to our Code of Conduct and Exam Academic Integrity policy. Qualified volunteers will be notified instantly to assist you.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-between items-center px-8 py-6 border-t bg-slate-50/50">
                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-slate-500 bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all hover:scale-[1.02]"
                    disabled={loading}
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={loading}
                    className={`bg-emerald-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 transition-all flex items-center gap-2 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>Confirming...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle size={18} />
                            <span>Submit Request</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ReviewStep;
