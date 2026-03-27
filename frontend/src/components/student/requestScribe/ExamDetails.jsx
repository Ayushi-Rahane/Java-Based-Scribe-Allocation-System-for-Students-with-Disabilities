import React, { useState } from "react";
import { 
    ArrowLeft, 
    ArrowRight, 
    Calendar, 
    Clock, 
    BookOpen, 
    Layers 
} from "lucide-react";

const durations = ["1 hour", "2 hours", "3 hours", "4 hours"];

const ExamDetails = ({ setStep, formData, updateFormData }) => {
    const [selectedDuration, setSelectedDuration] = useState(formData.duration || null);

    const handleNext = () => {
        // Validate before moving to next step
        if (!formData.subject || !formData.examType || !formData.examDate || !formData.examTime || !selectedDuration) {
            alert("Please fill in all fields before continuing");
            return;
        }
        setStep(2);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden animate-fadeIn">
            <div className="border-t-[6px] border-indigo-600 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <BookOpen size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Exam Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Subject / Course Name</label>
                        <div className="relative group">
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                placeholder="e.g. Advanced Calculus II"
                                value={formData.subject}
                                onChange={(e) => updateFormData('subject', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Exam Type */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Exam Type</label>
                        <div className="relative group">
                            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <select
                                value={formData.examType}
                                onChange={(e) => updateFormData('examType', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-slate-700 appearance-none cursor-pointer"
                            >
                                <option value="">Select type</option>
                                <option value="Midterm">Midterm</option>
                                <option value="Final">Final</option>
                                <option value="Quiz">Quiz</option>
                                <option value="Assignment">Assignment</option>
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type={formData.examDate ? "date" : "text"}
                                placeholder="Select Date"
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => {
                                    if (!e.target.value) e.target.type = "text";
                                }}
                                value={formData.examDate}
                                onChange={(e) => updateFormData('examDate', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Time</label>
                        <div className="relative group">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type={formData.examTime ? "time" : "text"}
                                placeholder="Select Time"
                                onFocus={(e) => (e.target.type = "time")}
                                onBlur={(e) => {
                                    if (!e.target.value) e.target.type = "text";
                                }}
                                value={formData.examTime}
                                onChange={(e) => updateFormData('examTime', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-slate-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Duration */}
                <div className="mt-10">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3">Duration (Hours)</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {durations.map((d) => (
                            <button
                                key={d}
                                onClick={() => {
                                    setSelectedDuration(d);
                                    updateFormData('duration', d);
                                }}
                                type="button"
                                className={`border-2 rounded-[20px] py-4 text-sm font-bold transition-all
                                ${selectedDuration === d
                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-600/10 scale-[1.02]"
                                        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-200 hover:bg-white"
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-between items-center px-8 py-6 border-t bg-slate-50/50">
                <button
                    type="button"
                    className="flex items-center gap-2 text-slate-400 px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-not-allowed border border-transparent"
                    disabled
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 transition-all active:scale-[0.98]"
                >
                    Next Step
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default ExamDetails;
