import React from "react";
import { ArrowLeft, ArrowRight, MessageSquare, AlertCircle, UploadCloud } from "lucide-react";

const ScribeRequirements = ({ setStep, formData, updateFormData }) => {
    const handleNext = () => {
        // Validate before moving to next step
        if (!formData.requirements) {
            alert("Please fill in the requirements before continuing");
            return;
        }
        setStep(3);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden animate-fadeIn">
            <div className="border-t-[6px] border-indigo-600 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <MessageSquare size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Scribe Requirements</h3>
                </div>

                <div className="space-y-6">
                    {/* Specific Requirements */}
                    <div className="space-y-3">
                        <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.1em] px-1">
                            Specific Requirements <span className="text-indigo-600">*</span>
                        </label>
                        <div className="relative group">
                             <textarea
                                placeholder="E.g., Need someone familiar with scientific notation, or need slow dictation support."
                                rows={8}
                                value={formData.requirements}
                                onChange={(e) => updateFormData('requirements', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-[28px] px-6 py-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-slate-700 resize-none leading-relaxed"
                            />
                        </div>
                        
                        <div className="flex items-start gap-2.5 px-2 text-slate-400 mt-2">
                            <AlertCircle size={14} className="mt-0.5" />
                            <p className="text-[12px] font-medium leading-relaxed">
                                Please provide detailed requirements to help us match you with the best volunteer. Mention any specific language needs, technical background, or accessibility accommodations.
                            </p>
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="space-y-3 pt-6 border-t border-slate-100">
                        <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.1em] px-1">
                            Study Materials & Resources <span className="text-slate-300 font-medium normal-case tracking-normal">(Optional)</span>
                        </label>
                        <div className="relative group">
                            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-200 border-dashed rounded-[28px] cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                                    <p className="mb-1 text-sm text-slate-500 font-medium"><span className="font-bold text-indigo-600">Click to upload</span> or drag and drop files here</p>
                                    <p className="text-xs text-slate-400 font-medium mt-1">PDF, DOCX, PPT, Images (Up to 100MB per file)</p>
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    multiple 
                                    onChange={(e) => updateFormData('materials', e.target.files)} 
                                />
                            </label>
                        </div>
                        
                        {/* Display uploaded files temporarily */}
                        {formData.materials && formData.materials.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2 animate-fadeIn">
                                {Array.from(formData.materials).map((file, i) => (
                                    <div key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-indigo-100 shadow-sm text-indigo-900 text-[13px] font-bold">
                                        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            📄
                                        </div>
                                        <span className="truncate max-w-[200px]">{file.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-between items-center px-8 py-6 border-t bg-slate-50/50">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-indigo-600 bg-white border border-indigo-100 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:bg-indigo-50 transition-all hover:scale-[1.02]"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 transition-all active:scale-[0.98]"
                >
                    Review & Preview
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default ScribeRequirements;
